'use client';

// 피드백 목록 화면 조립 — 필터 줄 · 목록 · 페이지네이션 (docs/screens/feedbacks.md)
import { useRouter, useSearchParams } from 'next/navigation';

import { FEEDBACK_PAGE_SIZE } from '../_model/feedback-filter';
import { useFeedbackFilterParams } from '../_model/useFeedbackFilterParams';
import { useFeedbackListQuery } from '../_model/useFeedbackListQuery';
import { usePendingFeedbackCountQuery } from '../../_model/usePendingFeedbackCountQuery';
import { FeedbackFilters } from './FeedbackFilters';
import { FeedbackList } from './FeedbackList';
import { FeedbackPagination } from './FeedbackPagination';
import { FeedbackReplySheet } from './FeedbackReplySheet';

/** Figma: "처리중 12건 · 전체 128건". 조건 때문에 결과가 없으면 "0건"만 (docs/screens/feedbacks.md) */
function countLabelOf(totalElements: number, pending: number | undefined) {
  if (totalElements === 0) return '0건';
  if (pending === undefined) return `전체 ${totalElements}건`;
  return `처리중 ${pending}건 · 전체 ${totalElements}건`;
}

export function FeedbackListPage() {
  const router = useRouter();
  const { filter, keywordDraft, setKeywordDraft, change, reset } =
    useFeedbackFilterParams();
  const searchParams = useSearchParams();
  const feedbacks = useFeedbackListQuery(filter);
  // 처리중 수는 사이드바 배지가 이미 쓰는 쿼리다 — 같은 키라 요청이 한 번만 나간다
  const pendingCount = usePendingFeedbackCountQuery();

  const page = feedbacks.data;
  const totalElements = page?.totalElements ?? 0;
  const items = page?.items ?? [];

  // 열린 상세는 주소가 진실이다 — 새로고침·뒤로가기로 열고 닫힌다
  const openId = Number(searchParams.get('open'));
  const openFeedback = items.find((item) => item.feedbackId === openId);

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <FeedbackFilters
        filter={filter}
        keywordDraft={keywordDraft}
        countLabel={
          feedbacks.isSuccess
            ? countLabelOf(totalElements, pendingCount.data)
            : undefined
        }
        onChangeKeyword={setKeywordDraft}
        onChange={change}
      />

      <FeedbackList
        filter={filter}
        items={items}
        isPending={feedbacks.isPending}
        isError={feedbacks.isError}
        onRetry={() => feedbacks.refetch()}
        onResetFilter={reset}
        // 상세 시트는 다음 PR — 지금은 주소만 남겨 뒤로가기가 동작하게 한다
        onSelect={(feedbackId) =>
          router.push(`?open=${feedbackId}`, { scroll: false })
        }
      />

      {openFeedback && (
        // key로 행이 바뀔 때마다 새로 마운트한다 — 입력이 이전 피드백에서 넘어오지 않게
        <FeedbackReplySheet
          key={openFeedback.feedbackId}
          feedback={openFeedback}
          onClose={() => router.back()}
        />
      )}

      {feedbacks.isSuccess && items.length > 0 && (
        <FeedbackPagination
          page={filter.page}
          size={FEEDBACK_PAGE_SIZE}
          totalElements={totalElements}
          totalPages={page?.totalPages ?? 1}
          onChangePage={(next) => change({ page: next })}
        />
      )}
    </div>
  );
}
