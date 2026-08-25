'use client';

// 데스크톱 목록 — 흰 카드 안 표. 행 구분은 hover만(Figma 1050:8193에서 운영자 결정으로 변경). 유형·상태는 배경 없는 텍스트다
import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format-time';

import {
  FEEDBACK_STATUS_DOT,
  FEEDBACK_STATUS_LABEL,
  FEEDBACK_TYPE_LABEL,
} from '../_model/feedback-label';
import type { FeedbackItem } from '../_model/useFeedbackListQuery';

interface FeedbackTableProps {
  items: FeedbackItem[];
  onSelect: (feedbackId: number) => void;
}

// Figma 셀 너비 — 유형 90 / 내용 flex / 보낸 사람 220 / 상태 88 / 접수 100 / 화살표 16
const CELL = {
  type: 'w-[90px] shrink-0',
  content: 'flex-1 min-w-px',
  sender: 'w-[220px] shrink-0',
  status: 'w-[88px] shrink-0',
  receivedAt: 'w-[100px] shrink-0',
};

export function FeedbackTable({ items, onSelect }: FeedbackTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-[20px] bg-card px-1 pb-1">
      <div className="min-w-[800px]">
        <div
          role="row"
          className="flex w-full items-center gap-4 px-5 pt-3 pb-2 text-xs font-medium text-subtle"
        >
          <span className={CELL.type}>유형</span>
          <span className={CELL.content}>내용</span>
          <span className={CELL.sender}>보낸 사람</span>
          <span className={CELL.status}>상태</span>
          <span className={CELL.receivedAt}>접수</span>
        </div>

        <div className="flex flex-col gap-0.5">
          {items.map((item) => (
            <button
              key={item.feedbackId}
              type="button"
              onClick={() => item.feedbackId && onSelect(item.feedbackId)}
              className="flex w-full items-center gap-4 rounded-lg px-5 py-3 text-left transition-colors hover:bg-hairline"
            >
              <span
                className={cn(
                  CELL.type,
                  'text-[13px] font-medium text-chip-foreground',
                )}
              >
                {item.type ? FEEDBACK_TYPE_LABEL[item.type] : ''}
              </span>
              <span
                className={cn(CELL.content, 'truncate text-[13px] text-strong')}
              >
                {item.content}
              </span>
              <span
                className={cn(CELL.sender, 'truncate text-[13px] text-subtle')}
              >
                {item.nickname} · {item.email}
              </span>
              <span className={cn(CELL.status, 'flex items-center gap-[5px]')}>
                {item.status && (
                  <>
                    <span
                      aria-hidden
                      className={cn(
                        'size-1.5 rounded-full',
                        FEEDBACK_STATUS_DOT[item.status] === 'progress'
                          ? 'bg-primary'
                          : 'bg-success',
                      )}
                    />
                    <span className="text-[13px] font-medium text-chip-foreground">
                      {FEEDBACK_STATUS_LABEL[item.status]}
                    </span>
                  </>
                )}
              </span>
              <span className={cn(CELL.receivedAt, 'text-[13px] text-subtle')}>
                {item.createdAt ? formatDateTime(item.createdAt) : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
