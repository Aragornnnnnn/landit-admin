// BFF 프록시의 본체 — 쿠키의 토큰을 Bearer로 바꿔 BE에 전달하고, 401이면 서버에서 한 번 갱신한다 (docs/auth.md · docs/security.md "프록시")
import 'server-only';

import {
  clearSessionCookieHeaders,
  readSessionCookies,
  serializeSessionCookie,
  type SessionCookieNames,
} from '@/shared/auth/session-cookie';

export interface ForwardDeps {
  fetch: (url: string, init: RequestInit) => Promise<Response>;
  apiBaseUrl: string;
  cookieNames: SessionCookieNames;
  cookieSecurity: { secure: boolean };
}

const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
// 전달해도 되는 경로 — 이 밖은 전부 404. 로그인은 전용 route handler(/api/auth/social-login)가 따로 처리한다
const ALLOWED_PREFIXES = ['api/v1/admin/'];
const ALLOWED_EXACT = new Set(['api/v1/auth/logout']);
// BE에 그대로 넘기는 요청 헤더. 쿠키·호스트·기타는 넘기지 않는다
const FORWARDED_REQUEST_HEADERS = ['content-type', 'accept'];
const REFRESH_PATH = '/api/v1/auth/token/refresh';

interface RefreshedTokens {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
}

// 같은 refresh 토큰으로 동시에 갱신이 나가지 않게 진행 중인 갱신을 공유한다 (BE refresh는 회전형이라 두 번째는 실패한다)
const inflightRefreshes = new Map<string, Promise<RefreshedTokens | null>>();

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
  if (!ALLOWED_METHODS.has(method)) return plain(405, 'METHOD_NOT_ALLOWED');

  const path = pathSegments.join('/');
  const target = resolveAllowedTarget(pathSegments, path, request, deps);
  if (!target) return plain(404, 'NOT_FOUND');

  if (MUTATING_METHODS.has(method) && !isSameOrigin(request)) {
    return plain(403, 'CSRF_REJECTED');
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
  let refreshedNow: RefreshedTokens | null = null;
  let accessToken = session.access;
  if (!accessToken) {
    refreshedNow = await refreshOnce(session.refresh!, deps);
    if (!refreshedNow) return sessionEnded(deps);
    accessToken = refreshedNow.accessToken;
  }

  let upstream = await send(accessToken);

  if (upstream.status === 401 && session.refresh && !refreshedNow) {
    refreshedNow = await refreshOnce(session.refresh, deps);
    if (!refreshedNow) return sessionEnded(deps);
    upstream = await send(refreshedNow.accessToken);
  }

  return passThrough(upstream, refreshedNow, deps);
}

// 화이트리스트를 통과한 BE URL을 만든다. 통과 못 하면 null.
// Next는 세그먼트를 각각 디코드하므로 `..%2F`가 한 세그먼트 안에 `../`로 들어올 수 있다 — 구분자·점 세그먼트를 거부하고,
// 최종 URL을 파싱해 정규화된 pathname이 여전히 허용 범위 안인지 한 번 더 확인한다(문자열 검사와 URL 해석이 어긋나지 않게)
function resolveAllowedTarget(
  segments: string[],
  path: string,
  request: Request,
  deps: ForwardDeps,
): string | null {
  const unsafeSegment = (s: string) =>
    s === '' || s === '.' || s === '..' || /[/\\?#]/.test(s);
  if (segments.some(unsafeSegment)) return null;
  const allowed = (p: string) =>
    ALLOWED_EXACT.has(p) ||
    ALLOWED_PREFIXES.some((prefix) => p.startsWith(prefix));
  if (!allowed(path)) return null;

  const base = new URL(deps.apiBaseUrl);
  const target = new URL(`/${path}${new URL(request.url).search}`, base);
  if (target.origin !== base.origin) return null;
  if (!allowed(target.pathname.replace(/^\//, ''))) return null;
  return target.href;
}

// 변경 요청의 CSRF 방어 — Sec-Fetch-Site가 있으면 same-origin이어야 하고, 없으면(구형 브라우저) Origin이 우리 호스트여야 한다
function isSameOrigin(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin';
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const ourHost =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    new URL(request.url).host;
  try {
    return new URL(origin).host === ourHost;
  } catch {
    return false;
  }
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
): Promise<RefreshedTokens | null> {
  const inflight = inflightRefreshes.get(refreshToken);
  if (inflight) return inflight;

  const task = (async () => {
    try {
      const response = await deps.fetch(`${deps.apiBaseUrl}${REFRESH_PATH}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) return null;
      const body = (await response.json()) as {
        success?: boolean;
        data?: Partial<RefreshedTokens>;
      };
      const data = body?.data;
      if (
        !body?.success ||
        !data?.accessToken ||
        !data.refreshToken ||
        typeof data.accessTokenExpiresIn !== 'number' ||
        typeof data.refreshTokenExpiresIn !== 'number'
      ) {
        return null;
      }
      return data as RefreshedTokens;
    } catch {
      return null;
    } finally {
      inflightRefreshes.delete(refreshToken);
    }
  })();
  inflightRefreshes.set(refreshToken, task);
  return task;
}

// BE 응답을 그대로 넘기되 캐시를 막고, 갱신했으면 새 쿠키를 붙인다
function passThrough(
  upstream: Response,
  refreshed: RefreshedTokens | null,
  deps: ForwardDeps,
): Response {
  const headers = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  headers.set('cache-control', 'no-store');
  if (refreshed) {
    headers.append(
      'set-cookie',
      serializeSessionCookie(
        deps.cookieNames.access,
        refreshed.accessToken,
        refreshed.accessTokenExpiresIn,
        deps.cookieSecurity,
      ),
    );
    headers.append(
      'set-cookie',
      serializeSessionCookie(
        deps.cookieNames.refresh,
        refreshed.refreshToken,
        refreshed.refreshTokenExpiresIn,
        deps.cookieSecurity,
      ),
    );
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}

// 세션 끝 — 쿠키를 지우고 401. 클라이언트는 /login으로 보낸다
function sessionEnded(deps: ForwardDeps): Response {
  const headers = new Headers({
    'content-type': 'application/json',
    'cache-control': 'no-store',
  });
  for (const cookie of clearSessionCookieHeaders(
    deps.cookieNames,
    deps.cookieSecurity,
  )) {
    headers.append('set-cookie', cookie);
  }
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code: 'SESSION_EXPIRED',
        message: '세션이 만료됐어요. 다시 로그인해 주세요.',
      },
    }),
    { status: 401, headers },
  );
}

function plain(status: number, code: string): Response {
  return new Response(JSON.stringify({ success: false, error: { code } }), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}
