// 변경 요청의 CSRF 판정 — Sec-Fetch-Site가 있으면 same-origin이어야 하고, 없으면(구형 브라우저) Origin이 우리 호스트여야 한다.
// 프록시·auth route handler가 같은 규칙을 쓴다 (docs/security.md "프록시")
export function isSameOriginRequest(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin';
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const ourHost =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    new URL(request.url).host;
  try {
    return new URL(origin).host === ourHost;
  } catch {
    return false;
  }
}
