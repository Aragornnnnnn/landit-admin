'use client';

// Day 표 — Day · 제목 · 상태 · 검증기(FAIL/WARN) · AI 검수 · 코멘트. 행 전체가 Day 상세 링크 (Figma 4130:753 · admin-spec "목록 행 다듬기")
import Link from 'next/link';

import type { ContentDaySummary } from '@/features/content/api/content-batch';
import {
  DRAFT_STATUS_DOT,
  DRAFT_STATUS_LABEL,
} from '@/features/content/model/content-label';
import { cn } from '@/shared/lib/cn';
import { EmptyState } from '@/shared/ui/EmptyState';
import { StatusChip } from '@/shared/ui/StatusChip';

import type { DayRowCells } from '../../_model/day-row';
import {
  REVIEW_FILTER_LABEL,
  type ReviewFilter,
} from '../../_model/review-filter';

// Figma 셀 너비 — Day 60 / 제목 flex / 상태 110 / 검증기 150 / AI 검수 90 / 코멘트 110. 갱신 열은 API에 시각이 없어 뺐다
const CELL = {
  day: 'w-[60px] shrink-0',
  title: 'flex-1 min-w-px',
  status: 'w-[110px] shrink-0',
  validation: 'w-[150px] shrink-0',
  review: 'w-[90px] shrink-0',
  comments: 'w-[110px] shrink-0',
};

export interface DayRow {
  day: ContentDaySummary;
  /** 초안을 아직 못 읽었으면 null → `…` */
  cells: DayRowCells | null;
  revisit: boolean;
}

interface DayTableProps {
  batchId: number;
  rows: DayRow[];
  filter: ReviewFilter;
}

export function DayTable({ batchId, rows, filter }: DayTableProps) {
  if (rows.length === 0) {
    return (
      <EmptyState
        className="rounded-[20px] bg-card"
        title={`${REVIEW_FILTER_LABEL[filter]}에 해당하는 Day가 없어요`}
      />
    );
  }
  return (
    <section className="w-full rounded-[20px] bg-card pt-2 pb-1">
      <div className="px-1">
        <div
          role="row"
          className="flex w-full items-center gap-4 px-5 pt-3 pb-2 text-xs font-medium text-subtle"
        >
          <span className={CELL.day}>Day</span>
          <span className={CELL.title}>제목</span>
          <span className={CELL.status}>상태</span>
          <span className={CELL.validation}>검증기</span>
          <span className={CELL.review}>AI 검수</span>
          <span className={CELL.comments}>코멘트</span>
        </div>
        <div className="flex flex-col gap-0.5">
          {rows.map(({ day, cells, revisit }) => {
            const waiting =
              day.status === 'GENERATING' || day.status === 'LINEUP';
            return (
              <Link
                key={day.draftId}
                href={`/content-batches/${batchId}/drafts/${day.draftId}`}
                className="flex w-full items-center gap-4 rounded-lg px-5 py-3 transition-colors hover:bg-hairline"
              >
                <span
                  className={cn(
                    CELL.day,
                    'text-[14px] font-medium text-strong',
                  )}
                >
                  {day.plannedDay ?? '—'}
                </span>
                <span className={cn(CELL.title, 'min-w-px')}>
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[14px] text-strong">
                      {day.title ?? '—'}
                    </span>
                    {revisit && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                        다시 볼 것
                      </span>
                    )}
                  </span>
                  {day.errorMessage && (
                    <span className="block truncate text-[12px] text-destructive">
                      {day.errorMessage}
                    </span>
                  )}
                </span>
                <span className={CELL.status}>
                  <StatusChip
                    dot={DRAFT_STATUS_DOT[day.status]}
                    className={cn(
                      day.status === 'FAILED' && 'text-destructive',
                    )}
                  >
                    {DRAFT_STATUS_LABEL[day.status]}
                  </StatusChip>
                </span>
                <span className={cn(CELL.validation, 'text-[13px]')}>
                  <ValidationCell cells={cells} waiting={waiting} />
                </span>
                <span className={cn(CELL.review, 'text-[13px] text-body')}>
                  {waiting
                    ? '—'
                    : !cells
                      ? '…'
                      : cells.reviewed
                        ? `${cells.defects}건`
                        : '—'}
                </span>
                <span className={cn(CELL.comments, 'text-[13px]')}>
                  <CommentCell cells={cells} waiting={waiting} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ValidationCell({
  cells,
  waiting,
}: {
  cells: DayRowCells | null;
  waiting: boolean;
}) {
  if (waiting) return <span className="text-subtle">—</span>;
  if (!cells) return <span className="text-subtle">…</span>;
  if (!cells.validated) return <span className="text-subtle">검증 전</span>;
  return (
    <span
      className={cells.fail > 0 ? 'font-medium text-destructive' : 'text-body'}
    >
      FAIL {cells.fail} · WARN {cells.warn}
      {cells.unchecked > 0 && (
        <span className="text-subtle"> · 검사 불가 {cells.unchecked}</span>
      )}
    </span>
  );
}

function CommentCell({
  cells,
  waiting,
}: {
  cells: DayRowCells | null;
  waiting: boolean;
}) {
  if (waiting) return <span className="text-subtle">—</span>;
  if (!cells) return <span className="text-subtle">…</span>;
  if (cells.openFix > 0)
    return (
      <span className="font-medium text-primary">FIX {cells.openFix}</span>
    );
  if (cells.resolvedFix > 0)
    return <span className="text-body">해결 {cells.resolvedFix}</span>;
  return <span className="text-subtle">—</span>;
}
