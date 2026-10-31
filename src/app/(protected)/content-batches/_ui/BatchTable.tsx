'use client';

// 배치 표 — 흰 카드, 행 구분은 hover만, 행 전체가 상세 링크 (Figma 4128:716 · admin-spec "목록 행 다듬기")
import Link from 'next/link';

import type { ContentBatch } from '@/features/content/api/content-batch';
import {
  BATCH_STATUS_DOT,
  BATCH_STATUS_LABEL,
  batchRemark,
  formatCharacterRatio,
} from '@/features/content/model/content-label';
import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format-time';
import { StatusChip } from '@/shared/ui/StatusChip';

// Figma 셀 너비를 1160 콘텐츠 폭에 맞춰 줄였다 — 배치 60 / Day 100 / 상태 120 / 비율 flex(≥190) / 요청자 70 / 접수·갱신 100 / 비고 170
const CELL = {
  id: 'w-[60px] shrink-0',
  days: 'w-[100px] shrink-0',
  status: 'w-[120px] shrink-0',
  ratio: 'flex-1 min-w-px',
  requestedBy: 'w-[70px] shrink-0',
  createdAt: 'w-[100px] shrink-0',
  updatedAt: 'w-[100px] shrink-0',
  remark: 'w-[170px] shrink-0',
};

interface BatchTableProps {
  items: ContentBatch[];
  totalCount: number;
}

export function BatchTable({ items, totalCount }: BatchTableProps) {
  return (
    <section className="w-full rounded-[20px] bg-card pt-5 pb-1">
      <header className="flex items-baseline gap-2 px-5">
        <h2 className="text-[16px] font-bold text-strong">배치</h2>
        <span className="text-[13px] text-subtle">{totalCount}</span>
      </header>
      <div className="w-full overflow-x-auto px-1">
        <div className="min-w-[1000px]">
          <div
            role="row"
            className="flex w-full items-center gap-4 px-5 pt-3 pb-2 text-xs font-medium text-subtle"
          >
            <span className={CELL.id}>배치</span>
            <span className={CELL.days}>Day</span>
            <span className={CELL.status}>상태</span>
            <span className={CELL.ratio}>캐릭터 비율</span>
            <span className={CELL.requestedBy}>요청자</span>
            <span className={CELL.createdAt}>접수</span>
            <span className={CELL.updatedAt}>마지막 갱신</span>
            <span className={CELL.remark}>사유 / 비고</span>
          </div>

          <div className="flex flex-col gap-0.5">
            {items.map((batch) => (
              <Link
                key={batch.batchId}
                href={`/content-batches/${batch.batchId}`}
                className="flex w-full items-center gap-4 rounded-lg px-5 py-3 transition-colors hover:bg-hairline"
              >
                <span className={cn(CELL.id, 'text-[13px] text-subtle')}>
                  #{batch.batchId}
                </span>
                <span
                  className={cn(
                    CELL.days,
                    'text-[14px] font-medium text-strong',
                  )}
                >
                  {batch.startDay}~{batch.endDay}
                </span>
                <span className={CELL.status}>
                  <StatusChip
                    dot={BATCH_STATUS_DOT[batch.status]}
                    className={cn(
                      batch.status === 'FAILED' && 'text-destructive',
                    )}
                  >
                    {BATCH_STATUS_LABEL[batch.status]}
                  </StatusChip>
                </span>
                <span
                  className={cn(CELL.ratio, 'truncate text-[13px] text-body')}
                >
                  {formatCharacterRatio(batch.characterRatio)}
                </span>
                <span className={cn(CELL.requestedBy, 'text-[13px] text-body')}>
                  #{batch.requestedBy}
                </span>
                <span className={cn(CELL.createdAt, 'text-[13px] text-subtle')}>
                  {formatDateTime(batch.createdAt)}
                </span>
                <span className={cn(CELL.updatedAt, 'text-[13px] text-subtle')}>
                  {formatDateTime(batch.updatedAt)}
                </span>
                <span
                  className={cn(
                    CELL.remark,
                    'line-clamp-2 text-[12px] leading-[1.4]',
                    batch.status === 'FAILED'
                      ? 'text-destructive'
                      : 'text-body',
                  )}
                >
                  {batchRemark(batch)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
