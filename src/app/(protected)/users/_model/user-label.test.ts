import { describe, expect, it } from 'vitest';

import { usersProgressLabel, usersRangeLabel } from './user-label';

describe('usersProgressLabel', () => {
  it('요청 중이면 검색 중임을 표시한다', () => {
    expect(usersProgressLabel(650, true)).toBe('검색 중…');
  });

  it('서버 응답을 받으면 검색 결과 전체 건수를 표시한다', () => {
    expect(usersProgressLabel(1284, false)).toBe('검색 결과 1,284명');
  });
});

describe('usersRangeLabel', () => {
  it('지금 보고 있는 몫', () => {
    expect(usersRangeLabel(0, 20, 1284)).toBe('1–20 / 1,284');
    expect(usersRangeLabel(64, 20, 1284)).toBe('1281–1284 / 1,284');
  });

  it('결과가 없으면 0', () => {
    expect(usersRangeLabel(0, 20, 0)).toBe('0');
  });
});
