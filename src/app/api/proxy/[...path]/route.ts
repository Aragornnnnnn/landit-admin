// /api/proxy/* — 브라우저가 BE를 부르는 유일한 통로. 해석·위임만 하고 규칙은 _model/forward-to-backend.ts에 있다
import { currentSessionCookieConfig } from '@/shared/auth/session-cookie';

import { forwardToBackend } from './_model/forward-to-backend';

// 어드민 응답은 어떤 계층에도 캐시하지 않는다 — Next fetch 캐시·라우트 캐시도 끈다
export const dynamic = 'force-dynamic';

type Ctx = RouteContext<'/api/proxy/[...path]'>;

async function handle(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    // env 누락은 설정 실패지 사용자 오류가 아니다 — 로그로 드러내고 503
    console.error('[proxy] API_BASE_URL이 설정되지 않았습니다');
    return Response.json(
      { success: false, error: { code: 'PROXY_NOT_CONFIGURED' } },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    );
  }
  const { names, security } = currentSessionCookieConfig();
  return forwardToBackend(request, path, {
    fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }),
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ''),
    cookieNames: names,
    cookieSecurity: security,
  });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
