'use client';

// 사이드바 피드백 배지 — 처리중(PENDING) 건수. size=1로 totalElements만 읽는다. 대시보드도 쓰게 되면 features/feedback으로 내린다
import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/client';

export const PENDING_FEEDBACK_COUNT_KEY = [
  'feedbacks',
  'pending-count',
] as const;

interface FeedbackPage {
  totalElements?: number;
}

export function usePendingFeedbackCountQuery() {
  return useQuery({
    queryKey: PENDING_FEEDBACK_COUNT_KEY,
    queryFn: () =>
      api.get<FeedbackPage>(
        '/api/v1/admin/mailbox/feedbacks?status=PENDING&size=1',
      ),
    select: (page) => page.totalElements ?? 0,
    // 배지는 60초면 충분하다 — 답장 후 invalidate가 즉시 갱신한다
    staleTime: 60_000,
  });
}
