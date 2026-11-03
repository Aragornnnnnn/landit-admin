import { describe, expect, it } from 'vitest';

import type { ContentDraft } from '@/features/content/api/content-batch';

import { dayRowCells, reservedIdRange } from './day-row';

const draft = (over: Partial<ContentDraft> = {}): ContentDraft => ({
  draftId: 1,
  batchId: 6,
  plannedDay: 301,
  status: 'NEEDS_FIX',
  errorMessage: null,
  comments: [],
  ...over,
});

describe('dayRowCells', () => {
  it('초안을 아직 못 읽었으면 칸을 비워 둔다(…)', () => {
    expect(dayRowCells(undefined, 'NEEDS_FIX')).toBeNull();
  });

  it('읽어 둔 초안의 상태가 Day 상태와 다르면(재생성 뒤 아직 안 읽음) 낡은 수라 비워 둔다', () => {
    expect(
      dayRowCells(draft({ status: 'NEEDS_FIX' }), 'REVIEW_READY'),
    ).toBeNull();
  });

  it('검증기 FAIL·WARN, AI 결함 수, 열린·해결 FIX를 센다', () => {
    const cells = dayRowCells(
      draft({
        validationResult: {
          findings: [
            { ruleId: 'A', level: 'FAIL', path: null, message: null },
            { ruleId: 'B', level: 'WARN', path: null, message: null },
            { ruleId: 'C', level: 'PASS', path: null, message: null },
          ],
        },
        reviewResult: JSON.stringify([
          { type: 'x', path: null, excerpt: null, reason: 'y', ruleCode: null },
        ]),
        comments: [
          {
            commentId: 1,
            targetPath: null,
            verdict: 'FIX',
            comment: 'a',
            resolvedAt: null,
            authorId: 1,
            createdAt: '2026-10-22T09:00:00',
          },
          {
            commentId: 2,
            targetPath: null,
            verdict: 'FIX',
            comment: 'b',
            resolvedAt: '2026-10-22T10:00:00',
            authorId: 1,
            createdAt: '2026-10-22T09:00:00',
          },
        ],
      }),
      'NEEDS_FIX',
    );

    expect(cells).toEqual({
      fail: 1,
      warn: 1,
      unchecked: 0,
      defects: 1,
      openFix: 1,
      resolvedFix: 1,
      validated: true,
      reviewed: true,
    });
  });

  it('검증·검수 전이면 수는 0이고 아직 안 했음을 표시한다', () => {
    expect(dayRowCells(draft(), 'NEEDS_FIX')).toMatchObject({
      fail: 0,
      defects: 0,
      validated: false,
      reviewed: false,
    });
  });
});

describe('reservedIdRange', () => {
  it('초안들의 예약 id 중 최소~최대를 돌려주고 없으면 null', () => {
    expect(
      reservedIdRange([
        draft({ reservedExpressionIds: [8761, 8762] }),
        undefined,
        draft({ reservedExpressionIds: [8879, 8880] }),
      ]),
    ).toEqual({ min: 8761, max: 8880 });
    expect(reservedIdRange([draft(), undefined])).toBeNull();
  });
});
