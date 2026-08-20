// BFF 프록시의 본체 — 쿠키의 토큰을 Bearer로 바꿔 BE에 전달하고, 401이면 서버에서 한 번 갱신한다 (docs/auth.md · docs/security.md "프록시")
import 'server-only';

import {
  clearSessionCookieHeaders,
  readSessionCookies,
  sessionCookieHeaders,
} from '@/shared/auth/session-cookie';
import { isSameOriginRequest } from '@/shared/security/same-origin';

import type { BackendDeps } from '../../../_model/backend';
import { apiFailure } from '../../../_model/respond';
import {
  readIssuedTokens,
  type IssuedTokens,
} from '../../../_model/token-response';

export type ForwardDeps = BackendDeps;

const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
// 전달해도 되는 경로 — 이 밖은 전부 404. 로그인은 전용 route handler(/api/auth/social-login)가 따로 처리한다
const ALLOWED_PREFIXES = ['api/v1/admin/'];
const ALLOWED_EXACT = new Set(['api/v1/auth/logout']);
// BE에 그대로 넘기는 요청 헤더. 쿠키·호스트·기타는 넘기지 않는다
const FORWARDED_REQUEST_HEADERS = ['content-type', 'accept'];
const REFRESH_PATH = '/api/v1/auth/token/refresh';
// 갱신 결과를 옛 토큰 기준으로 잠시 기억한다 — BE refresh는 회전형이라, 브라우저가 새 쿠키를 받기 전에 옛 토큰으로 들어온
// 형제 요청이 다시 갱신을 시도하면 실패해 세션이 끊긴다. 이 창 안에서는 같은 결과를 돌려준다 (같은 인스턴스 안에서만)
const REFRESH_GRACE_MS = 30_000;

interface RefreshEntry {
  result: Promise<IssuedTokens | null>;
  expiresAt: number;
}
const refreshesByOldToken = new Map<string, RefreshEntry>();

/** 테스트 전용 — 모듈 수준 갱신 캐시를 비운다 (테스트 간 토큰 값이 같아 결과가 새지 않게) */
export function resetRefreshCacheForTests() {
  refreshesByOldToken.clear();
}

/**
 * `/api/proxy/{path}` 요청을 BE로 전달한다.
 *
 * @param request 브라우저에서 온 요청
 * @param pathSegments `[...path]` 세그먼트 — 예: `['api','v1','admin','users']`
 * @param deps fetch·BE 주소·쿠키 설정 — 테스트에서 바꿔 끼운다
 */
export async function forwardToBackend(
  request: Request,
  pathSegments: string[],
  deps: ForwardDeps,
): Promise<Response> {
  const method = request.method.toUpperCase();
  if (!ALLOWED_METHODS.has(method))
    return apiFailure(405, 'METHOD_NOT_ALLOWED');

  const target = resolveAllowedTarget(pathSegments, request, deps);
  if (!target) return apiFailure(404, 'NOT_FOUND');

  if (MUTATING_METHODS.has(method) && !isSameOriginRequest(request)) {
    return apiFailure(403, 'CSRF_REJECTED');
  }

  const session = readSessionCookies(
    request.headers.get('cookie'),
    deps.cookieNames,
  );
  if (!session.access && !session.refresh) return sessionEnded(deps);

  // 재시도할 수 있게 body는 미리 버퍼에 담는다
  const body = MUTATING_METHODS.has(method)
    ? await request.arrayBuffer()
    : undefined;
  const send = (accessToken: string) =>
    deps.fetch(target, {
      method,
      headers: forwardedHeaders(request.headers, accessToken),
      body,
      redirect: 'manual',
    });

  // access 쿠키가 없고 refresh만 있으면(access 만료로 브라우저가 지움) 먼저 갱신한다
  let refreshed: IssuedTokens | null = null;
  let accessToken = session.access;
  if (!accessToken) {
    refreshed = await refreshOnce(session.refresh!, deps);
    if (!refreshed) return sessionEnded(deps);
    accessToken = refreshed.accessToken;
  }

  let upstream = await send(accessToken);

  if (upstream.status === 401 && session.refresh && !refreshed) {
    refreshed = await refreshOnce(session.refresh, deps);
    if (!refreshed) return sessionEnded(deps);
    upstream = await send(refreshed.accessToken);
  }
  // 새로 받은 토큰으로도 401이면 이 세션은 쓸 수 없다 — 쿠키를 지워 로그인↔보호 경로 루프를 끊는다
  if (upstream.status === 401 && refreshed) return sessionEnded(deps);

  return passThrough(upstream, refreshed, deps);
}

