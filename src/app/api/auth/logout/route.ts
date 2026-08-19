// POST /api/auth/logout — BE refresh 무효화 + 쿠키 삭제. 위임만 하고 규칙은 ../_model/session-handlers.ts
import { currentSessionCookieConfig } from '@/shared/auth/session-cookie';

import { logoutSession } from '../_model/session-handlers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { names, security } = currentSessionCookieConfig();
  return logoutSession(request, {
    fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }),
    apiBaseUrl: (process.env.API_BASE_URL ?? '').replace(/\/+$/, ''),
    cookieNames: names,
    cookieSecurity: security,
  });
}
