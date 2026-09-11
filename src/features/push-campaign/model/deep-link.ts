// 딥 링크 규칙 — 무엇을 받아 주고, UTM을 어떻게 붙이는지 (docs/screens/push-campaigns.md "새 푸시 · 검증").
// BE도 같은 형식(앱 경로 또는 https, 사용자 정보 없음, 1000자)을 검사하지만 저장 전에 화면에서 먼저 말해 준다

/** BE deepLink 최대 길이 — UTM을 붙인 최종 문자열 기준 */
export const DEEP_LINK_MAX = 1000;

export const UTM_SOURCE = 'push';
export const UTM_MEDIUM = 'admin';

/** 저장을 막을 이유. 없으면 null. 최종(UTM 포함) 링크를 넘긴다 */
export function deepLinkError(link: string): string | null {
  if (!link) return '딥 링크를 입력해 주세요';
  if (link.length > DEEP_LINK_MAX)
    return `딥 링크는 ${DEEP_LINK_MAX}자까지예요`;
  // 앱 안 경로 — `//`로 시작하면 브라우저가 다른 호스트로 읽는다
  if (link.startsWith('/')) return link.startsWith('//') ? FORMAT_ERROR : null;
  if (!link.startsWith('https://')) return FORMAT_ERROR;
  try {
    const url = new URL(link);
    if (url.username || url.password)
      return '주소에 사용자 정보를 넣을 수 없어요';
    return null;
  } catch {
    return '주소가 올바르지 않아요';
  }
}

const FORMAT_ERROR = '/로 시작하거나 https://로 시작해야 해요';

const SLUG_MAX = 40;

/**
 * utm_campaign 기본값 — 제목의 글자·숫자만 남긴 슬러그 + 날짜(MMDD).
 * 한글은 그대로 둔다(URL에서 인코딩된다). 분석 도구에서 캠페인을 알아보기 쉬운 쪽이 우선이다
 */
export function campaignSlug(title: string, date: Date): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\p{L}\p{N}_]/gu, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, SLUG_MAX);
  const mmdd = `${two(date.getMonth() + 1)}${two(date.getDate())}`;
  return `${slug || 'push'}_${mmdd}`;
}

/** 링크 뒤에 utm_source·utm_medium·utm_campaign을 붙인다. 캠페인 값이 비면(스위치 off) 원본 그대로 */
export function withUtm(link: string, campaign: string): string {
  if (!campaign) return link;
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: UTM_MEDIUM,
    utm_campaign: campaign,
  });
  return `${link}${link.includes('?') ? '&' : '?'}${params}`;
}

const two = (n: number) => String(n).padStart(2, '0');
