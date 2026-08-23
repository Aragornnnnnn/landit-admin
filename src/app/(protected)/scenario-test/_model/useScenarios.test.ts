import { describe, expect, it } from 'vitest';

import { difficultyLabel, scenarioSubLabel } from './useScenarios';

describe('difficultyLabel', () => {
  it('아는 값은 우리 말로', () => {
    expect(difficultyLabel('BEGINNER')).toBe('초급');
    expect(difficultyLabel('ADVANCED')).toBe('고급');
  });

  it('모르는 값은 그대로 — BE가 자유 문자열로 준다', () => {
    expect(difficultyLabel('EXPERT')).toBe('EXPERT');
    expect(difficultyLabel(undefined)).toBe('');
  });
});

describe('scenarioSubLabel', () => {
  it('Day · 난이도 · scenarioId (프레임)', () => {
    expect(
      scenarioSubLabel({
        scenarioId: 100,
        displayOrder: 1,
        difficulty: 'BEGINNER',
      }),
    ).toBe('Day 1 · 초급 · scenarioId 100');
  });

  it('없는 값은 빼고 잇는다', () => {
    expect(scenarioSubLabel({ scenarioId: 100 })).toBe('scenarioId 100');
  });
});
