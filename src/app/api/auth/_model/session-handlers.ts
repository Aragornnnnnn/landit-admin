// 로그인·로그아웃 route handler의 본체 — BE 토큰을 httpOnly 쿠키로 심고 지운다. 토큰은 응답 body에 절대 싣지 않는다 (docs/auth.md "로그인"·"로그아웃")
import 'server-only';

import {
  clearSessionCookieHeaders,
  readSessionCookies,
  sessionCookieHeaders,
} from '@/shared/auth/session-cookie';
import { isSameOriginRequest } from '@/shared/security/same-origin';

import type { BackendDeps } from '../../_model/backend';
import { apiFailure, apiSuccess } from '../../_model/respond';
import { readIssuedTokens } from '../../_model/token-response';

export type SessionHandlerDeps = BackendDeps;

const PROVIDERS = new Set(['kakao', 'google']);
const SOCIAL_LOGIN_PATH = '/api/v1/auth/social-login';
const LOGOUT_PATH = '/api/v1/auth/logout';

interface ApiEnvelope {
  success?: boolean;
  data?: { user?: unknown } & Record<string, unknown>;
  error?: { code?: string; message?: string };
}

/**
 * `POST /api/auth/social-login` — 소셜 로그인으로 받은 id_token을 BE에 넘기고, 발급된 토큰을 쿠키로 심는다.
 * 응답 body는 `{ success, data: { user } }`뿐이다.
 */
export async function establishSocialSession(
  request: Request,
  deps: SessionHandlerDeps,
): Promise<Response> {
  if (!isSameOriginRequest(request)) return apiFailure(403, 'CSRF_REJECTED');

  const body = (await request.json().catch(() => null)) as {
    provider?: unknown;
    idToken?: unknown;
    nonce?: unknown;
  } | null;
  const provider =
    typeof body?.provider === 'string' ? body.provider.toLowerCase() : '';
  const idToken = typeof body?.idToken === 'string' ? body.idToken : '';
  const nonce = typeof body?.nonce === 'string' ? body.nonce : '';
  if (!PROVIDERS.has(provider) || !idToken || !nonce) {
    return apiFailure(400, 'INVALID_REQUEST', '요청 값이 올바르지 않아요.');
  }

  const upstream = await deps.fetch(`${deps.apiBaseUrl}${SOCIAL_LOGIN_PATH}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ provider, idToken, nonce }),
  });
  const envelope = (await upstream
    .json()
    .catch(() => null)) as ApiEnvelope | null;
  const tokens = envelope?.success ? readIssuedTokens(envelope.data) : null;
  if (!upstream.ok || !tokens) {
    return apiFailure(
      upstream.ok ? 502 : upstream.status,
      envelope?.error?.code ?? 'LOGIN_FAILED',
      envelope?.error?.message ?? '로그인하지 못했어요. 다시 시도해 주세요.',
    );
  }

  return apiSuccess(
    { user: envelope?.data?.user ?? null },
    sessionCookieHeaders(deps.cookieNames, tokens, deps.cookieSecurity).map(
      (cookie) => ['set-cookie', cookie],
    ),
  );
}

/**
 * `POST /api/auth/logout` — BE refresh 토큰을 무효화하고 쿠키를 지운다. BE가 실패해도 쿠키는 지운다.
 */
export async function logoutSession(
  request: Request,
  deps: SessionHandlerDeps,
): Promise<Response> {
  if (!isSameOriginRequest(request)) return apiFailure(403, 'CSRF_REJECTED');

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
