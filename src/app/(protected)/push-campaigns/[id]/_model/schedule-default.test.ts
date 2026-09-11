import { describe, expect, it } from 'vitest';

import { defaultScheduleInput, scheduleInputFromIso } from './schedule-default';

describe('defaultScheduleInput', () => {
  it('아직 안 지난 첫 빠른 선택(오늘 19:00)을 기본값으로', () => {
    // 2026-09-11(금) 14:00 KST
    expect(defaultScheduleInput(new Date('2026-09-11T05:00:00Z'))).toEqual({
      date: '2026-09-11',
      time: '19:00',
    });
  });

  it('오늘 19:00이 지났으면 내일 09:00', () => {
    // 20:00 KST
    expect(defaultScheduleInput(new Date('2026-09-11T11:00:00Z'))).toEqual({
      date: '2026-09-12',
      time: '09:00',
    });
  });
});

describe('scheduleInputFromIso', () => {
  it('저장된 UTC 예약 시각을 한국 날짜·시간 입력으로 되돌린다 — 예약 재시도용', () => {
    expect(scheduleInputFromIso('2026-09-12T10:00:00Z')).toEqual({
      date: '2026-09-12',
      time: '19:00',
    });
  });
});
