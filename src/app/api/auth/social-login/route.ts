// POST /api/auth/social-login — id_token을 BE에 넘기고 토큰을 httpOnly 쿠키로 심는다. 위임만 하고 규칙은 ../_model/session-handlers.ts
import { currentSessionCookieConfig } from '@/shared/auth/session-cookie';

import { completeSocialLogin } from '../_model/session-handlers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    console.error('[auth] API_BASE_URL이 설정되지 않았습니다');
    return Response.json(
      { success: false, error: { code: 'AUTH_NOT_CONFIGURED' } },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    );
  }
  const { names, security } = currentSessionCookieConfig();
  return completeSocialLogin(request, {
    fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }),
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ''),
    cookieNames: names,
    cookieSecurity: security,
  });
}
