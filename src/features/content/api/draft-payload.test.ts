import { describe, expect, it } from 'vitest';

import {
  readExpressions,
  readReviewDefects,
  readScenarioDraft,
  readValidationReport,
} from './draft-payload';

describe('readReviewDefects', () => {
  it('검수 전(null)·빈 배열(결함 없음)·깨진 값을 구분한다', () => {
    expect(readReviewDefects(null)).toEqual({ state: 'missing' });
    expect(readReviewDefects(undefined)).toEqual({ state: 'missing' });
    expect(readReviewDefects([])).toEqual({ state: 'ok', value: [] });
    expect(readReviewDefects('{broken')).toEqual({ state: 'broken' });
    expect(readReviewDefects({ not: 'array' })).toEqual({ state: 'broken' });
  });

  it('문자열로 온 JSON 배열도 읽는다', () => {
    const json = JSON.stringify([
      {
        type: '무례',
        path: 'questions[LEVEL_1][0]',
        excerpt: 'x',
        reason: 'y',
        ruleCode: null,
      },
    ]);

    expect(readReviewDefects(json)).toEqual({
      state: 'ok',
      value: [
        {
          type: '무례',
          path: 'questions[LEVEL_1][0]',
          excerpt: 'x',
          reason: 'y',
          ruleCode: null,
        },
      ],
    });
  });
});

describe('readScenarioDraft', () => {
  it('questions가 배열이 아니면 깨진 값으로 본다', () => {
    expect(readScenarioDraft({ scenario: {}, languageVariant: {} })).toEqual({
      state: 'broken',
    });
  });

  it('질문 배열이 있으면 그대로 돌려준다', () => {
    const payload = {
      scenario: { characterId: 'chloe' },
      languageVariant: { title: '제목' },
      questions: [{ questionLevelGroup: 'LEVEL_1', displayOrder: 1 }],
    };

    expect(readScenarioDraft(payload)).toMatchObject({
      state: 'ok',
      value: { languageVariant: { title: '제목' } },
    });
  });
});

describe('readExpressions · readValidationReport', () => {
  it('원소가 객체가 아닌 배열은 깨진 값이다', () => {
    expect(readExpressions([1, 2])).toEqual({ state: 'broken' });
  });

  it('검증 결과에 findings 배열이 없으면 깨진 값이다', () => {
    expect(readValidationReport({ findings: 'x' })).toEqual({
      state: 'broken',
    });
    expect(readValidationReport({ findings: [] })).toEqual({
      state: 'ok',
      value: {
        findings: [],
        surfaceDuplicates: [],
        semanticDuplicates: [],
        humanOnlyChecks: [],
      },
    });
  });
});
