import { describe, expect, it } from 'vitest';

import { nextScheduleLabel } from './next-schedule-label';

// 2026-09-11(금) 14:00 KST
const now = new Date('2026-09-11T05:00:00Z');

describe('nextScheduleLabel', () => {
  it.each([
    ['2026-09-11T10:00:00Z', '오늘 (금) 19:00'],
    ['2026-09-12T10:00:00Z', '내일 (토) 19:00'],
    ['2026-09-14T00:00:00Z', '09.14 (월) 09:00'],
  ])('%s → "%s" — 오늘·내일은 말로, 그 뒤는 날짜로', (iso, label) => {
    expect(nextScheduleLabel(iso, now)).toBe(label);
  });
});
