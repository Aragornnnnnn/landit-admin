'use client';

// 모바일 목록 — 흰 그룹 카드 안에 행이 구분선으로 이어진다 (Figma 1050:9276).
// 처리중 행에는 상태 칩이 없고 처리완료에만 붙는다 — 할 일이 기본이라 굳이 말하지 않는다
import { ChevronRight } from 'lucide-react';

import { formatRelativeTime } from '@/shared/lib/format-time';
import { StatusChip } from '@/shared/ui/StatusChip';

import {
  FEEDBACK_STATUS_DOT,
  FEEDBACK_STATUS_LABEL,
  FEEDBACK_TYPE_LABEL,
} from '../_model/feedback-label';
import type { FeedbackItem } from '../_model/useFeedbackListQuery';

interface FeedbackCardListProps {
  items: FeedbackItem[];
  onSelect: (feedbackId: number) => void;
}

export function FeedbackCardList({ items, onSelect }: FeedbackCardListProps) {
  return (
    <ul className="w-full overflow-hidden rounded-[18px] bg-card">
      {items.map((item, index) => (
        <li
          key={item.feedbackId}
          className={index > 0 ? 'border-t border-hairline' : ''}
        >
          <button
            type="button"
            onClick={() => item.feedbackId && onSelect(item.feedbackId)}
            className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
          >
            <span className="flex flex-1 flex-col gap-1">
              <span className="flex items-center gap-1.5">
                <span className="text-[13px] font-medium text-chip-foreground">
                  {item.type ? FEEDBACK_TYPE_LABEL[item.type] : ''}
                </span>
                {item.status === 'COMPLETED' && (
                  <StatusChip dot={FEEDBACK_STATUS_DOT.COMPLETED}>
                    {FEEDBACK_STATUS_LABEL.COMPLETED}
                  </StatusChip>
                )}
                <span className="ml-auto text-xs text-subtle">
                  {item.createdAt ? formatRelativeTime(item.createdAt) : ''}
                </span>
              </span>
              <span className="text-[15px] leading-relaxed text-strong">
                {item.content}
              </span>
              <span className="text-[13px] text-subtle">{item.nickname}</span>
            </span>
            <ChevronRight
              className="mt-1 size-4 shrink-0 text-subtle"
              aria-hidden
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
