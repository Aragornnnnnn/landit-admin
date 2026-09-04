import { describe, expect, it } from 'vitest';

import {
  countCreatedToday,
  countsByType,
  dailyCounts,
  oldestPending,
  signupCounts,
  startOfWeek,
  todayLabel,
} from './dashboard-metrics';

const now = new Date(2026, 7, 18, 14, 20); // 2026-08-18 (화) 14:20
const at = (iso: string) => ({ createdAt: iso });

describe('startOfWeek', () => {
  it('주는 월요일에 시작한다', () => {
    expect(startOfWeek(now)).toEqual(new Date(2026, 7, 17));
  });

  it('일요일은 그 주의 마지막 날이다 — 다음 주로 넘기지 않는다', () => {
    expect(startOfWeek(new Date(2026, 7, 23, 23, 0))).toEqual(
      new Date(2026, 7, 17),
    );
  });
});

describe('countCreatedToday', () => {
  it('새벽에 들어온 것도 오늘이다 — 시각이 아니라 날짜로 센다', () => {
    expect(
      countCreatedToday(
        [
          at('2026-08-18T00:10:00'),
          at('2026-08-18T13:00:00'),
          at('2026-08-17T23:59:00'),
        ],
        now,
      ),
    ).toBe(2);
  });
});

describe('oldestPending', () => {
  it('처리중 중 가장 오래된 한 건과 며칠 기다렸는지', () => {
    expect(
      oldestPending(
        [
          {
            status: 'PENDING',
            createdAt: '2026-08-13T10:00:00',
            type: 'BUG_REPORT',
            nickname: '지훈',
          },
          {
            status: 'PENDING',
            createdAt: '2026-08-17T10:00:00',
            type: 'QUESTION',
            nickname: '예지',
          },
          {
            status: 'COMPLETED',
            createdAt: '2026-08-01T10:00:00',
            type: 'CHEER',
            nickname: '준',
          },
        ],
        now,
      ),
    ).toEqual({ waitingDays: 5, type: 'BUG_REPORT', nickname: '지훈' });
  });

  it('처리중이 없으면 없다 — 0일이라고 말하지 않는다', () => {
    expect(
      oldestPending([{ status: 'COMPLETED', createdAt: '2026-08-01' }], now),
    ).toBeNull();
  });
});

describe('dailyCounts', () => {
  const bars = dailyCounts(
    [
      at('2026-08-18T09:00:00'),
      at('2026-08-18T11:00:00'),
      at('2026-08-16T09:00:00'),
    ],
    now,
  );

  it('7일을 빠짐없이 채운다 — 빈 날이 빠지면 추세가 거짓말을 한다', () => {
    expect(bars).toHaveLength(7);
    expect(bars.map((bar) => bar.count)).toEqual([0, 0, 0, 0, 1, 0, 2]);
  });

  it('마지막 칸이 오늘이다', () => {
    expect(bars[6].today).toBe(true);
    expect(bars.filter((bar) => bar.today)).toHaveLength(1);
  });
});

describe('countsByType', () => {
  it('0건인 유형도 줄을 지우지 않는다 — 없다는 것도 정보다', () => {
    expect(
      countsByType([
        { type: 'BUG_REPORT' },
        { type: 'BUG_REPORT' },
        { type: 'QUESTION' },
      ]),
    ).toEqual([
      { type: 'BUG_REPORT', count: 2 },
      { type: 'FEATURE_REQUEST', count: 0 },
      { type: 'QUESTION', count: 1 },
      { type: 'CHEER', count: 0 },
    ]);
  });
});

describe('signupCounts', () => {
  it('이번 주와 지난주를 월요일 기준으로 가른다', () => {
    expect(
      signupCounts(
        [
          { createdAt: '2026-08-18T10:00:00' },
          { createdAt: '2026-08-17T00:30:00' },
          { createdAt: '2026-08-16T10:00:00' },
          { createdAt: '2026-08-11T10:00:00' },
          { createdAt: '2026-08-01T10:00:00' },
        ],
        now,
      ),
    ).toEqual({ thisWeek: 2, lastWeek: 2 });
  });
});

describe('todayLabel', () => {
  it('요일까지 적는다', () => {
    expect(todayLabel(now)).toBe('2026년 8월 18일 (화)');
  });
});
