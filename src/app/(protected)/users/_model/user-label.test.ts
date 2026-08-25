import { describe, expect, it } from 'vitest';

import { usersProgressLabel, usersRangeLabel } from './user-label';

describe('usersProgressLabel', () => {
  it('받는 중에는 검색 범위가 제한된다는 걸 함께 말한다', () => {
    expect(usersProgressLabel(650, true)).toBe(
      '650명 불러오는 중 · 검색은 불러온 범위에서',
    );
  });

  it('다 받으면 인원만 말한다', () => {
    expect(usersProgressLabel(1284, false)).toBe('1,284명');
  });
});

describe('usersRangeLabel', () => {
  it('지금 보고 있는 몫', () => {
    expect(usersRangeLabel(0, 20, 1284)).toBe('1–20 / 1,284 (로컬 페이징)');
    expect(usersRangeLabel(64, 20, 1284)).toBe(
      '1281–1284 / 1,284 (로컬 페이징)',
    );
  });

  it('결과가 없으면 0', () => {
    expect(usersRangeLabel(0, 20, 0)).toBe('0');
  });
});
