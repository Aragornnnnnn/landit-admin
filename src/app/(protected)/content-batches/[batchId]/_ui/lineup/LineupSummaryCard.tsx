'use client';

// 배치 요약 카드 — Day 범위·상태 칩·비율·접수·메모 + [라인업 재생성 · 진행] (Figma 4129:939)
import type { ContentBatch } from '@/features/content/api/content-batch';
import {
  BATCH_STATUS_DOT,
  BATCH_STATUS_LABEL,
  formatCharacterRatio,
} from '@/features/content/model/content-label';
import { formatDateTime } from '@/shared/lib/format-time';
import { Button } from '@/shared/ui/shadcn/button';
import { StatusChip } from '@/shared/ui/StatusChip';

interface LineupSummaryCardProps {
  batch: ContentBatch;
  /** LINEUP_READY이고 저장 안 한 변경이 없을 때만 */
  canAct: boolean;
  dirty: boolean;
  onRegenerate: () => void;
  onProceed: () => void;
}

export function LineupSummaryCard({
  batch,
  canAct,
  dirty,
  onRegenerate,
  onProceed,
}: LineupSummaryCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-card px-6 py-5">
      <div className="flex flex-wrap items-center gap-3">
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
            {formatCharacterRatio(batch.characterRatio)} · 접수 #
            {batch.requestedBy} {formatDateTime(batch.createdAt)}
            {batch.note && ` · 메모: ${batch.note}`}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            disabled={!canAct}
            onClick={onRegenerate}
            className="h-10 px-4 text-[14px]"
          >
            라인업 재생성
          </Button>
          <Button
            disabled={!canAct}
            onClick={onProceed}
            className="h-10 px-4 text-[14px]"
          >
            진행 — Day 생성 시작
          </Button>
        </div>
      </div>
      {dirty && (
        <p className="text-[12px] text-subtle">
          저장하지 않은 수정이 있어요 — 먼저 저장해야 재생성·진행할 수 있어요
        </p>
      )}
      {batch.errorMessage && (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 text-[13px] text-destructive"
        >
          {batch.errorMessage}
        </p>
      )}
    </section>
  );
}
