// 사이드바 "내 계정" 표시용 닉네임 — 비민감 정보만 sessionStorage에 둔다. 관리자 판정 API(/auth/me)가 생기면 서버에서 읽고 이 파일은 지운다
const KEY = 'landit-admin-account';

export interface AccountDisplay {
  nickname: string | null;
}

export function writeAccountDisplay(nickname: string | null | undefined) {
  sessionStorage.setItem(KEY, JSON.stringify({ nickname: nickname ?? null }));
}

export function readAccountDisplay(): AccountDisplay | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AccountDisplay;
  } catch {
    return null;
  }
}

export function clearAccountDisplay() {
  sessionStorage.removeItem(KEY);
}
