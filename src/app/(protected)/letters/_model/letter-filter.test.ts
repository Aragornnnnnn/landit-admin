import { describe, expect, it } from 'vitest';

import {
  DEFAULT_LETTER_FILTER,
  readLetterFilter,
  visibleLetterGroups,
  writeLetterFilter,
} from './letter-filter';

const params = (query: string) => new URLSearchParams(query);

describe('readLetterFilter', () => {
  it('빈 주소는 기본값 — 전체 탭, 타입 없음', () => {
    expect(readLetterFilter(params(''))).toEqual(DEFAULT_LETTER_FILTER);
  });

  it('아는 값만 읽는다', () => {
    expect(readLetterFilter(params('tab=DRAFT&type=NOTICE'))).toEqual({
      tab: 'DRAFT',
      type: 'NOTICE',
    });
  });

  it('모르는 값은 기본값으로 되돌린다 — 주소를 손으로 고쳐도 화면이 깨지지 않게', () => {
    expect(readLetterFilter(params('tab=WHATEVER&type=SPAM'))).toEqual(
      DEFAULT_LETTER_FILTER,
    );
  });
});

describe('writeLetterFilter', () => {
  it('기본값은 주소에 적지 않는다', () => {
    expect(writeLetterFilter(DEFAULT_LETTER_FILTER)).toBe('');
  });

  it('기본값과 다른 것만 적는다', () => {
    expect(writeLetterFilter({ tab: 'PUBLISHED', type: 'UPDATE' })).toBe(
      'tab=PUBLISHED&type=UPDATE',
    );
  });

  it('읽기와 쓰기가 서로를 되돌린다', () => {
    const filter = { tab: 'UNPUBLISHED', type: 'REPLY' } as const;
    expect(readLetterFilter(params(writeLetterFilter(filter)))).toEqual(filter);
  });
});

describe('visibleLetterGroups', () => {
  it('전체 탭은 세 그룹을 프레임 순서대로 보여준다', () => {
    expect(visibleLetterGroups('ALL').map((group) => group.status)).toEqual([
      'PUBLISHED',
      'DRAFT',
      'UNPUBLISHED',
    ]);
  });

  it('상태 탭은 그 그룹 하나만', () => {
    expect(visibleLetterGroups('DRAFT').map((group) => group.status)).toEqual([
      'DRAFT',
    ]);
  });
});
