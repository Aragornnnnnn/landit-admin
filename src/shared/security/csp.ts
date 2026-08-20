// Content-Security-Policy 문자열을 조립한다 — 정책의 단일 출처. 외부 도메인을 더할 땐 여기와 docs/security.md를 같이 고친다

// 카카오 JS SDK(로그인). strict-dynamic 브라우저는 nonce 스크립트가 불러온 것이라 자동 허용되고, 구형 브라우저 폴백으로 host도 둔다
const KAKAO_SDK_ORIGIN = 'https://t1.kakaocdn.net';

/**
 * 요청 하나에 쓸 CSP 헤더 값을 만든다.
 *
 * @param nonce 이 요청의 인라인 스크립트 nonce — Next가 CSP 요청 헤더에서 읽어 자기 스크립트에 붙인다
 * @param isDev 개발 서버 여부 — React가 디버깅용으로 eval을 써서 개발에서만 `'unsafe-eval'`을 연다
 */
export function buildContentSecurityPolicy({
  nonce,
  isDev,
}: {
  nonce: string;
  isDev: boolean;
}): string {
  return [
    `default-src 'self'`,
    // strict-dynamic — nonce 붙은 스크립트가 불러오는 스크립트는 허용. unsafe-inline은 절대 넣지 않는다
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''} ${KAKAO_SDK_ORIGIN}`,
    // radix·sonner가 style 속성을 쓴다 → unsafe-inline 필요. 여기에 nonce를 넣으면 브라우저가 unsafe-inline을 무시하므로 넣지 않는다
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `frame-src 'none'`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}
