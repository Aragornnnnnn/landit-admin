import { describe, expect, it } from 'vitest';

import type { UserListItem } from '@/features/user/api/user-list';

import { checkPastedIds, searchActiveUsers } from './recipient-pick';

const user = (patch: Partial<UserListItem>): UserListItem => ({
  userProfileId: 1,
  email: 'sky@gmail.com',
  nickname: '하늘',
  role: 'USER',
  status: 'ACTIVE',
  pushPermissionStatus: 'GRANTED',
  createdAt: '2026-08-18T10:00:00',
  ...patch,
});

const users = [
  user({ userProfileId: 1290, nickname: '하늘', email: 'sky@gmail.com' }),
  user({ userProfileId: 977, nickname: '서연', email: 'seo@naver.com' }),
  user({ userProfileId: 640, nickname: '태오', status: 'WITHDRAWN' }),
  user({ userProfileId: 23, nickname: '소율', status: 'BANNED' }),
];

describe('searchActiveUsers', () => {
  it('검색어가 없으면 활성 사용자만 돌려준다 — 탈퇴·정지에게는 보낼 수 없다', () => {
    const found = searchActiveUsers(users, '');

    expect(found.map((u) => u.userProfileId)).toEqual([1290, 977]);
  });

  it.each([
    ['1290', 1290],
    ['서연', 977],
    ['SKY@', 1290],
  ])(
    '"%s"로 찾으면 ID·닉네임·이메일 중 하나가 맞는 사람을 찾는다',
    (keyword, id) => {
      const found = searchActiveUsers(users, keyword);

      expect(found.map((u) => u.userProfileId)).toEqual([id]);
    },
  );

  it('탈퇴한 사람은 검색어가 맞아도 나오지 않는다', () => {
    expect(searchActiveUsers(users, '태오')).toEqual([]);
  });
});

describe('checkPastedIds', () => {
  it('활성 사용자는 닉네임과 함께 받는 사람 후보가 된다', () => {
    const check = checkPastedIds([1290, 977], users);

    expect(check.ready).toEqual([
      { userProfileId: 1290, nickname: '하늘' },
      { userProfileId: 977, nickname: '서연' },
    ]);
    expect(check.unavailable).toEqual([]);
  });

  it('목록에 없거나 탈퇴·정지한 ID는 보낼 수 없는 쪽으로 붙여넣은 순서대로 가른다', () => {
    const check = checkPastedIds([9999, 1290, 640, 23], users);

    expect(check.ready.map((r) => r.userProfileId)).toEqual([1290]);
    expect(check.unavailable).toEqual([9999, 640, 23]);
  });
});
