// 사용자 검색 URL과 서버 조회 조건을 검증한다.
import { describe, expect, it } from 'vitest';

import {
  changeUserFilter,
  DEFAULT_USER_FILTER,
  readUserFilter,
  USERS_PAGE_SIZE,
  userSearchParams,
  writeUserFilter,
} from './user-filter';

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

describe('userSearchParams', () => {
  it('검색 조건과 페이지를 서버에 넘기고 검색어 앞뒤 공백을 제거한다', () => {
    const params = userSearchParams({
      keyword: ' 1281 ',
      role: 'ADMIN',
      status: 'BANNED',
      page: 3,
    });
    expect(Object.fromEntries(params)).toEqual({
      keyword: '1281',
      role: 'ADMIN',
      status: 'BANNED',
      page: '3',
      size: String(USERS_PAGE_SIZE),
    });
  });

  it('빈 검색어와 전체 필터는 서버 조건에서 생략한다', () => {
    expect(
      Object.fromEntries(userSearchParams({ keyword: '   ', page: 0 })),
    ).toEqual({ page: '0', size: '20' });
  });
});
