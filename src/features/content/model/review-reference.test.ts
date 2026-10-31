import { describe, expect, it } from 'vitest';

import {
  referenceOf,
  ruleScopeForPath,
  targetOfPath,
  toggleReference,
} from './review-reference';

describe('referenceOf', () => {
  it('질문은 레벨 약자와 순번으로, 경로는 검증기처럼 displayOrder(1부터)로 적는다', () => {
    expect(
      referenceOf({ kind: 'question', level: 'LEVEL_1', index: 1 }),
    ).toEqual({ label: '[L1 Q2]', path: 'questions[LEVEL_1][2]' });
    expect(
      referenceOf({ kind: 'question', level: 'LEVEL_4_TO_5', index: 0 }),
    ).toEqual({ label: '[L4 Q1]', path: 'questions[LEVEL_4_TO_5][1]' });
  });

  it('표현은 전체 순번 1~12로 부르고 경로는 레벨 안 인덱스다', () => {
    expect(
      referenceOf({
        kind: 'expression',
        level: 'LEVEL_2_TO_3',
        index: 0,
        ordinal: 5,
      }),
    ).toEqual({ label: '[E 5]', path: 'expressions[LEVEL_2_TO_3][0]' });
  });

  it('별점은 순번이 아니라 starRating으로 부른다 — 검증기 경로와 같다', () => {
    expect(referenceOf({ kind: 'star', rating: '2.5' })).toEqual({
      label: '[S 2.5]',
      path: 'starMessages[2.5]',
    });
  });
});

describe('toggleReference', () => {
  const ref = { label: '[L1 Q2]', path: 'questions[LEVEL_1][2]' };

  it('없는 참조를 누르면 코멘트 끝에 붙이고 대상 경로를 채운다', () => {
    expect(toggleReference({ text: '', targetPath: '' }, ref)).toEqual({
      text: '[L1 Q2] ',
      targetPath: 'questions[LEVEL_1][2]',
    });
    expect(
      toggleReference(
        { text: '어색함', targetPath: 'expressions[LEVEL_1][0]' },
        ref,
      ),
    ).toEqual({ text: '어색함 [L1 Q2] ', targetPath: 'questions[LEVEL_1][2]' });
  });

  it('같은 줄을 다시 누르면 참조 문자열을 지우고 그 경로였으면 비운다', () => {
    expect(
      toggleReference(
        { text: '[L1 Q2] 답이 Q1에 기댄다', targetPath: ref.path },
        ref,
      ),
    ).toEqual({ text: '답이 Q1에 기댄다', targetPath: '' });
  });

  it('다른 줄의 경로로 바뀐 뒤 해제하면 경로는 남긴다', () => {
    expect(
      toggleReference(
        { text: '[L1 Q2] [E 3] 겹침', targetPath: 'expressions[LEVEL_1][2]' },
        ref,
      ),
    ).toEqual({ text: '[E 3] 겹침', targetPath: 'expressions[LEVEL_1][2]' });
  });
});

describe('targetOfPath', () => {
  it.each([
    [
      'questions[LEVEL_1][2].questionText',
      { kind: 'question', level: 'LEVEL_1', index: 1 },
    ],
    [
      'expressions[LEVEL_4_TO_5][1]',
      { kind: 'expression', level: 'LEVEL_4_TO_5', index: 1 },
    ],
    ['expressions[3].practiceExamples[0]', { kind: 'expression', ordinal: 4 }],
    ['starMessages[2.5]', { kind: 'star', rating: '2.5' }],
    ['starMessages[3]', { kind: 'star', rating: '3' }],
  ])('%s → %o', (path, target) => {
    expect(targetOfPath(path)).toEqual(target);
  });

  it.each([['scenario.aiRole'], ['questions[LEVEL_1][0]'], [null]])(
    '모르는 경로나 0번 질문(%s)은 null',
    (path) => {
      expect(targetOfPath(path)).toBeNull();
    },
  );
});

describe('ruleScopeForPath', () => {
  it.each([
    ['questions[LEVEL_1][0]', 'QUESTION'],
    ['expressions[LEVEL_1][0].usageSummary', 'EXPRESSION'],
    ['starMessages[1]', 'STAR_MESSAGE'],
    ['scenario.aiRole', 'COMMON'],
    [null, 'COMMON'],
  ])('%s → %s', (path, scope) => {
    expect(ruleScopeForPath(path)).toBe(scope);
  });
});
