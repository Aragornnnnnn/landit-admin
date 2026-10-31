import { describe, expect, it } from 'vitest';

import type { ContentBatch, ContentBatchDetail } from '../api/content-batch';
import {
  canApprove,
  canRegenerateDraft,
  canResume,
  canReview,
  reviewBlockedReason,
  shouldPollBatch,
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
  const detail = (
    over: Partial<ContentBatch>,
    days: ContentBatchDetail['days'] = [],
  ): ContentBatchDetail => ({ batch: batch(over), days });

  it('실패한 배치는 재시작할 수 있다', () => {
    expect(canResume(detail({ status: 'FAILED' }, [day('FAILED')]), now)).toBe(
      true,
    );
  });

  it('모든 Day가 이미 승인된 실패 배치(에셋 단계 실패)는 재시작하지 않는다 — BE가 409를 낸다', () => {
    const assetsFailed = detail({ status: 'FAILED' }, [
      day('APPROVED'),
      day('APPROVED', 2),
    ]);

    expect(canResume(assetsFailed, now)).toBe(false);
  });

  it.each([
    ['16분 이상 전이면 재시작할 수 있다', '2026-10-22T10:13:59', true],
    ['16분이 안 됐으면 재시작하지 않는다', '2026-10-22T10:14:01', false],
  ])('생성 중 배치는 마지막 갱신이 %s', (_name, updatedAt, expected) => {
    expect(canResume(detail({ status: 'GENERATING', updatedAt }), now)).toBe(
      expected,
    );
  });

  it('검수 대기 배치는 오래됐어도 재시작하지 않는다', () => {
    expect(canResume(detail({ updatedAt: '2026-10-01T00:00:00' }), now)).toBe(
      false,
    );
  });
});

describe('canApprove', () => {
  const ok = [day('OK'), day('OK', 2)];

  it('검수 대기 배치의 모든 Day가 OK면 승인할 수 있다', () => {
    expect(canApprove({ batch: batch(), days: ok })).toBe(true);
  });

  it.each([
    ['수정할 Day가 남았으면', batch(), [day('OK'), day('NEEDS_FIX', 2)]],
    ['배치가 아직 생성 중이면', batch({ status: 'GENERATING' }), ok],
    ['Day가 하나도 없으면', batch(), []],
  ] as const)('%s 승인할 수 없다', (_name, target, days) => {
    expect(canApprove({ batch: target, days: [...days] })).toBe(false);
  });
});

describe('canReview · reviewBlockedReason', () => {
  it.each([
    ['GENERATING', 'REVIEW_READY'],
    ['REVIEW_READY', 'OK'],
    ['REVIEW_READY', 'NEEDS_FIX'],
  ] as const)(
    '배치 %s · Day %s면 검수할 수 있다 (배치가 다른 Day를 만드는 중이어도 — BE 가드와 같다)',
    (batchStatus, draftStatus) => {
      expect(canReview(batchStatus, draftStatus)).toBe(true);
      expect(reviewBlockedReason(batchStatus, draftStatus)).toBeNull();
    },
  );

  it.each([
    ['GENERATING', 'GENERATING', '생성이 끝나면 검수할 수 있어요'],
    ['REVIEW_READY', 'FAILED', '실패한 Day는 다시 만든 뒤 검수해요'],
    ['FAILED', 'OK', '배치를 재시작한 뒤 검수할 수 있어요'],
    ['APPROVED', 'APPROVED', '승인된 배치는 검수를 바꿀 수 없어요'],
  ] as const)(
    '배치 %s · Day %s면 검수할 수 없고 이유는 "%s"',
    (batchStatus, draftStatus, reason) => {
      expect(canReview(batchStatus, draftStatus)).toBe(false);
      expect(reviewBlockedReason(batchStatus, draftStatus)).toBe(reason);
    },
  );
});

describe('canRegenerateDraft', () => {
  it.each([
    ['REVIEW_READY', 'NEEDS_FIX', true],
    ['REVIEW_READY', 'FAILED', true],
    ['REVIEW_READY', 'GENERATING', false],
    ['GENERATING', 'OK', false],
  ] as const)(
    '배치 %s · Day %s면 다시 만들 수 있는가: %s (검수 대기 배치에서 만드는 중이 아닌 Day만)',
    (batchStatus, draftStatus, expected) => {
      expect(canRegenerateDraft(batchStatus, draftStatus)).toBe(expected);
    },
  );
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
