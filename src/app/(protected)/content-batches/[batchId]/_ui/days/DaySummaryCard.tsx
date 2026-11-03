'use client';

// 배치 요약 카드(Day 단계) — Day 범위·칩 · OK/수정/생성 중/실패 수 · 접수 + [재시작 · 승인] (Figma 4130:753)
import type { ContentBatch } from '@/features/content/api/content-batch';
import type { DaySummary } from '@/features/content/model/content-actions';
import {
  BATCH_STATUS_DOT,
  BATCH_STATUS_LABEL,
} from '@/features/content/model/content-label';
import { formatDateTime } from '@/shared/lib/format-time';
import { Button } from '@/shared/ui/shadcn/button';
import { StatusChip } from '@/shared/ui/StatusChip';

interface DaySummaryCardProps {
  batch: ContentBatch;
  summary: DaySummary;
  canResume: boolean;
  canApprove: boolean;
  onResume: () => void;
  onApprove: () => void;
}

export function DaySummaryCard({
  batch,
  summary,
  canResume,
  canApprove,
  onResume,
  onApprove,
}: DaySummaryCardProps) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-[20px] bg-card px-6 py-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[18px] font-bold text-strong">
            Day {batch.startDay} ~ {batch.endDay} · {batch.dayCount}개
          </h2>
          <StatusChip dot={BATCH_STATUS_DOT[batch.status]}>
            {BATCH_STATUS_LABEL[batch.status]}
          </StatusChip>
        </div>
        <p className="text-[13px] text-subtle">
          OK {summary.ok} · NEEDS_FIX {summary.needsFix} · 생성 중{' '}
          {summary.generating} · 실패 {summary.failed} · 접수 #
          {batch.requestedBy} {formatDateTime(batch.createdAt)}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          disabled={!canResume}
          onClick={onResume}
          className="h-10 px-4 text-[14px]"
        >
          재시작
        </Button>
        <Button
          disabled={!canApprove}
          onClick={onApprove}
          className="h-10 px-4 text-[14px]"
        >
          승인 — 표현 id 예약
        </Button>
      </div>
    </section>
  );
}
