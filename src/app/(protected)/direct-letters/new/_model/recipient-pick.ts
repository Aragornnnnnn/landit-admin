// 받는 사람 고르기 — 전체 사용자 목록에서 검색하고, 붙여넣은 ID를 보낼 수 있는 사람과 없는 사람으로 가른다.
// BE는 없거나 탈퇴한 ID가 하나라도 있으면 전체를 404로 취소하고 어느 ID인지 알려 주지 않아서, 화면에서 먼저 거른다
import type { UserListItem } from '@/features/user/api/user-list';

import type { Recipient } from './direct-letter-draft';

const isActive = (user: UserListItem) => user.status === 'ACTIVE';

export const toRecipient = (user: UserListItem): Recipient => ({
  userProfileId: user.userProfileId,
  nickname: user.nickname,
});

/** 활성 사용자 중 ID·닉네임·이메일에 검색어가 들어간 사람. 검색어가 없으면 활성 전부 */
export function searchActiveUsers(
  users: UserListItem[],
  keyword: string,
): UserListItem[] {
  const needle = keyword.trim().toLowerCase();
  return users.filter(
    (user) =>
      isActive(user) &&
      (!needle ||
        String(user.userProfileId).includes(needle) ||
        user.nickname.toLowerCase().includes(needle) ||
        (user.email ?? '').toLowerCase().includes(needle)),
  );
}

export interface PastedIdCheck {
  /** 보낼 수 있는 사람 — 붙여넣은 순서 */
  ready: Recipient[];
  /** 목록에 없거나 탈퇴·정지한 ID — 붙여넣은 순서 */
  unavailable: number[];
}

export function checkPastedIds(
  ids: number[],
  users: UserListItem[],
): PastedIdCheck {
  const byId = new Map(users.map((user) => [user.userProfileId, user]));
  const ready: Recipient[] = [];
  const unavailable: number[] = [];
  for (const id of ids) {
    const user = byId.get(id);
    if (user && isActive(user)) ready.push(toRecipient(user));
    else unavailable.push(id);
  }
  return { ready, unavailable };
}
