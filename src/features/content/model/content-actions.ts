// 배치·Day 상태로 지금 할 수 있는 일을 정한다 — BE 상태 가드(409)와 같은 규칙을 화면이 먼저 적용해 버튼을 잠근다 (docs/screens/content-batches.md "화면 구성")
import type {
  ContentBatch,
  ContentBatchDetail,
  ContentBatchStatus,
  ContentDaySummary,
  ContentDraftStatus,
} from '../api/content-batch';

/** 서버가 일하는 중인 배치 상태 — 이 동안 10초 폴링 */
const GENERATING_BATCH: ContentBatchStatus[] = [
  'REQUESTED',
  'LINEUP_GENERATING',
  'GENERATING',
];

/** 라인업 단계(확인 1) — 행 편집·코멘트 재생성·진행이 가능한 유일한 상태 */
export const isLineupStage = (status: ContentBatchStatus) =>
  status === 'REQUESTED' ||
  status === 'LINEUP_GENERATING' ||
  status === 'LINEUP_READY';

export const isBatchGenerating = (status: ContentBatchStatus) =>
  GENERATING_BATCH.includes(status);

export const canEditLineup = (status: ContentBatchStatus) =>
  status === 'LINEUP_READY';

/** 목록에 생성 중 배치가 하나라도 있으면 목록도 폴링한다 */
export const shouldPollBatchList = (batches: ContentBatch[]) =>
  batches.some((batch) => isBatchGenerating(batch.status));

/** 배치가 일하는 중이거나, 검수 중 다시 만드는 Day가 있으면 폴링 */
export function shouldPollBatch(detail: ContentBatchDetail | undefined) {
  if (!detail) return false;
  return (
    isBatchGenerating(detail.batch.status) ||
    detail.days.some((day) => day.status === 'GENERATING')
  );
}

/** 요청 제한 5분 × 3회 + 60초 — BE ContentGenerationRecoveryService의 heartbeat 기준과 같은 값이어야 한다 */
export const STALE_GENERATING_MS = 16 * 60_000;

/**
 * 실패했거나, 생성 중인데 heartbeat(updatedAt)가 멈춘 지 오래면 재시작할 수 있다.
 * 모든 Day가 이미 APPROVED인 FAILED는 에셋 단계 실패라 BE가 409를 낸다 — 버튼도 잠근다.
 * now는 호출부가 넘긴다(폴링 시각) — 렌더 시각을 쓰면 같은 응답이 올 때 16분이 지나도 안 바뀐다
 */
export function canResume({ batch, days }: ContentBatchDetail, now: Date) {
  if (batch.status === 'FAILED')
    return !(days.length > 0 && days.every((day) => day.status === 'APPROVED'));
  if (batch.status !== 'GENERATING') return false;
  const updatedAt = new Date(batch.updatedAt).getTime();
  return (
    Number.isFinite(updatedAt) &&
    now.getTime() - updatedAt >= STALE_GENERATING_MS
  );
}

/** 검수 대기 배치의 모든 Day가 OK — 하나라도 다른 상태면 BE가 409를 낸다 */
export function canApprove(detail: ContentBatchDetail | undefined) {
  if (!detail || detail.batch.status !== 'REVIEW_READY') return false;
  return (
    detail.days.length > 0 && detail.days.every((day) => day.status === 'OK')
  );
}

const REVIEWABLE_DRAFT: ContentDraftStatus[] = [
  'REVIEW_READY',
  'NEEDS_FIX',
  'OK',
];

/** 배치가 아직 다른 Day를 만드는 중이어도 끝난 Day는 검수할 수 있다 (BE ContentDraftReviewService와 같다) */
export function canReview(
  batchStatus: ContentBatchStatus,
  draftStatus: ContentDraftStatus,
) {
  return (
    (batchStatus === 'GENERATING' || batchStatus === 'REVIEW_READY') &&
    REVIEWABLE_DRAFT.includes(draftStatus)
  );
}

/** 검수 버튼이 잠긴 이유 — 할 수 있으면 null */
export function reviewBlockedReason(
  batchStatus: ContentBatchStatus,
  draftStatus: ContentDraftStatus,
): string | null {
  if (canReview(batchStatus, draftStatus)) return null;
  if (draftStatus === 'GENERATING' || isLineupStage(batchStatus))
    return '생성이 끝나면 검수할 수 있어요';
  if (draftStatus === 'FAILED') return '실패한 Day는 다시 만든 뒤 검수해요';
  if (batchStatus === 'FAILED') return '배치를 재시작한 뒤 검수할 수 있어요';
  return '승인된 배치는 검수를 바꿀 수 없어요';
}

/** 재생성은 배치가 검수 대기일 때만 — 생성 중 배치는 큐가 바쁘고, 승인 뒤엔 id가 예약돼 있다 */
export const canRegenerateDraft = (
  batchStatus: ContentBatchStatus,
  draftStatus: ContentDraftStatus,
) => batchStatus === 'REVIEW_READY' && draftStatus !== 'GENERATING';

export interface DaySummary {
  ok: number;
  needsFix: number;
  generating: number;
  failed: number;
  unreviewed: number;
}

/** 요약 카드·필터 칩의 수 — OK엔 승인·발행도 포함한다(검수가 끝난 Day) */
export function summarizeDays(days: ContentDaySummary[]): DaySummary {
  const count = (...statuses: ContentDraftStatus[]) =>
    days.filter((day) => statuses.includes(day.status)).length;
  return {
    ok: count('OK', 'APPROVED', 'PUBLISHED'),
    needsFix: count('NEEDS_FIX'),
    generating: count('GENERATING', 'LINEUP'),
    failed: count('FAILED'),
    unreviewed: count('REVIEW_READY'),
  };
}
