import { describe, expect, it } from 'vitest';

import type { ContentDaySummary } from '@/features/content/api/content-batch';

import {
  hasLineupChanges,
  lineupRowsOf,
  setCategory,
  toLineupRequest,
  validateLineupRows,
  type LineupDraftRow,
} from './lineup-draft';

const lineupRow = (day: number, over = {}) => ({
  day,
  title: `제목 ${day}`,
  categoryDisplayOrder: 6,
  proposedCategory: null,
  difficulty: 'EASY',
  firstSpeaker: 'AI',
  characterId: 'chloe',
  beats: ['하나', '둘'],
  overlapWarnings: [],
  ...over,
});

const day = (plannedDay: number, lineupRow: unknown): ContentDaySummary => ({
  draftId: plannedDay,
  plannedDay,
  status: 'LINEUP',
  title: null,
  errorMessage: null,
  lineupRow,
});

const ratio = { chloe: 1, marco: 1, teddy: 0 };

describe('lineupRowsOf', () => {
  it('Day 요약의 라인업 행을 편집 행으로 바꾸고 깨진 행은 건너뛴다', () => {
    const rows = lineupRowsOf([
      day(301, lineupRow(301)),
      day(302, 'broken'),
      day(303, null),
    ]);

    expect(rows.map((row) => row.day)).toEqual([301]);
    expect(rows[0].beats).toEqual(['하나', '둘']);
  });
});

describe('validateLineupRows', () => {
  const valid: LineupDraftRow[] = [
    lineupRow(301) as LineupDraftRow,
    lineupRow(302, { characterId: 'marco' }) as LineupDraftRow,
  ];

  it('전부 맞으면 행 오류도 표 오류도 없다', () => {
    expect(validateLineupRows(valid, ratio)).toEqual({ rows: {}, table: null });
  });

  it.each([
    ['제목이 비면', { title: ' ' }, '제목을 적어 주세요'],
    ['제목이 100자를 넘으면', { title: 'a'.repeat(101) }, '제목은 100자까지'],
    [
      '카테고리 번호도 새 이름도 없으면',
      { categoryDisplayOrder: null, proposedCategory: '' },
      '기존 카테고리 번호나 새 카테고리 이름 중 하나를 골라 주세요',
    ],
    ['줄거리가 1줄이면', { beats: ['하나'] }, '줄거리는 2~5줄'],
    [
      '줄거리가 6줄이면',
      { beats: ['1', '2', '3', '4', '5', '6'] },
      '줄거리는 2~5줄',
    ],
    [
      '줄거리 한 줄이 200자를 넘으면',
      { beats: ['a'.repeat(201), '둘'] },
      '줄거리는 한 줄 200자까지',
    ],
  ])('%s 그 행에 오류를 단다', (_label, over, message) => {
    const rows = [lineupRow(301, over) as LineupDraftRow, valid[1]];

    const result = validateLineupRows(rows, ratio);

    expect(result.rows[301]).toContain(message);
    expect(result.rows[302]).toBeUndefined();
  });

  it('캐릭터 수가 접수 비중과 다르면 표 전체 오류다', () => {
    const rows = [valid[0], { ...valid[1], characterId: 'chloe' }];

    expect(validateLineupRows(rows, ratio).table).toBe(
      '캐릭터 수가 접수 비중(chloe 1 · marco 1 · teddy 0)과 달라요 — 지금 chloe 2 · marco 0 · teddy 0',
    );
  });
});

describe('setCategory · toLineupRequest', () => {
  it('번호를 고르면 새 이름을 비우고, 새 이름을 적으면 번호를 비운다 — 둘 중 하나만 BE에 간다', () => {
    const row = lineupRow(301) as LineupDraftRow;

    const named = setCategory(row, { proposedCategory: '건강' });
    const numbered = setCategory(named, { categoryDisplayOrder: 3 });

    expect(named).toMatchObject({
      categoryDisplayOrder: null,
      proposedCategory: '건강',
    });
    expect(numbered).toMatchObject({
      categoryDisplayOrder: 3,
      proposedCategory: null,
    });
  });

  it('요청엔 겹침 경고를 싣지 않고 빈 줄거리 줄을 뺀다', () => {
    const rows = [
      lineupRow(301, {
        beats: ['하나', '', '둘 '],
        overlapWarnings: [{ day: 1, reason: 'x' }],
      }) as LineupDraftRow,
    ];

    expect(toLineupRequest(rows)).toEqual([
      {
        day: 301,
        title: '제목 301',
        categoryDisplayOrder: 6,
        proposedCategory: undefined,
        difficulty: 'EASY',
        firstSpeaker: 'AI',
        characterId: 'chloe',
        beats: ['하나', '둘'],
      },
    ]);
  });
});

describe('hasLineupChanges', () => {
  it('값이 하나라도 다르면 바뀐 것이다', () => {
    const original = [lineupRow(301) as LineupDraftRow];

    expect(hasLineupChanges(original, [{ ...original[0] }])).toBe(false);
    expect(
      hasLineupChanges(original, [{ ...original[0], title: '다른' }]),
    ).toBe(true);
    expect(
      hasLineupChanges(original, [{ ...original[0], beats: ['하나', '셋'] }]),
    ).toBe(true);
  });
});
