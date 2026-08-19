/**
 * landit-admin Next.js 설정.
 *
 * 명시한 설정
 * - reactCompiler: 자동 메모이제이션 — "수동 useCallback/useMemo 금지" 규칙의 전제
 * - compiler.removeConsole: 프로덕션 빌드에서만 console.* 제거. NODE_ENV로 직접 분기 —
 *   옵션 자체가 dev·build를 안 가려서, 걸어두면 `next dev`에서도 지워진다
 * - headers(): 요청과 무관하게 고정인 보안 헤더. CSP는 요청마다 nonce가 달라 src/proxy.ts가 붙인다
 * - withSentryConfig: 소스맵을 Sentry에만 올리고 배포 산출물에서는 삭제
 *
 * 안 적었지만 기본값으로 적용 중인 것 (Next 16)
 * - Turbopack이 dev·build 기본 번들러, 프로덕션 minify·주석 제거 기본 on
 * - TS 에러는 빌드 실패. ESLint는 빌드에서 안 돌므로 CI에서 별도 실행
 * - productionBrowserSourceMaps=false — 브라우저 공개 소스맵은 안 만든다
 *
 * rewrites는 쓰지 않는다 — BE 호출은 쿠키를 Bearer로 바꿔야 해서 route handler 프록시(/api/proxy)를 쓴다 (AGENTS.md 보안 규칙)
 */
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

// 값의 근거는 docs/security.md "헤더". 바꾸면 거기도 같이 고친다
const securityHeaders = [
  // 2년, 서브도메인 포함, preload 목록 등록 가능 — 한 번 HTTPS로 들어온 브라우저는 HTTP로 못 돌아간다
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // CSP frame-ancestors 'none'과 이중 — 구형 브라우저용
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // 어드민은 카메라·마이크·위치·결제를 쓰지 않는다
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

// 소스맵은 SENTRY_AUTH_TOKEN이 있는 배포 빌드에서만 올린다
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // 업로드 후 산출물에서 지운다 — 원본 코드 노출 방지, 원본 스택은 Sentry 안에서만 보인다
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
    deleteSourcemapsAfterUpload: true,
  },
  // SDK 내부 디버그 로거 제거
  disableLogger: true,
  // 업로드 실패가 배포를 막지 않게 경고로 낮춘다
  errorHandler: (err) => {
    console.warn('[sentry] 소스맵 업로드 실패 (빌드는 계속):', err.message);
  },
});
