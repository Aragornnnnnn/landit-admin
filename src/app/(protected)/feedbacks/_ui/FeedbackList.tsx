'use client';

// 목록 본체 — 상태(로딩·오류·빈·데이터)를 가르고, 폭에 따라 표/카드만 바꾼다. 라우트는 나누지 않는다 (docs/admin-spec.md "반응형")
import type { FeedbackItem } from '@/features/feedback/api/feedback-list';
import { useIsMobile } from '@/shared/lib/use-mobile';
import { useDelayedPending } from '@/shared/lib/useDelayedPending';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import {
  hasActiveFeedbackFilter,
  type FeedbackFilter,
} from '../_model/feedback-filter';
import { FeedbackCardList } from './FeedbackCardList';
import { FeedbackTable } from './FeedbackTable';

interface FeedbackListProps {
  filter: FeedbackFilter;
  items: FeedbackItem[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onResetFilter: () => void;
  onSelect: (feedbackId: number) => void;
}

export function FeedbackList({
  filter,
  items,
  isPending,
  isError,
  onRetry,
  onResetFilter,
  onSelect,
}: FeedbackListProps) {
  const isMobile = useIsMobile();
  const showSkeleton = useDelayedPending(isPending);

  if (isPending) {
    // 200ms 안에 오면 스켈레톤을 아예 그리지 않는다 — 깜빡임 방지
    return showSkeleton ? (
      <div className="w-full rounded-[20px] bg-card p-2">
        <ListSkeleton />
      </div>
    ) : null;
  }

  if (isError) {
    return (
      <div className="w-full rounded-[20px] bg-card">
        <InlineError onRetry={onRetry} />
      </div>
    );
  }

  if (items.length === 0) {
    // 원래 없는 것과 조건 때문에 없는 것을 문구로 가른다
    return (
      <div className="w-full rounded-[20px] bg-card">
        {hasActiveFeedbackFilter(filter) ? (
          <EmptyState
            title="조건에 맞는 피드백이 없어요"
            description="검색어나 필터를 바꿔 보세요"
            action={
              <Button variant="outline" onClick={onResetFilter}>
                필터 초기화
              </Button>
            }
          />
        ) : (
          <EmptyState title="아직 받은 피드백이 없어요" />
        )}
      </div>
    );
  }

  return isMobile ? (
    <FeedbackCardList items={items} onSelect={onSelect} />
  ) : (
    <FeedbackTable items={items} onSelect={onSelect} />
  );
}
