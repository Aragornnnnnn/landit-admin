'use client';

// 피드백 목록 조회 — 필터가 바뀌어도 이전 결과를 지우지 않는다(placeholderData). 빈 화면이 깜빡이는 대신 진행만 보이게
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { fetchFeedbackPage } from '@/features/feedback/api/feedback-list';

import { toFeedbackQuery, type FeedbackFilter } from './feedback-filter';

export const feedbackListKey = (filter: FeedbackFilter) =>
  ['feedbacks', 'list', filter] as const;

export function useFeedbackListQuery(filter: FeedbackFilter) {
  return useQuery({
    queryKey: feedbackListKey(filter),
    queryFn: () => {
      // 기간은 "지금"에서 거꾸로 잰다 — queryFn 안에서 계산해야 키가 매초 달라지지 않는다
      const query = toFeedbackQuery(filter, new Date());
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) params.set(key, String(value));
      }
      return fetchFeedbackPage(params);
    },
    placeholderData: keepPreviousData,
  });
}
