import { describe, expect, it } from 'vitest';

import {
  defaultCharacterRatio,
  estimateGeneration,
  validateBatchRequest,
} from './batch-request';

const request = (over = {}) => ({
  dayCount: 10,
  characterRatio: { chloe: 4, marco: 3, teddy: 3 },
  note: '',
  autoProceed: false,
  ...over,
});

describe('validateBatchRequest', () => {
  it('정수 합이 Day 수와 같으면 통과한다', () => {
    expect(validateBatchRequest(request())).toBeNull();
  });

  it.each([
    [0, 'Day 수는 1~30 사이 정수로 입력해 주세요'],
    [31, 'Day 수는 1~30 사이 정수로 입력해 주세요'],
    [2.5, 'Day 수는 1~30 사이 정수로 입력해 주세요'],
  ])('Day 수 %s는 거절한다', (dayCount, message) => {
    expect(validateBatchRequest(request({ dayCount }))).toBe(message);
  });

  it('캐릭터 합이 Day 수와 다르면 거절한다', () => {
    const wrong = request({ characterRatio: { chloe: 4, marco: 3, teddy: 2 } });

    expect(validateBatchRequest(wrong)).toBe(
      '캐릭터별 Day 수의 합을 Day 수와 맞춰 주세요',
    );
  });

  it('캐릭터 수가 음수거나 정수가 아니면 거절한다', () => {
    const negative = request({
      characterRatio: { chloe: 11, marco: -1, teddy: 0 },
    });

    expect(validateBatchRequest(negative)).toBe(
      '캐릭터별 Day 수는 0 이상 정수로 입력해 주세요',
    );
  });

  it('메모가 2,000자를 넘으면 거절한다', () => {
    expect(validateBatchRequest(request({ note: 'a'.repeat(2001) }))).toBe(
      '메모는 2,000자까지 입력해 주세요',
    );
  });
});

describe('defaultCharacterRatio', () => {
  it('Day 수를 3으로 나누고 나머지는 누적이 적은 캐릭터부터 준다', () => {
    const counts = { chloe: 80, marco: 74, teddy: 146 };

    expect(defaultCharacterRatio(10, counts)).toEqual({
      chloe: 3,
      marco: 4,
      teddy: 3,
    });
    expect(defaultCharacterRatio(11, counts)).toEqual({
      chloe: 4,
      marco: 4,
      teddy: 3,
    });
  });

  it('누적이 없으면 chloe·marco·teddy 순으로 나머지를 준다', () => {
    expect(defaultCharacterRatio(4, {})).toEqual({
      chloe: 2,
      marco: 1,
      teddy: 1,
    });
  });
});

describe('estimateGeneration', () => {
  it('Day 수에 비례해 분·달러를 어림한다', () => {
    expect(estimateGeneration(10)).toEqual({ minutes: 70, dollars: 11 });
    expect(estimateGeneration(3)).toEqual({ minutes: 21, dollars: 3.3 });
  });
});
