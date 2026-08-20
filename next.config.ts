/**
 * landit-admin Next.js 설정.
 *
 * 명시한 설정
 * - reactCompiler: 자동 메모이제이션 — "수동 useCallback/useMemo 금지" 규칙의 전제
 * - compiler.removeConsole: 프로덕션 빌드에서만 console.* 제거. NODE_ENV로 직접 분기 —
 *   옵션 자체가 dev·build를 안 가려서, 걸어두면 `next dev`에서도 지워진다
 *
 * 뒤에 오는 PR에서 추가되는 것
 * - headers(): 보안 헤더(CSP·HSTS·frame-ancestors 등) — PR "보안 기반"
 * - withSentryConfig — PR "보안 기반"
 *
 * 안 적었지만 기본값으로 적용 중인 것 (Next 16)
 * - Turbopack이 dev·build 기본 번들러, 프로덕션 minify·주석 제거 기본 on
 * - TS 에러는 빌드 실패. ESLint는 빌드에서 안 돌므로 CI에서 별도 실행
 * - productionBrowserSourceMaps=false — 브라우저 공개 소스맵은 안 만든다
 *
 * rewrites는 쓰지 않는다 — BE 호출은 쿠키를 Bearer로 바꿔야 해서 route handler 프록시(/api/proxy)를 쓴다 (AGENTS.md 보안 규칙)
 */
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
