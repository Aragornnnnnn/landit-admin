'use client';

// 목록 본체 — 상태(로딩·오류·빈·데이터)를 가르고, 폭에 따라 표/카드만 바꾼다. 라우트는 나누지 않는다 (docs/admin-spec.md "반응형")
import { useState } from 'react';

import type { FeedbackItem } from '@/features/feedback/api/feedback-list';
import { useIsMobile } from '@/shared/lib/use-mobile';
import { useDelayedPending } from '@/shared/lib/useDelayedPending';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Button } from '@/shared/ui/shadcn/button';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';

import {
  hasActiveFeedbackFilter,
  type FeedbackFilter,
} from '../../_model/list/feedback-filter';
import { useHideFeedbacksMutation } from '../../_model/list/useHideFeedbacksMutation';
import { FeedbackCardList } from './FeedbackCardList';
import { FeedbackTable } from './FeedbackTable';

interface FeedbackListProps {
  filter: FeedbackFilter;
  items: FeedbackItem[];
  isPending: boolean;
  isError: boolean;
  isPlaceholderData?: boolean;
  onRetry: () => void;
  onResetFilter: () => void;
  onSelect: (feedbackId: number) => void;
}

export function FeedbackList({
  filter,
  items,
  isPending,
  isError,
  isPlaceholderData = false,
  onRetry,
  onResetFilter,
  onSelect,
}: FeedbackListProps) {
  const isMobile = useIsMobile();
  const showSkeleton = useDelayedPending(isPending);

  const [selection, setSelection] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const hide = useHideFeedbacksMutation();
  const selectableIds = items.flatMap(({ feedbackId, status }) =>
    feedbackId !== undefined && status === 'PENDING' ? [feedbackId] : [],
  );
  const selectedIds = selectableIds.filter((id) => selection.includes(id));
  const allSelected = selectedIds.length === selectableIds.length;
  const selectionDisabled = isPlaceholderData || hide.isPending;

  const renderSelection = (item: FeedbackItem) => {
    const id = item.feedbackId;
    if (id === undefined || item.status !== 'PENDING') return null;

    return (
      <Checkbox
        aria-label={`${item.content?.slice(0, 40) || `피드백 ${id}`} 선택`}
        checked={selectedIds.includes(id)}
        disabled={selectionDisabled}
        onCheckedChange={(checked) =>
          setSelection(
            checked === true
              ? [...selectedIds, id]
              : selectedIds.filter((selectedId) => selectedId !== id),
          )
        }
      />
    );
  };

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

  const hasSelectableItems = selectableIds.length > 0;
  const listProps = {
    items,
    onSelect,
    renderSelection: hasSelectableItems ? renderSelection : undefined,
  };

  return (
    <div className="flex flex-col gap-2">
      {hasSelectableItems && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={selectionDisabled}
            onClick={() => setSelection(allSelected ? [] : selectableIds)}
          >
            {allSelected ? '전체 선택 해제' : '현재 페이지 전체 선택'}
          </Button>
          <span aria-live="polite" className="text-sm text-subtle">
            {selectedIds.length > 0 && `${selectedIds.length}건 선택`}
          </span>
          {selectedIds.length > 0 && (
            <Button
              size="sm"
              variant="secondary"
              disabled={selectionDisabled}
              onClick={() => setConfirmOpen(true)}
            >
              어드민에서 숨기기
            </Button>
          )}
        </div>
      )}

      {isMobile ? (
        <FeedbackCardList {...listProps} />
      ) : (
        <FeedbackTable {...listProps} />
      )}

      <ActionConfirmDialog
        open={confirmOpen && hasSelectableItems}
        title="어드민에서 피드백을 숨길까요?"
        pending={hide.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (selectionDisabled || selectedIds.length === 0) return;
          hide.mutate(selectedIds, {
            onSuccess: (failedIds) => {
              setSelection(failedIds);
              setConfirmOpen(false);
            },
          });
        }}
      >
        <p>
          피드백 {selectedIds.length}건을 어드민 목록과 상세에서 숨겨요. 사용자
          편지함은 그대로예요.
        </p>
      </ActionConfirmDialog>
    </div>
  );
}
