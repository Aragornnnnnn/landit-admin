// 라우트 가드 규칙 — 세션 쿠키 유무로 /login과 보호 경로 사이를 오가게 한다. 판정만 하고 실제 이동은 src/proxy.ts가 한다 (docs/auth.md "라우트 가드")

export const LOGIN_PATH = '/login';
// 비로그인도 들어올 수 있는 경로 — 로그인 화면과 소셜 로그인 콜백
const PUBLIC_PREFIXES = ['/login', '/auth/'];

export type GuardDecision =
  { action: 'next' } | { action: 'redirect'; to: string };

/**
 * 요청 경로와 세션 유무로 통과/리다이렉트를 정한다. 쿠키 존재만 본다 — 유효성은 BE가 판정한다.
 */
export function decideRouteGuard({
  pathname,
  search,
  hasSession,
}: {
  pathname: string;
  search: string;
  hasSession: boolean;
}): GuardDecision {
  const isPublic = PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p),
  );

  if (pathname === LOGIN_PATH && hasSession) {
    const next = new URLSearchParams(search).get('next');
    return { action: 'redirect', to: safeNextPath(next) };
  }
  if (isPublic || hasSession) return { action: 'next' };

  const next = encodeURIComponent(pathname + search);
  return { action: 'redirect', to: `${LOGIN_PATH}?next=${next}` };
}

/**
 * `?next=`로 돌아갈 경로를 검증한다 — 같은 오리진 상대 경로(`/`로 시작, `//`·`\`·스킴 없음)만. 아니면 `/`.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith('/')) return '/';
  // 문자열 검사만으로는 부족하다 — URL 파서는 탭·개행을 지우고(`/\t/evil` → `//evil`), `\`를 `/`로 읽는다.
  // 제어 문자는 거부하고, 실제 해석 결과의 origin이 기준과 같은지로 판정한 뒤 해석된 경로를 돌려준다
  if (/[\u0000-\u001F\u007F]/.test(next)) return '/';
  let parsed: URL;
  try {
    parsed = new URL(next, 'http://n');
  } catch {
    return '/';
  }
  if (parsed.origin !== 'http://n') return '/';
  const resolved = parsed.pathname + parsed.search + parsed.hash;
  if (resolved === LOGIN_PATH || resolved.startsWith(`${LOGIN_PATH}?`)) {
    return '/';
  }
  return resolved;
}
