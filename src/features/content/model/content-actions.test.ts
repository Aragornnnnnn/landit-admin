import { describe, expect, it } from 'vitest';

import type { ContentBatch, ContentBatchDetail } from '../api/content-batch';
import {
  canApprove,
  canRegenerateDraft,
  canResume,
  canReview,
  reviewBlockedReason,
  shouldPollBatch,
  STALE_GENERATING_MS,
  summarizeDays,
} from './content-actions';

const batch = (over: Partial<ContentBatch> = {}): ContentBatch => ({
  batchId: 6,
  status: 'REVIEW_READY',
  startDay: 301,
  endDay: 310,
  dayCount: 2,
  characterRatio: { chloe: 1, marco: 1, teddy: 0 },
  note: null,
  autoProceed: false,
  requestedBy: 1,
  errorMessage: null,
  createdAt: '2026-10-22T09:30:00',
  updatedAt: '2026-10-22T10:05:00',
  ...over,
});

const day = (
  status: ContentBatchDetail['days'][number]['status'],
  draftId = 1,
): ContentBatchDetail['days'][number] => ({
  draftId,
  plannedDay: 300 + draftId,
  status,
  title: null,
  errorMessage: null,
});

describe('shouldPollBatch', () => {
  it.each([
    ['REQUESTED', true],
    ['LINEUP_GENERATING', true],
    ['GENERATING', true],
    ['LINEUP_READY', false],
    ['REVIEW_READY', false],
    ['APPROVED', false],
  ] as const)('배치가 %s이면 폴링 %s', (status, expected) => {
    expect(shouldPollBatch({ batch: batch({ status }), days: [] })).toBe(
      expected,
    );
  });

  it('검수 대기 배치라도 다시 만드는 중인 Day가 있으면 폴링한다', () => {
    const detail = { batch: batch(), days: [day('OK'), day('GENERATING', 2)] };

    expect(shouldPollBatch(detail)).toBe(true);
  });
});

describe('canResume', () => {
  const now = new Date('2026-10-22T10:30:00');

  it('실패한 배치는 재시작할 수 있다', () => {
    expect(canResume(batch({ status: 'FAILED' }), now)).toBe(true);
  });

  it('생성 중 배치는 마지막 갱신이 16분 이상 전일 때만 재시작할 수 있다', () => {
    const stale = batch({
      status: 'GENERATING',
      updatedAt: '2026-10-22T10:13:59',
    });
    const fresh = batch({
      status: 'GENERATING',
      updatedAt: '2026-10-22T10:14:01',
    });

    expect(canResume(stale, now)).toBe(true);
    expect(canResume(fresh, now)).toBe(false);
    expect(STALE_GENERATING_MS).toBe(16 * 60_000);
  });

  it('검수 대기 배치는 오래됐어도 재시작하지 않는다', () => {
    expect(canResume(batch({ updatedAt: '2026-10-01T00:00:00' }), now)).toBe(
      false,
    );
  });
});

describe('canApprove', () => {
  it('검수 대기 배치의 모든 Day가 OK일 때만 승인할 수 있다', () => {
    const ready = { batch: batch(), days: [day('OK'), day('OK', 2)] };
    const partial = { batch: batch(), days: [day('OK'), day('NEEDS_FIX', 2)] };
    const generating = {
      batch: batch({ status: 'GENERATING' }),
      days: [day('OK'), day('OK', 2)],
    };

    expect(canApprove(ready)).toBe(true);
    expect(canApprove(partial)).toBe(false);
    expect(canApprove(generating)).toBe(false);
  });

  it('Day가 하나도 없으면 승인할 수 없다', () => {
    expect(canApprove({ batch: batch(), days: [] })).toBe(false);
  });
});

describe('canReview · reviewBlockedReason', () => {
  it('배치가 생성 중이어도 끝난 Day는 검수할 수 있다 (BE 가드와 같다)', () => {
    expect(canReview('GENERATING', 'REVIEW_READY')).toBe(true);
    expect(canReview('REVIEW_READY', 'OK')).toBe(true);
    expect(canReview('REVIEW_READY', 'NEEDS_FIX')).toBe(true);
  });

  it('아직 만드는 중인 Day는 끝날 때까지 기다리라고 한다', () => {
    expect(canReview('GENERATING', 'GENERATING')).toBe(false);
    expect(reviewBlockedReason('GENERATING', 'GENERATING')).toBe(
      '생성이 끝나면 검수할 수 있어요',
    );
  });

  it('승인된 배치는 검수를 바꿀 수 없다고 한다', () => {
    expect(canReview('APPROVED', 'APPROVED')).toBe(false);
    expect(reviewBlockedReason('APPROVED', 'APPROVED')).toBe(
      '승인된 배치는 검수를 바꿀 수 없어요',
    );
    expect(reviewBlockedReason('REVIEW_READY', 'OK')).toBeNull();
  });
});

describe('canRegenerateDraft', () => {
  it('검수 대기 배치에서 만드는 중이 아닌 Day만 다시 만들 수 있다', () => {
    expect(canRegenerateDraft('REVIEW_READY', 'NEEDS_FIX')).toBe(true);
    expect(canRegenerateDraft('REVIEW_READY', 'FAILED')).toBe(true);
    expect(canRegenerateDraft('REVIEW_READY', 'GENERATING')).toBe(false);
    expect(canRegenerateDraft('GENERATING', 'OK')).toBe(false);
  });
});

describe('summarizeDays', () => {
  it('Day 상태를 OK·수정·생성 중·실패로 센다', () => {
    const days = [
      day('OK'),
      day('NEEDS_FIX', 2),
      day('GENERATING', 3),
      day('FAILED', 4),
      day('REVIEW_READY', 5),
    ];

    expect(summarizeDays(days)).toEqual({
      ok: 1,
      needsFix: 1,
      generating: 1,
      failed: 1,
      unreviewed: 1,
    });
  });
});
