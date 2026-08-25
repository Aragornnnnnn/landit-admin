import { describe, expect, it } from 'vitest';

import { letterGroupCountLabel, letterSummaryLabel } from './letter-label';

describe('letterSummaryLabel', () => {
  it('프레임 그대로 "발행됨 4 · 임시저장 2"', () => {
    expect(
      letterSummaryLabel([
        { status: 'PUBLISHED', count: 4 },
        { status: 'DRAFT', count: 2 },
        { status: 'UNPUBLISHED', count: 1 },
      ]),
    ).toBe('발행됨 4 · 임시저장 2');
  });

  it('아직 세지 못한 그룹은 빼고 말한다 — 로딩 중에 0건이라고 하지 않는다', () => {
    expect(
      letterSummaryLabel([
        { status: 'PUBLISHED', count: 4 },
        { status: 'DRAFT', count: undefined },
      ]),
    ).toBe('발행됨 4');
  });

  it('숨김만 보는 탭에서는 요약이 없다 — 숨김은 할 일의 크기가 아니다', () => {
    expect(letterSummaryLabel([{ status: 'UNPUBLISHED', count: 1 }])).toBe('');
  });
});

describe('letterGroupCountLabel', () => {
  it('고정이 있으면 함께 적는다', () => {
    expect(letterGroupCountLabel(4, 1)).toBe('4 · 고정 1');
  });

  it('고정이 없으면 건수만', () => {
    expect(letterGroupCountLabel(2, 0)).toBe('2');
  });
});
