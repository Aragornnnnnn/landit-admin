// Next 16 Proxy(구 middleware) — 요청마다 (1) 세션 쿠키 유무로 라우트 가드, (2) nonce 기반 CSP 헤더. 인가 판단은 하지 않는다 — 그건 BE 몫
import { NextResponse, type NextRequest } from 'next/server';

import { decideRouteGuard } from '@/shared/auth/route-guard';
import { currentSessionCookieConfig } from '@/shared/auth/session-cookie';
import { buildContentSecurityPolicy } from '@/shared/security/csp';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // 쿠키 존재만 본다 — 만료·위조는 첫 프록시 호출에서 BE가 401로 가른다. 이름은 route handler와 같은 한 곳에서 계산한다
  const { names } = currentSessionCookieConfig();
  const decision = decideRouteGuard({
    pathname,
    search,
    hasSession: request.cookies.has(names.refresh),
  });
  if (decision.action === 'redirect') {
    return NextResponse.redirect(new URL(decision.to, request.url));
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildContentSecurityPolicy({
    nonce,
    isDev: process.env.NODE_ENV === 'development',
  });

  // 요청 헤더에도 넣는다 — Next가 여기서 nonce를 읽어 자기 인라인 스크립트에 붙인다
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    // API 라우트·정적 파일·프리페치는 가드도 CSP도 필요 없다 (Next 공식 CSP 가이드의 matcher).
    // 확장자가 붙은 경로는 전부 정적 파일로 보고 넘긴다 — 파일을 하나씩 열거하면 반드시 빠뜨린다.
    // 실제로 /icon.png와 /brand/app-icon.png가 가드에 걸려 /login으로 튕겨 아이콘이 안 뜬 적이 있다
    {
      source: '/((?!api|_next/static|_next/image|.*\\.[\\w]+$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
