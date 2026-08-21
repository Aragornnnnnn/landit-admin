import { describe, expect, it } from 'vitest';

import {
  currentScenarioLabel,
  formatDateTimeDot,
  lastLearningLabel,
} from './user-detail';

describe('currentScenarioLabel', () => {
  it('제목 · Day · 종류를 한 줄로', () => {
    expect(
      currentScenarioLabel({
        scenarioTitle: '카페에서 주문하기',
        displayOrder: 13,
        dailyScenarioType: 'NEW',
      }),
    ).toBe('카페에서 주문하기 · Day 13 · 오늘의 시나리오');
  });

  it('있는 것만 잇는다', () => {
    expect(currentScenarioLabel({ scenarioTitle: '길 묻기' })).toBe('길 묻기');
  });

  it('시나리오가 없으면 —', () => {
    expect(currentScenarioLabel(undefined)).toBe('—');
  });
});

describe('lastLearningLabel', () => {
  const today = new Date(2026, 7, 21, 9, 0);

  it('오늘·어제는 말로 적는다 — 알고 싶은 건 "요즘 쓰고 있나"다', () => {
    expect(lastLearningLabel('2026-08-21', today)).toBe('오늘');
    expect(lastLearningLabel('2026-08-20', today)).toBe('어제');
  });

  it('새벽에 한 학습도 오늘이다 — 시각이 아니라 날짜로 잰다', () => {
    expect(lastLearningLabel('2026-08-21T01:30:00', today)).toBe('오늘');
  });

  it('그 이전은 날짜', () => {
    expect(lastLearningLabel('2026-08-15', today)).toBe('2026.08.15');
  });

  it('없거나 이상한 값은 —', () => {
    expect(lastLearningLabel(undefined, today)).toBe('—');
    expect(lastLearningLabel('나중에', today)).toBe('—');
  });
});

describe('formatDateTimeDot', () => {
  it('"2026.08.18 09:12"', () => {
    expect(formatDateTimeDot('2026-08-18T09:12:00')).toBe('2026.08.18 09:12');
  });

  it('없으면 —', () => {
    expect(formatDateTimeDot(undefined)).toBe('—');
  });
});
