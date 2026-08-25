// Content-Security-Policy 문자열을 조립한다 — 정책의 단일 출처. 외부 도메인을 더할 땐 여기와 docs/security.md를 같이 고친다

// 카카오 JS SDK(로그인). strict-dynamic 브라우저는 nonce 스크립트가 불러온 것이라 자동 허용되고, 구형 브라우저 폴백으로 host도 둔다
const KAKAO_SDK_ORIGIN = 'https://t1.kakaocdn.net';

/**
 * 콘텐츠 이미지가 올라가고 다시 내려오는 곳(S3·CloudFront)을 env에서 읽는다.
 * 환경마다 버킷이 달라 값을 코드에 박지 않고, 형식이 맞는 https 오리진만 통과시킨다 —
 * env가 잘못 들어와도 정책이 느슨해지지 않게. 비어 있으면 아무것도 열지 않는다(닫힌 쪽이 안전하다)
 */
const ORIGIN_PATTERN = /^https:\/\/(\*\.)?[a-z0-9.-]+(:\d+)?$/;
// 로컬 개발에서만 — 스토리지 대역을 흉내 내는 http 스텁을 붙일 수 있게. 배포에서는 절대 통과하지 않는다
const LOCAL_PATTERN = /^http:\/\/localhost(:\d+)?$/;

export function readImageOrigins(
  raw: string | undefined,
  { isDev = false }: { isDev?: boolean } = {},
): string[] {
  return (raw ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(
      (origin) =>
        ORIGIN_PATTERN.test(origin) || (isDev && LOCAL_PATTERN.test(origin)),
    );
}

/**
 * 요청 하나에 쓸 CSP 헤더 값을 만든다.
 *
 * @param nonce 이 요청의 인라인 스크립트 nonce — Next가 CSP 요청 헤더에서 읽어 자기 스크립트에 붙인다
 * @param isDev 개발 서버 여부 — React가 디버깅용으로 eval을 써서 개발에서만 `'unsafe-eval'`을 연다
 * @param imageOrigins 콘텐츠 이미지 오리진 — 업로드(PUT)와 표시(img)에만 열어 준다
 */
export function buildContentSecurityPolicy({
  nonce,
  isDev,
  imageOrigins = [],
}: {
  nonce: string;
  isDev: boolean;
  imageOrigins?: string[];
}): string {
  const extra = imageOrigins.length ? ` ${imageOrigins.join(' ')}` : '';
  return [
    `default-src 'self'`,
    // strict-dynamic — nonce 붙은 스크립트가 불러오는 스크립트는 허용. unsafe-inline은 절대 넣지 않는다
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''} ${KAKAO_SDK_ORIGIN}`,
    // radix·sonner가 style 속성을 쓴다 → unsafe-inline 필요. 여기에 nonce를 넣으면 브라우저가 unsafe-inline을 무시하므로 넣지 않는다
    `style-src 'self' 'unsafe-inline'`,
    // 업로드한 콘텐츠 이미지는 우리 오리진이 아니라 스토리지에서 내려온다
    `img-src 'self' data: blob:${extra}`,
    `font-src 'self'`,
    // 업로드는 발급받은 URL로 브라우저가 직접 PUT한다 — 프록시를 거치지 않는다
    `connect-src 'self'${extra}`,
    `frame-src 'none'`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}
