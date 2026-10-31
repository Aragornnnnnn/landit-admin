import { describe, expect, it } from 'vitest';

import { ratioAdvice, reservedDayRange } from './batch-draft';

describe('ratioAdvice', () => {
  it('누적이 가장 많은 캐릭터를 짚고 나머지 비중을 올리라고 한다', () => {
    expect(ratioAdvice({ chloe: 80, marco: 74, teddy: 146 })).toBe(
      '누적 분포 chloe 80 · marco 74 · teddy 146 — teddy가 많으니 chloe·marco 비중을 올리는 쪽을 권장',
    );
  });

  it('누적이 전부 같으면 권장 없이 분포만 적는다', () => {
    expect(ratioAdvice({ chloe: 10, marco: 10, teddy: 10 })).toBe(
      '누적 분포 chloe 10 · marco 10 · teddy 10',
    );
  });

  it('누적을 아직 못 받았으면 빈 문자열', () => {
    expect(ratioAdvice(undefined)).toBe('');
  });
});

describe('reservedDayRange', () => {
  it('다음 Day부터 Day 수만큼 연속 예약 범위를 적는다', () => {
    expect(reservedDayRange(301, 10)).toBe('Day 301 ~ 310 예약');
    expect(reservedDayRange(301, 1)).toBe('Day 301 예약');
  });

  it('다음 Day를 모르거나 Day 수가 범위 밖이면 빈 문자열', () => {
    expect(reservedDayRange(undefined, 10)).toBe('');
    expect(reservedDayRange(301, 0)).toBe('');
  });
});
