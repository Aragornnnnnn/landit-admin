'use client';

// 콘텐츠 제작 조회 훅 — 다음 Day·배치 목록·배치 상세·Day 상세. 생성 중일 때만 10초 폴링하고, 변경 뮤테이션이 'content'를 통째로 무효화한다
import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query';

import {
  fetchContentBatch,
  fetchContentBatchPage,
  fetchContentDraft,
  fetchContentNextDay,
  type ContentDaySummary,
} from '../api/content-batch';
import { shouldPollBatch, shouldPollBatchList } from './content-actions';

export const CONTENT_KEY = ['content'] as const;
export const CONTENT_PAGE_SIZE = 20;

/** 생성은 분 단위로 걸린다 — 스펙은 10초 (docs/screens/content-batches.md "폴링") */
export const CONTENT_POLL_MS = 10_000;

export function useContentNextDayQuery() {
  return useQuery({
    queryKey: [...CONTENT_KEY, 'next-day'] as const,
    queryFn: fetchContentNextDay,
  });
}

export function useContentBatchPageQuery(page: number) {
  return useQuery({
    queryKey: [...CONTENT_KEY, 'page', page] as const,
    queryFn: () => fetchContentBatchPage(page, CONTENT_PAGE_SIZE),
    placeholderData: keepPreviousData,
    refetchInterval: (query) =>
      query.state.data && shouldPollBatchList(query.state.data.items)
        ? CONTENT_POLL_MS
        : false,
  });
}

export function useContentBatchQuery(batchId: number | undefined) {
  return useQuery({
    queryKey: [...CONTENT_KEY, 'batch', batchId] as const,
    queryFn: () => fetchContentBatch(batchId!),
    enabled: batchId !== undefined,
    refetchInterval: (query) =>
      shouldPollBatch(query.state.data) ? CONTENT_POLL_MS : false,
  });
}

export const contentDraftKey = (batchId: number, draftId: number) =>
  [...CONTENT_KEY, 'draft', batchId, draftId] as const;

export function useContentDraftQuery(
  batchId: number | undefined,
  draftId: number | undefined,
) {
  return useQuery({
    queryKey: contentDraftKey(batchId ?? 0, draftId ?? 0),
    queryFn: () => fetchContentDraft(batchId!, draftId!),
    enabled: batchId !== undefined && draftId !== undefined,
    refetchInterval: (query) =>
      query.state.data?.status === 'GENERATING' ? CONTENT_POLL_MS : false,
  });
}

/**
 * Day 표의 검증기·AI 검수·코멘트 열 — 배치 상세의 Day 요약엔 없어 초안을 하나씩 읽는다(Day ≤30).
 * 라인업 단계·생성 중 Day는 아직 읽을 것이 없어 건너뛴다 — 생성이 끝나 켜지는 순간 TanStack이 새로 읽는다(이 쿼리엔 폴링이 없다).
 * BE가 요약 필드를 주면 이 훅을 지운다
 */
export function useContentDraftsQuery(
  batchId: number,
  days: ContentDaySummary[],
) {
  return useQueries({
    queries: days.map((day) => ({
      queryKey: contentDraftKey(batchId, day.draftId),
      queryFn: () => fetchContentDraft(batchId, day.draftId),
      enabled: day.status !== 'LINEUP' && day.status !== 'GENERATING',
      staleTime: CONTENT_POLL_MS,
    })),
  });
}
