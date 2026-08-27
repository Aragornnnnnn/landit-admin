'use client';

// 피드백 목록 화면 조립 — 필터 줄 · 목록 · 페이지네이션 (docs/screens/feedbacks.md)
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import {
  FEEDBACK_PAGE_SIZE,
  writeFeedbackFilter,
} from '../_model/feedback-filter';
import { useFeedbackDetailQuery } from '../_model/useFeedbackDetailQuery';
import { useFeedbackFilterParams } from '../_model/useFeedbackFilterParams';
import { useFeedbackListQuery } from '../_model/useFeedbackListQuery';
import { usePendingFeedbackCountQuery } from '../../_model/usePendingFeedbackCountQuery';
import { FeedbackFilters } from './FeedbackFilters';
import { FeedbackList } from './FeedbackList';
import { FeedbackPagination } from './FeedbackPagination';
import { FeedbackReply } from './FeedbackReply';

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

  // 열린 상세는 주소가 진실이다 — 새로고침·뒤로가기로 열고 닫힌다.
  // 단건 조회로 받아서 목록 필터·페이지에 없는 건(딥링크)도 열린다 (BE LAN-374)
  const openId = Number(searchParams.get('open'));
  const detail = useFeedbackDetailQuery(
    Number.isInteger(openId) && openId > 0 ? openId : undefined,
  );

  // 상세 조회 실패(삭제된 건 등)면 알리고 open만 걷어낸다 — 시트가 없으니 자리 오류를 그릴 곳이 없다
  const detailFailed = detail.isError;
  useEffect(() => {
    if (!detailFailed) return;
    toast.error('피드백을 불러오지 못했어요');
    const query = writeFeedbackFilter(filter);
    router.replace(query ? `?${query}` : '/feedbacks', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filter·router는 매 렌더 새로 만들어져 넣으면 토스트가 반복된다
  }, [detailFailed]);

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
        // 열림·닫힘을 주소에 남긴다 — 모바일 전체화면도 기기 뒤로가기로 닫힌다
        onSelect={(feedbackId) =>
          router.push(`?open=${feedbackId}`, { scroll: false })
        }
      />

      {detail.data && (
        // key로 행이 바뀔 때마다 새로 마운트한다 — 입력이 이전 피드백에서 넘어오지 않게
        <FeedbackReply
          key={detail.data.feedbackId}
          feedback={detail.data}
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
