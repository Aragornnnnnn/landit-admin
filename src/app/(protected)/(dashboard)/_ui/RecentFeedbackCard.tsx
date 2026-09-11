'use client';

// 최근 피드백 — 대시보드에서 바로 답장으로 들어가는 통로 (Figma 1050:7662 하단).
// 좁은 화면에선 열이 다 들어가지 않아 프레임처럼 두 줄 카드로 바뀐다 (1050:7905)
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import type { FeedbackItem } from '@/features/feedback/api/feedback-list';
import {
  FEEDBACK_STATUS_DOT,
  FEEDBACK_STATUS_LABEL,
  FEEDBACK_TYPE_LABEL,
} from '@/features/feedback/model/feedback-label';
import { feedbackOpenPath } from '@/features/feedback/model/feedback-open-path';
import { cn } from '@/shared/lib/cn';
import { formatRelativeTime } from '@/shared/lib/format-time';
import { useIsMobile } from '@/shared/lib/use-mobile';
import { InlineError } from '@/shared/ui/InlineError';

const RECENT_COUNT = 5;

export function RecentFeedbackCard({
  items,
  error = false,
  onRetry,
}: {
  items: FeedbackItem[];
  /** 조회 실패 — 카드 자리는 유지하고 안에서만 알린다 */
  error?: boolean;
  onRetry?: () => void;
}) {
  const isMobile = useIsMobile();
  const shown = items.slice(0, isMobile ? 3 : RECENT_COUNT);

  return (
    <section className="w-full rounded-[20px] bg-card px-4 py-5 md:px-6">
      <header className="flex items-baseline justify-between px-2">
        <h2 className="text-[17px] font-bold text-foreground">최근 피드백</h2>
        <Link
          href="/feedbacks"
          className="text-[12px] text-subtle hover:text-body"
        >
          피드백 ›
        </Link>
      </header>

      {error ? (
        <InlineError
          message="피드백을 불러오지 못했어요"
          onRetry={onRetry}
          className="py-8"
        />
      ) : shown.length === 0 ? (
        <p className="py-8 text-center text-[14px] text-subtle">
          아직 받은 피드백이 없어요
        </p>
      ) : isMobile ? (
        <ul className="flex flex-col pt-2">
          {shown.map((item) => (
            <li
              key={item.feedbackId}
              className="border-t border-hairline first:border-t-0"
            >
              <Link
                href={feedbackOpenPath(item)}
                className="flex flex-col gap-1 px-2 py-3"
              >
                <span className="flex items-center gap-2 text-[12px] text-subtle">
                  {item.type ? FEEDBACK_TYPE_LABEL[item.type] : ''}
                  <span className="ml-auto">
                    {item.createdAt ? formatRelativeTime(item.createdAt) : ''}
                  </span>
                  <ChevronRight className="size-4" aria-hidden />
                </span>
                <span className="text-[15px] font-medium text-strong">
                  {item.content}
                </span>
                <span className="text-[13px] text-subtle">{item.nickname}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-x-auto pt-2">
          <div className="min-w-[760px]">
            <div
              role="row"
              className="flex items-center gap-4 px-3 pb-2 text-xs font-medium text-subtle"
            >
              <span className="w-[90px] shrink-0">유형</span>
              <span className="min-w-px flex-1">내용</span>
              <span className="w-[200px] shrink-0">보낸 사람</span>
              <span className="w-[90px] shrink-0">상태</span>
              <span className="w-20 shrink-0">접수</span>
            </div>
            {shown.map((item) => (
              <Link
                key={item.feedbackId}
                href={feedbackOpenPath(item)}
                className="flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-hairline"
              >
                <span className="w-[90px] shrink-0 text-[13px] font-medium text-chip-foreground">
                  {item.type ? FEEDBACK_TYPE_LABEL[item.type] : ''}
                </span>
                <span className="min-w-px flex-1 truncate text-[13px] text-strong">
                  {item.content}
                </span>
                <span className="w-[200px] shrink-0 truncate text-[13px] text-subtle">
                  {item.nickname} · {item.email}
                </span>
                <span className="flex w-[90px] shrink-0 items-center gap-[5px] text-[13px] text-body">
                  {item.status && (
                    <>
                      <span
                        aria-hidden
                        className={cn(
                          'size-1.5 rounded-full',
                          FEEDBACK_STATUS_DOT[item.status] === 'done'
                            ? 'bg-success'
                            : 'bg-primary',
                        )}
                      />
                      {FEEDBACK_STATUS_LABEL[item.status]}
                    </>
                  )}
                </span>
                <span className="w-20 shrink-0 text-[13px] text-subtle">
                  {item.createdAt ? formatRelativeTime(item.createdAt) : ''}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
