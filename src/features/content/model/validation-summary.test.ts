import { describe, expect, it } from 'vitest';

import type { ContentReviewComment } from '../api/content-batch';
import type { ValidationReport } from '../api/draft-payload';
import {
  countDuplicates,
  countFixComments,
  summarizeFindings,
} from './validation-summary';

const report: ValidationReport = {
  findings: [
    { ruleId: 'Q-L1-ONE-MARK', level: 'PASS', path: null, message: null },
    {
      ruleId: 'E-DEDUP-KEY',
      level: 'FAIL',
      path: 'expressions[LEVEL_1][0]',
      message: '겹침',
    },
    {
      ruleId: 'E-DEDUP-KEY',
      level: 'FAIL',
      path: 'expressions[LEVEL_1][1]',
      message: '겹침',
    },
    {
      ruleId: 'Q-L1-WORDS',
      level: 'WARN',
      path: 'questions[LEVEL_1][2]',
      message: '19단어',
    },
    {
      ruleId: 'E-SEMANTIC',
      level: 'UNCHECKED',
      path: null,
      message: '임베딩 실패',
    },
  ],
  surfaceDuplicates: [
    {
      index: 0,
      targetExpressionText: 'I want to',
      existingMatches: [{ id: 1948 }],
      batchMatchIndexes: [],
    },
    {
      index: 1,
      targetExpressionText: 'because',
      existingMatches: [],
      batchMatchIndexes: [],
    },
    {
      index: 2,
      targetExpressionText: 'hands down',
      existingMatches: [],
      batchMatchIndexes: [5],
    },
  ],
  semanticDuplicates: [],
  humanOnlyChecks: ['질문 독립성'],
};

describe('summarizeFindings', () => {
  it('판정 수준별로 센다', () => {
    expect(summarizeFindings(report)).toEqual({
      fail: 2,
      warn: 1,
      unchecked: 1,
      pass: 1,
    });
  });

  it('검증 전(null)이면 전부 0이다', () => {
    expect(summarizeFindings(null)).toEqual({
      fail: 0,
      warn: 0,
      unchecked: 0,
      pass: 0,
    });
  });
});

describe('countDuplicates', () => {
  it('표면 중복은 기존 또는 같은 배치와 겹친 후보만 센다', () => {
    expect(countDuplicates(report)).toEqual({ surface: 2, semantic: 0 });
  });
});

describe('countFixComments', () => {
  const comment = (
    verdict: 'OK' | 'FIX',
    resolvedAt: string | null,
  ): ContentReviewComment => ({
    commentId: 1,
    targetPath: null,
    verdict,
    comment: 'x',
    resolvedAt,
    authorId: 1,
    createdAt: '2026-10-22T09:00:00',
  });

  it('열린 FIX와 해결된 FIX를 따로 세고 OK 코멘트는 빼놓는다', () => {
    const comments = [
      comment('FIX', null),
      comment('FIX', '2026-10-22T10:00:00'),
      comment('OK', null),
    ];

    expect(countFixComments(comments)).toEqual({ open: 1, resolved: 1 });
  });
});
