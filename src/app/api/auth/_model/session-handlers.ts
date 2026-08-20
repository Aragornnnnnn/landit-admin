// 로그인·로그아웃 route handler의 본체 — BE 토큰을 httpOnly 쿠키로 심고 지운다. 토큰은 응답 body에 절대 싣지 않는다 (docs/auth.md "로그인"·"로그아웃")
import 'server-only';

import {
  clearSessionCookieHeaders,
  readSessionCookies,
  serializeSessionCookie,
  type SessionCookieNames,
} from '@/shared/auth/session-cookie';

export interface SessionHandlerDeps {
  fetch: (url: string, init: RequestInit) => Promise<Response>;
  apiBaseUrl: string;
  cookieNames: SessionCookieNames;
  cookieSecurity: { secure: boolean };
}

const PROVIDERS = new Set(['kakao', 'google']);
const SOCIAL_LOGIN_PATH = '/api/v1/auth/social-login';
const LOGOUT_PATH = '/api/v1/auth/logout';

// BE AuthTokenResponse — 쿠키로 갈 것과 body로 갈 것(user)을 여기서 가른다
interface AuthTokenResponse {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  user: unknown;
}

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  error?: { code?: string; message?: string };
}

/**
 * `POST /api/auth/social-login` — 소셜 로그인으로 받은 id_token을 BE에 넘기고, 발급된 토큰을 쿠키로 심는다.
 * 응답 body는 `{ user }`뿐이다.
 */
export async function completeSocialLogin(
  request: Request,
  deps: SessionHandlerDeps,
): Promise<Response> {
  if (!isSameOrigin(request)) return fail(403, 'CSRF_REJECTED');

  const body = (await request.json().catch(() => null)) as {
    provider?: unknown;
    idToken?: unknown;
    nonce?: unknown;
  } | null;
  const provider =
    typeof body?.provider === 'string' ? body.provider.toLowerCase() : '';
  if (
    !PROVIDERS.has(provider) ||
    typeof body?.idToken !== 'string' ||
    !body.idToken ||
    typeof body.nonce !== 'string' ||
    !body.nonce
  ) {
    return fail(400, 'INVALID_REQUEST', '요청 값이 올바르지 않아요.');
  }

  const upstream = await deps.fetch(`${deps.apiBaseUrl}${SOCIAL_LOGIN_PATH}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      provider,
      idToken: body.idToken,
      nonce: body.nonce,
    }),
  });
  const envelope = (await upstream
    .json()
    .catch(() => null)) as ApiEnvelope<AuthTokenResponse> | null;
  const data = envelope?.data;

  if (
    !upstream.ok ||
    !envelope?.success ||
    !data?.accessToken ||
    !data.refreshToken
  ) {
    return fail(
      upstream.ok ? 502 : upstream.status,
      envelope?.error?.code ?? 'LOGIN_FAILED',
      envelope?.error?.message ?? '로그인하지 못했어요. 다시 시도해 주세요.',
    );
  }

  const headers = new Headers({
    'content-type': 'application/json',
    'cache-control': 'no-store',
  });
  headers.append(
    'set-cookie',
    serializeSessionCookie(
      deps.cookieNames.access,
      data.accessToken,
      data.accessTokenExpiresIn,
      deps.cookieSecurity,
    ),
  );
  headers.append(
    'set-cookie',
    serializeSessionCookie(
      deps.cookieNames.refresh,
      data.refreshToken,
      data.refreshTokenExpiresIn,
      deps.cookieSecurity,
    ),
  );
  return new Response(JSON.stringify({ user: data.user }), {
    status: 200,
    headers,
  });
}

/**
 * `POST /api/auth/logout` — BE refresh 토큰을 무효화하고 쿠키를 지운다. BE가 실패해도 쿠키는 지운다.
 */
export async function logoutSession(
  request: Request,
  deps: SessionHandlerDeps,
): Promise<Response> {
  if (!isSameOrigin(request)) return fail(403, 'CSRF_REJECTED');

  const session = readSessionCookies(
    request.headers.get('cookie'),
    deps.cookieNames,
  );
  if (session.refresh) {
    try {
      await deps.fetch(`${deps.apiBaseUrl}${LOGOUT_PATH}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(session.access && { authorization: `Bearer ${session.access}` }),
        },
        body: JSON.stringify({ refreshToken: session.refresh }),
      });
    } catch {
      // BE가 죽어 있어도 로컬 세션은 끝내야 한다 — refresh는 만료로 자연 소멸
    }
  }

  const headers = new Headers({ 'cache-control': 'no-store' });
  for (const cookie of clearSessionCookieHeaders(
    deps.cookieNames,
    deps.cookieSecurity,
  )) {
    headers.append('set-cookie', cookie);
  }
  return new Response(null, { status: 204, headers });
}

// 프록시와 같은 CSRF 판정 — 로그인 CSRF(공격자 계정으로 세션을 심는 공격)도 막는다
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

function fail(status: number, code: string, message?: string): Response {
  return new Response(
    JSON.stringify({ success: false, error: { code, message } }),
    {
      status,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    },
  );
}
