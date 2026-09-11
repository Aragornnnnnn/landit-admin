import { describe, expect, it } from 'vitest';

import {
  formatKst,
  kstNow,
  quickSchedulePicks,
  scheduleError,
  scheduleSummary,
  toKstIso,
} from './schedule-time';

// 2026-09-11(금) 14:00 KST
const now = new Date('2026-09-11T05:00:00Z');

describe('한국 시간 입력', () => {
  it('날짜·시간을 +09:00 오프셋 문자열로 만든다 — BE 예약 API 형식', () => {
    expect(toKstIso({ date: '2026-09-12', time: '19:00' })).toBe(
      '2026-09-12T19:00:00+09:00',
    );
  });

  it('지금을 브라우저 시간대와 무관하게 한국 시간으로 읽는다', () => {
    expect(kstNow(now)).toEqual({ date: '2026-09-11', time: '14:00' });
  });
});

describe('scheduleError', () => {
  it('지금부터 1분 이후만 예약할 수 있다', () => {
    expect(scheduleError({ date: '2026-09-11', time: '14:00' }, now)).toBe(
      '지금부터 1분 이후만 예약할 수 있어요',
    );
    expect(
      scheduleError({ date: '2026-09-11', time: '14:02' }, now),
    ).toBeNull();
  });

  it('비었거나 형식이 틀리면 입력을 요청한다', () => {
    expect(scheduleError({ date: '', time: '19:00' }, now)).toBe(
      '날짜와 시간을 입력해 주세요',
    );
    expect(scheduleError({ date: '2026-13-40', time: '19:00' }, now)).toBe(
      '날짜와 시간을 입력해 주세요',
    );
  });
});

describe('quickSchedulePicks', () => {
  it('오늘·내일·다음 월요일을 한국 날짜로 만들고, 이미 지난 것은 past로 표시한다', () => {
    expect(quickSchedulePicks(now)).toEqual([
      {
        label: '오늘 19:00',
        input: { date: '2026-09-11', time: '19:00' },
        past: false,
      },
      {
        label: '내일 09:00',
        input: { date: '2026-09-12', time: '09:00' },
        past: false,
      },
      {
        label: '내일 19:00',
        input: { date: '2026-09-12', time: '19:00' },
        past: false,
      },
      {
        label: '다음 월요일 09:00',
        input: { date: '2026-09-14', time: '09:00' },
        past: false,
      },
    ]);
    // 20:00 KST면 오늘 19:00은 이미 지났다
    expect(quickSchedulePicks(new Date('2026-09-11T11:00:00Z'))[0].past).toBe(
      true,
    );
  });
});

describe('표시', () => {
  it('요약은 "M월 D일 (요일) 오전/오후 h:mm에 발송"', () => {
    expect(scheduleSummary({ date: '2026-09-12', time: '19:00' })).toBe(
      '9월 12일 (토) 오후 7:00에 발송',
    );
    expect(scheduleSummary({ date: '2026-09-14', time: '09:05' })).toBe(
      '9월 14일 (월) 오전 9:05에 발송',
    );
  });

  it('UTC ISO를 한국 시간 MM.DD HH:mm으로 — 오프셋 없는 LocalDateTime도 그대로 읽는다', () => {
    expect(formatKst('2026-09-12T10:00:00Z')).toBe('09.12 19:00');
    expect(formatKst('2026-09-08T10:04:00')).toBe('09.08 10:04');
    expect(formatKst('nope')).toBe('');
  });
});
