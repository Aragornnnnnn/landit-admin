import { describe, expect, it } from 'vitest';

import { parseIdList } from './parse-id-list';

describe('parseIdList', () => {
  it('쉼표·공백·줄바꿈으로 나누고 앞의 #은 뗀다', () => {
    expect(parseIdList('1284, 1283\n#1279 1201;1188').ids).toEqual([
      1284, 1283, 1279, 1201, 1188,
    ]);
  });

  it('중복은 한 번만 세고, 숫자가 아니거나 0 이하면 잘못된 값으로 센다', () => {
    const parsed = parseIdList('5 5 abc 0 -3 7');
    expect(parsed).toEqual({
      ids: [5, 7],
      recognized: 2,
      duplicates: 1,
      invalid: 3,
    });
  });

  it('빈 입력은 아무것도 인식하지 않는다', () => {
    expect(parseIdList('  \n ')).toEqual({
      ids: [],
      recognized: 0,
      duplicates: 0,
      invalid: 0,
    });
  });
});
