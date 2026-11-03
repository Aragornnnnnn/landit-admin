import { describe, expect, it } from 'vitest';

import type {
  DraftExpression,
  ValidationReport,
} from '@/features/content/api/draft-payload';

import {
  draftMeta,
  expressionRows,
  locateRow,
  splitFindings,
} from './draft-content';

const expression = (
  levelGroup: DraftExpression['levelGroup'],
  text: string,
): DraftExpression => ({
  levelGroup,
  answerToQuestionDisplayOrder: 1,
  expressionType: 'BASIC',
  usageFrequencyLevel: 'HIGH',
  difficultyLevel: 1,
  targetExpressionText: text,
  baseExpressionMeaningText: '뜻',
  usageSummary: '',
  usageDescription: '',
  representativeQuestionText: '',
  representativeQuestionTranslation: '',
  representativeSentenceText: '',
  representativeSentenceTranslation: '',
  practiceExamples: [],
});

const report = (over: Partial<ValidationReport> = {}): ValidationReport => ({
  findings: [],
  surfaceDuplicates: [],
  semanticDuplicates: [],
  humanOnlyChecks: [],
  ...over,
});

describe('expressionRows', () => {
  const expressions = [
    expression('LEVEL_1', 'I want to'),
    expression('LEVEL_1', "because it's"),
    expression('LEVEL_4_TO_5', 'hands down'),
  ];

  it('전체 순번은 payload 순서, 레벨 안 인덱스는 같은 레벨끼리 센다', () => {
    const rows = expressionRows(expressions, null);

    expect(rows.map((row) => [row.ordinal, row.level, row.index])).toEqual([
      [1, 'LEVEL_1', 0],
      [2, 'LEVEL_1', 1],
      [3, 'LEVEL_4_TO_5', 0],
    ]);
    expect(rows[2].reference).toEqual({
      label: '[E 3]',
      path: 'expressions[LEVEL_4_TO_5][0]',
    });
  });

  it('검증기의 중복 기록을 payload 순서(index)로 줄에 붙인다', () => {
    const rows = expressionRows(
      expressions,
      report({
        surfaceDuplicates: [
          {
            index: 0,
            targetExpressionText: 'I want to',
            existingMatches: [{ id: 1948 }],
            batchMatchIndexes: [],
          },
          {
            index: 2,
            targetExpressionText: 'hands down',
            existingMatches: [{ id: 2, targetExpressionText: 'hands down' }],
            batchMatchIndexes: [1],
          },
        ],
        semanticDuplicates: [
          {
            index: 1,
            targetExpressionText: "because it's",
            duplicateOfId: 1950,
            duplicateOfText: 'since',
            reason: '같은 뜻',
          },
        ],
      }),
    );

    expect(rows.map((row) => row.duplicates.map((d) => d.label))).toEqual([
      ['E-DEDUP-KEY · 기존 #1948'],
      ['뜻 중복 #1950'],
      ["기존 'hands down'", '이 배치 #2'],
    ]);
  });
});

describe('splitFindings', () => {
  it('FAIL → WARN → 검사 불가 순으로 보이고 PASS는 따로 접는다', () => {
    const { shown, passed } = splitFindings([
      { ruleId: 'A', level: 'PASS', path: null, message: null },
      { ruleId: 'B', level: 'UNCHECKED', path: null, message: null },
      { ruleId: 'C', level: 'WARN', path: null, message: null },
      { ruleId: 'D', level: 'FAIL', path: null, message: null },
    ]);

    expect(shown.map((f) => f.ruleId)).toEqual(['D', 'C', 'B']);
    expect(passed.map((f) => f.ruleId)).toEqual(['A']);
  });
});

describe('draftMeta', () => {
  const scenario = {
    scenario: {
      categoryDisplayOrder: 6,
      aiRole: '친구',
      characterId: 'marco',
      difficulty: 'HARD' as const,
      firstSpeaker: 'USER' as const,
      totalQuestionCount: 9,
    },
    languageVariant: {
      title: 't',
      briefing: 'b',
      userOpeningInstruction: null,
      conversationGoal: 'g',
    },
    questions: [],
  };

  it('라인업 행이 있으면 그 값으로, 새 카테고리는 이름으로 적는다', () => {
    const lineup = {
      day: 301,
      title: 't',
      categoryDisplayOrder: null,
      proposedCategory: '건강',
      difficulty: 'EASY' as const,
      firstSpeaker: 'AI' as const,
      characterId: 'chloe',
      beats: [],
    };

    expect(draftMeta(scenario, lineup)).toBe(
      'chloe · EASY · 카테고리 건강 · AI 선발화',
    );
  });

  it('라인업 행이 없으면 시나리오 payload로, 카테고리 이름을 모르면 번호로 적는다', () => {
    expect(draftMeta(scenario, null)).toBe(
      'marco · HARD · 카테고리 #6 · USER 선발화',
    );
  });

  it('카테고리 이름을 알면 번호 대신 이름으로 적는다', () => {
    expect(draftMeta(scenario, null, '여행')).toBe(
      'marco · HARD · 카테고리 여행 · USER 선발화',
    );
  });

  it('둘 다 없으면(생성 전) 빈 문자열이다', () => {
    expect(draftMeta(null, null)).toBe('');
  });
});

describe('locateRow', () => {
  const rows = expressionRows(
    [expression('LEVEL_1', 'a'), expression('LEVEL_2_TO_3', 'b')],
    null,
  );

  it.each([
    [
      'questions[LEVEL_1][2].questionText',
      'questions',
      'questions[LEVEL_1][2]',
    ],
    [
      'expressions[LEVEL_2_TO_3][0]',
      'expressions',
      'expressions[LEVEL_2_TO_3][0]',
    ],
    [
      'expressions[1].practiceExamples[0]',
      'expressions',
      'expressions[LEVEL_2_TO_3][0]',
    ],
    ['starMessages[2.5]', 'stars', 'starMessages[2.5]'],
  ])(
    '%s → %s 탭의 %s 줄 (검증기 규칙 — 질문은 displayOrder, 별점은 starRating)',
    (path, tab, rowPath) => {
      expect(locateRow(path, rows)).toEqual({ tab, path: rowPath });
    },
  );

  it.each([['scenario.aiRole'], ['expressions[7]']])(
    '줄이 없는 경로(%s — 시나리오 필드·범위 밖 순번)는 null',
    (path) => {
      expect(locateRow(path, rows)).toBeNull();
    },
  );
});