// 화이트리스트를 통과한 BE URL을 만든다. 통과 못 하면 null.
// Next는 세그먼트를 각각 디코드하므로 `..%2F`가 한 세그먼트 안에 `../`로 들어올 수 있다 — 구분자·점 세그먼트를 거부하고,
// 최종 URL을 파싱해 정규화된 경로가 여전히 BE 주소(경로 prefix 포함) 아래 허용 범위인지 한 번 더 확인한다
function resolveAllowedTarget(
  segments: string[],
  request: Request,
  deps: ForwardDeps,
): string | null {
  const unsafeSegment = (s: string) =>
    s === '' || s === '.' || s === '..' || /[/\\?#]/.test(s);
  if (segments.some(unsafeSegment)) return null;
  const path = segments.join('/');
  const allowed = (p: string) =>
    ALLOWED_EXACT.has(p) ||
    ALLOWED_PREFIXES.some((prefix) => p.startsWith(prefix));
  if (!allowed(path)) return null;

  const base = new URL(deps.apiBaseUrl);
  const basePath = base.pathname.replace(/\/$/, '');
  const target = new URL(
    `${basePath}/${path}${new URL(request.url).search}`,
    base.origin,
  );
  if (target.origin !== base.origin) return null;
  if (!target.pathname.startsWith(`${basePath}/`)) return null;
  if (!allowed(target.pathname.slice(basePath.length + 1))) return null;
  return target.href;
}

function forwardedHeaders(incoming: Headers, accessToken: string): Headers {
  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = incoming.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('authorization', `Bearer ${accessToken}`);
  return headers;
}

// refresh 토큰으로 새 토큰을 받는다. 실패(401·형식 불일치·네트워크)는 null — 호출자가 세션 종료로 처리한다
function refreshOnce(
  refreshToken: string,
  deps: ForwardDeps,
): Promise<IssuedTokens | null> {
  const now = Date.now();
  const cached = refreshesByOldToken.get(refreshToken);
  if (cached && cached.expiresAt > now) return cached.result;

  const result = requestRefresh(refreshToken, deps);
  refreshesByOldToken.set(refreshToken, {
    result,
    expiresAt: now + REFRESH_GRACE_MS,
  });
  // 실패한 갱신은 기억하지 않는다 — 다음 요청이 다시 시도할 수 있게
  result.then((tokens) => {
    if (!tokens) refreshesByOldToken.delete(refreshToken);
  });
  sweepExpiredRefreshes(now);
  return result;
}

async function requestRefresh(
  refreshToken: string,
  deps: ForwardDeps,
): Promise<IssuedTokens | null> {
  try {
    const response = await deps.fetch(`${deps.apiBaseUrl}${REFRESH_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as {
      success?: boolean;
      data?: unknown;
    };
    return body?.success ? readIssuedTokens(body.data) : null;
  } catch {
    return null;
  }
}

function sweepExpiredRefreshes(now: number) {
  for (const [token, entry] of refreshesByOldToken) {
    if (entry.expiresAt <= now) refreshesByOldToken.delete(token);
  }
}

// BE 응답을 그대로 넘기되 캐시를 막고, 갱신했으면 새 쿠키를 붙인다
function passThrough(
  upstream: Response,
  refreshed: IssuedTokens | null,
  deps: ForwardDeps,
): Response {
  const headers = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  headers.set('cache-control', 'no-store');
  if (refreshed) {
    for (const cookie of sessionCookieHeaders(
      deps.cookieNames,
      refreshed,
      deps.cookieSecurity,
    )) {
      headers.append('set-cookie', cookie);
    }
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}

// 세션 끝 — 쿠키를 지우고 401. 클라이언트는 /login으로 보낸다
function sessionEnded(deps: ForwardDeps): Response {
  return apiFailure(
    401,
    'SESSION_EXPIRED',
    '세션이 만료됐어요. 다시 로그인해 주세요.',
    clearSessionCookieHeaders(deps.cookieNames, deps.cookieSecurity).map(
      (cookie) => ['set-cookie', cookie],
    ),
  );
}
