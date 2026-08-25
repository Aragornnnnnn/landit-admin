// "관리자 아님" 안내를 콜백 → 로그인 화면으로 넘긴다. URL엔 PII를 싣지 않으므로 sessionStorage에, 이메일은 마스킹해서만 둔다
const KEY = 'landit-admin-forbidden';

export interface ForbiddenNotice {
  maskedEmail: string | null;
}

/** `sujin@gmail.com` → `suj***@gmail.com`. 로컬파트 앞 3글자(짧으면 1글자)만 남긴다 */
export function maskEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const at = email.indexOf('@');
  if (at <= 0) return null;
  const local = email.slice(0, at);
  const keep = local.length >= 4 ? 3 : 1;
  return `${local.slice(0, keep)}***${email.slice(at)}`;
}

export function writeForbiddenNotice(email: string | null | undefined): void {
  const notice: ForbiddenNotice = { maskedEmail: maskEmail(email) };
  sessionStorage.setItem(KEY, JSON.stringify(notice));
}

/** 한 번 읽으면 지운다 — 새로고침해도 안내가 계속 떠 있지 않게 */
export function readForbiddenNotice(): ForbiddenNotice | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  sessionStorage.removeItem(KEY);
  try {
    return JSON.parse(raw) as ForbiddenNotice;
  } catch {
    return null;
  }
}
