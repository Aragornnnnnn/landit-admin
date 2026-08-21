// 사용자 화면의 말과 점 색 (docs/screens/users.md "정확한 카피")
import type { UserRole, UserStatus } from './user-filter';

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  USER: '사용자',
  ADMIN: '관리자',
};

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: '활성',
  WITHDRAWN: '탈퇴',
  BANNED: '정지',
};

/** 점 — 활성은 잘 돌아가는 상태(초록), 정지는 사람이 손댄 상태(오렌지). 탈퇴는 점이 없다 */
export const USER_STATUS_DOT: Record<
  UserStatus,
  'progress' | 'done' | undefined
> = {
  ACTIVE: 'done',
  BANNED: 'progress',
  WITHDRAWN: undefined,
};

/** 관리자만 점을 단다 — 목록에서 눈에 띄어야 하는 건 관리자 쪽이다 (프레임) */
export const USER_ROLE_DOT: Record<UserRole, 'progress' | 'done' | undefined> =
  {
    ADMIN: 'done',
    USER: undefined,
  };

export const USER_ROLE_OPTIONS = [
  { value: 'ALL', label: '역할: 전체' },
  { value: 'USER', label: '사용자' },
  { value: 'ADMIN', label: '관리자' },
];

export const USER_STATUS_OPTIONS = [
  { value: 'ALL', label: '상태: 전체' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'WITHDRAWN', label: '탈퇴' },
  { value: 'BANNED', label: '정지' },
];

/**
 * 필터 줄 오른쪽 안내. BE가 전체 수를 주지 않아(hasNext만 준다) 진행률을 %로 말할 수 없다 —
 * 대신 지금까지 몇 명을 받았는지와, 검색이 그 범위 안에서만 이뤄진다는 사실을 밝힌다
 */
export function usersProgressLabel(loaded: number, loading: boolean): string {
  const count = loaded.toLocaleString('ko-KR');
  return loading
    ? `${count}명 불러오는 중 · 검색은 불러온 범위에서`
    : `${count}명`;
}

/** "1–20 / 1,284 (로컬 페이징)" — 지금 보고 있는 몫 */
export function usersRangeLabel(
  page: number,
  size: number,
  total: number,
): string {
  if (total === 0) return '0';
  const from = page * size + 1;
  const to = Math.min((page + 1) * size, total);
  return `${from}–${to} / ${total.toLocaleString('ko-KR')} (로컬 페이징)`;
}
