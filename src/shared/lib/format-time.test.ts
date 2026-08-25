// 시각 표기 검증 — 상대 시각의 구간 경계와 잘못된 값 폴백
import { describe, expect, it } from 'vitest';

import { formatDateTime, formatRelativeTime } from './format-time';

describe('formatDateTime', () => {
  it('MM.DD HH:mm으로 적는다', () => {
    expect(formatDateTime('2026-08-18T10:12:00')).toBe('08.18 10:12');
  });

  it('시각이 아니면 빈 문자열 — 목록이 깨지는 것보다 낫다', () => {
    expect(formatDateTime('없는날짜')).toBe('');
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2026-08-20T12:00:00');
  const ago = (ms: number) => new Date(now.getTime() - ms).toISOString();

  it.each([
    [30 * 1000, '방금'],
    [10 * 60_000, '10분 전'],
    [3 * 3_600_000, '3시간 전'],
    [30 * 3_600_000, '어제'],
  ])('%d ms 전이면 "%s"', (elapsed, expected) => {
    expect(formatRelativeTime(ago(elapsed), now)).toBe(expected);
  });

  it('이틀이 넘으면 날짜로 적는다 — "3일 전"보다 찾기 쉽다', () => {
    expect(formatRelativeTime('2026-08-16T09:00:00', now)).toBe('8.16');
  });

  it('시각이 아니면 빈 문자열', () => {
    expect(formatRelativeTime('없는날짜', now)).toBe('');
  });
});
