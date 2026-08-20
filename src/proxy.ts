// 요청마다 nonce를 만들어 CSP 헤더를 붙인다 (Next 16 Proxy, 구 middleware). 라우트 가드는 로그인 PR에서 여기 더한다
import { NextResponse, type NextRequest } from 'next/server';

import { buildContentSecurityPolicy } from '@/shared/security/csp';

export function proxy(request: NextRequest) {
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
    // API 라우트·정적 파일·프리페치는 CSP가 필요 없다 (Next 공식 CSP 가이드의 matcher)
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
