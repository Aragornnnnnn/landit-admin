import { describe, expect, it } from 'vitest';

import type { ContentBatch } from '../api/content-batch';
import { batchRemark, formatCharacterRatio } from './content-label';

const batch = (over: Partial<ContentBatch>): ContentBatch => ({
  batchId: 1,
  status: 'REVIEW_READY',
  startDay: 1,
  endDay: 10,
  dayCount: 10,
  characterRatio: { chloe: 4, marco: 3, teddy: 3 },
  note: null,
  autoProceed: false,
  requestedBy: 1,
  errorMessage: null,
  createdAt: '2026-10-22T09:30:00',
  updatedAt: '2026-10-22T10:05:00',
  ...over,
});

describe('batchRemark', () => {
  it.each([
    ['LINEUP_READY', '라인업 확인 대기'],
    ['REVIEW_READY', '검수 대기'],
    ['APPROVED', '에셋 생성 대기'],
    ['GENERATING', '—'],
  ] as const)('%s → %s', (status, remark) => {
    expect(batchRemark(batch({ status }))).toBe(remark);
  });

  it('실패한 배치는 사유를, 사유가 없으면 "실패"를 적는다', () => {
    expect(
      batchRemark(batch({ status: 'FAILED', errorMessage: '모든 Day 실패' })),
    ).toBe('모든 Day 실패');
    expect(batchRemark(batch({ status: 'FAILED' }))).toBe('실패');
  });
});

describe('formatCharacterRatio', () => {
  it('캐릭터 순서대로 점으로 잇고 빠진 값은 0으로 적는다', () => {
    expect(formatCharacterRatio({ chloe: 4, marco: 3, teddy: 3 })).toBe(
      'chloe 4 · marco 3 · teddy 3',
    );
    expect(formatCharacterRatio({ chloe: 1 })).toBe(
      'chloe 1 · marco 0 · teddy 0',
    );
  });
});
