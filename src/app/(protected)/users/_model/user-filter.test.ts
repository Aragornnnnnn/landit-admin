import { describe, expect, it } from 'vitest';

import type { UserListItem } from '@/features/user/api/user-list';

import {
  changeUserFilter,
  DEFAULT_USER_FILTER,
  filterUsers,
  pageOfUsers,
  readUserFilter,
  USERS_PAGE_SIZE,
  writeUserFilter,
} from './user-filter';

const user = (patch: Partial<UserListItem>): UserListItem => ({
  userProfileId: 1,
  email: 'sujin@gmail.com',
  nickname: '수진',
  role: 'USER',
  status: 'ACTIVE',
  createdAt: '2026-08-18T10:00:00',
  ...patch,
});

describe('readUserFilter · writeUserFilter', () => {
  it('빈 주소는 기본값', () => {
    expect(readUserFilter(new URLSearchParams(''))).toEqual(
      DEFAULT_USER_FILTER,
    );
  });

  it('모르는 값은 버린다', () => {
    expect(
      readUserFilter(new URLSearchParams('role=BOSS&status=SLEEP&page=-2')),
    ).toEqual(DEFAULT_USER_FILTER);
  });

  it('읽기와 쓰기가 서로를 되돌린다', () => {
    const filter = {
      keyword: 'sujin',
      role: 'ADMIN',
      status: 'BANNED',
      page: 3,
    } as const;
    expect(
      readUserFilter(new URLSearchParams(writeUserFilter(filter))),
    ).toEqual(filter);
  });
});

describe('changeUserFilter', () => {
  it('조건을 바꾸면 첫 페이지로 — 3페이지가 없을 수 있다', () => {
    expect(
      changeUserFilter({ ...DEFAULT_USER_FILTER, page: 3 }, { keyword: 'a' }),
    ).toEqual({
      keyword: 'a',
      page: 0,
    });
  });

  it('페이지만 바꿀 땐 그대로 간다', () => {
    expect(changeUserFilter(DEFAULT_USER_FILTER, { page: 2 }).page).toBe(2);
  });
});

describe('filterUsers', () => {
  const users = [
    user({ userProfileId: 1, email: 'sujin@gmail.com', nickname: '수진' }),
    user({
      userProfileId: 2,
      email: 'minho@naver.com',
      nickname: '민호',
      role: 'ADMIN',
    }),
    user({
      userProfileId: 3,
      email: 'old@gmail.com',
      nickname: '',
      status: 'WITHDRAWN',
    }),
  ];

  it('이메일·닉네임을 대소문자 없이 부분 일치로 찾는다', () => {
    expect(filterUsers(users, { keyword: 'SUJIN', page: 0 })).toHaveLength(1);
    expect(filterUsers(users, { keyword: '민호', page: 0 })).toHaveLength(1);
    expect(filterUsers(users, { keyword: 'gmail', page: 0 })).toHaveLength(2);
  });

  it('역할·상태와 함께 걸린다', () => {
    expect(
      filterUsers(users, { keyword: '', role: 'ADMIN', page: 0 }),
    ).toHaveLength(1);
    expect(
      filterUsers(users, { keyword: 'gmail', status: 'WITHDRAWN', page: 0 }),
    ).toHaveLength(1);
  });

  it('닉네임이 없어도 터지지 않는다', () => {
    expect(filterUsers(users, { keyword: '수진', page: 0 })).toHaveLength(1);
  });
});

describe('pageOfUsers', () => {
  const users = Array.from({ length: 45 }, (_, index) =>
    user({ userProfileId: index }),
  );

  it('페이지 몫만 자른다', () => {
    expect(pageOfUsers(users, 0)).toHaveLength(USERS_PAGE_SIZE);
    expect(pageOfUsers(users, 2)).toHaveLength(5);
    expect(pageOfUsers(users, 9)).toHaveLength(0);
  });
});
