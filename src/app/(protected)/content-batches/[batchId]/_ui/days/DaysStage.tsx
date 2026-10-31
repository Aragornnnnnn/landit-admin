'use client';

// Day 목록 화면 — 요약 카드(재시작·승인) · 안내/실패/승인 배너 · 검수 필터 칩 · Day 표 (Figma 4130:753).
// Day별 검증·검수 수는 초안 상세를 병렬로 읽어 채운다(useContentDraftsQuery) — BE 요약 필드가 오면 바꾼다
import { useRouter, useSearchParams } from 'next/navigation';

import type { ContentBatchDetail } from '@/features/content/api/content-batch';
import {
  canApprove,
  canResume,
  summarizeDays,
} from '@/features/content/model/content-actions';
import { needsRevisit } from '@/features/content/model/review-visit';
import { useContentDraftsQuery } from '@/features/content/model/useContentQuery';

import { dayRowCells, reservedIdRange } from '../../_model/day-row';
import {
  countReviewFilters,
  matchesReviewFilter,
  readReviewFilter,
  type ReviewFilter,
} from '../../_model/review-filter';
import { BatchBanners } from './BatchBanners';
import { DayFilterChips } from './DayFilterChips';
import { DaySummaryCard } from './DaySummaryCard';
import { DayTable } from './DayTable';
import { useBatchActions } from './useBatchActions';

export function DaysStage({ detail }: { detail: ContentBatchDetail }) {
  const { batch, days } = detail;
  const router = useRouter();
  const searchParams = useSearchParams();
  const drafts = useContentDraftsQuery(batch.batchId, days);
  const actions = useBatchActions(batch);

  // 로컬 기록은 렌더마다 읽어도 싸다(localStorage 키 ≤30개)
  const revisit = new Set(
    days
      .filter((day) => needsRevisit(day.draftId, day.status))
      .map((day) => day.draftId),
  );
  const counts = countReviewFilters(days, revisit);
  const filter = readReviewFilter(searchParams, counts.REVISIT);
  const changeFilter = (next: ReviewFilter) =>
    router.replace(`?filter=${next}`, { scroll: false });

  const rows = days
    .map((day, index) => ({
      day,
      cells: dayRowCells(drafts[index]?.data),
      revisit: revisit.has(day.draftId),
    }))
    .filter((row) => matchesReviewFilter(filter, row.day.status, row.revisit));

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <DaySummaryCard
        batch={batch}
        summary={summarizeDays(days)}
        canResume={canResume(batch) && !actions.pending}
        canApprove={canApprove(detail) && !actions.pending}
        onResume={() => actions.ask('resume')}
        onApprove={() => actions.ask('approve')}
      />
      <BatchBanners
        batch={batch}
        reserved={reservedIdRange(drafts.map((draft) => draft.data))}
      />
      <DayFilterChips filter={filter} counts={counts} onChange={changeFilter} />
      <DayTable batchId={batch.batchId} rows={rows} filter={filter} />
      {actions.dialogs}
    </div>
  );
}
