// 규칙 필터 — 쿼리스트링을 읽고 쓰며, 상태 안에서 scope별 수를 세고, 출처를 읽는다
import { describe, expect, it } from 'vitest';

import type { ContentRule } from '@/features/content/api/content-rule';

import {
  countRulesByScope,
  filterRules,
  readRuleFilter,
  ruleEmptyLabel,
  ruleSourceLabel,
  writeRuleFilter,
} from './rule-filter';

const rule = (
  ruleCode: string,
  scope: ContentRule['scope'],
  status: ContentRule['status'] = 'ACTIVE',
  sourceCommentId: number | null = null,
): ContentRule => ({
  ruleId: Number(ruleCode.replace(/\D/g, '')),
  ruleCode,
  scope,
  ruleText: '규칙',
  sourceCommentId,
  status,
  createdAt: '2026-10-23T09:00:00',
});

const RULES = [
  rule('Q-30', 'QUESTION'),
  rule('Q-31', 'QUESTION', 'ACTIVE', 41),
  rule('Q-07', 'QUESTION', 'RETIRED'),
  rule('C-01', 'COMMON'),
  rule('L-02', 'LINEUP', 'RETIRED'),
];

const params = (query: string) => new URLSearchParams(query);

describe('readRuleFilter', () => {
  it.each([
    ['', { scope: undefined, status: 'ACTIVE' }],
    ['scope=QUESTION', { scope: 'QUESTION', status: 'ACTIVE' }],
    ['status=RETIRED', { scope: undefined, status: 'RETIRED' }],
    ['status=ALL&scope=COMMON', { scope: 'COMMON', status: 'ALL' }],
    ['scope=NOPE&status=nope', { scope: undefined, status: 'ACTIVE' }],
  ])(
    '쿼리스트링 "%s"를 읽으면 필터가 된다 — 모르는 값은 기본값',
    (query, expected) => {
      expect(readRuleFilter(params(query))).toEqual(expected);
    },
  );
});

describe('writeRuleFilter', () => {
  it.each([
    [{ scope: undefined, status: 'ACTIVE' as const }, ''],
    [
      { scope: 'QUESTION' as const, status: 'ACTIVE' as const },
      'scope=QUESTION',
    ],
    [{ scope: undefined, status: 'ALL' as const }, 'status=ALL'],
  ])(
    '필터를 쓰면 "%s"가 된다 — 기본값(상태 ACTIVE)은 적지 않는다',
    (filter, query) => {
      expect(writeRuleFilter(filter)).toBe(query);
    },
  );
});

describe('filterRules', () => {
  it('scope와 상태를 둘 다 걸러 ACTIVE QUESTION만 남긴다', () => {
    expect(
      filterRules(RULES, { scope: 'QUESTION', status: 'ACTIVE' }).map(
        (r) => r.ruleCode,
      ),
    ).toEqual(['Q-30', 'Q-31']);
  });

  it('상태가 ALL이고 scope가 없으면 전부 남긴다', () => {
    expect(
      filterRules(RULES, { scope: undefined, status: 'ALL' }),
    ).toHaveLength(5);
  });
});

describe('countRulesByScope', () => {
  it('현재 상태 필터 안에서 scope별로 세고 ALL에 합을 둔다', () => {
    const counts = countRulesByScope(RULES, 'ACTIVE');

    expect(counts.ALL).toBe(3);
    expect(counts.QUESTION).toBe(2);
    expect(counts.COMMON).toBe(1);
    expect(counts.LINEUP).toBe(0);
  });
});

describe('ruleSourceLabel', () => {
  it.each([
    [41, '코멘트 #41'],
    [null, '시드·직접'],
  ])('승격 코멘트가 %s이면 출처를 "%s"로 적는다', (id, label) => {
    expect(ruleSourceLabel(rule('Q-1', 'QUESTION', 'ACTIVE', id))).toBe(label);
  });
});

describe('ruleEmptyLabel', () => {
  it.each([
    ['이 scope에 규칙이 없어요', { scope: 'QUESTION', status: 'ACTIVE' }],
    [
      '프롬프트에 들어가는 규칙이 없어요',
      { scope: undefined, status: 'ACTIVE' },
    ],
    ['은퇴한 규칙이 없어요', { scope: undefined, status: 'RETIRED' }],
    ['등록된 규칙이 없어요', { scope: undefined, status: 'ALL' }],
  ] as const)('조건에 맞는 규칙이 없으면 "%s"라고 말한다', (label, filter) => {
    expect(ruleEmptyLabel(filter)).toBe(label);
  });
});
