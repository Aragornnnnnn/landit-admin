'use client';

// 한 사용자의 처리중 피드백 모으기 — 전용 API가 없어 이메일 검색으로 대신한다 (docs/screens/feedbacks.md "데이터").
// BE에 admin/users/{id}/feedbacks가 생기면 이 훅만 바꾸면 된다
import { useQuery } from '@tanstack/react-query';

import { fetchFeedbackPage } from '@/features/feedback/api/feedback-list';

// 한 사람이 이보다 많이 보냈으면 접힌 목록에 다 못 담는다 — 그땐 목록 화면에서 걸러 쓴다
const SIZE = 50;

export const userPendingFeedbacksKey = (email: string) =>
  ['feedbacks', 'user-pending', email] as const;

export function useUserPendingFeedbacksQuery(email: string | undefined) {
  return useQuery({
    queryKey: userPendingFeedbacksKey(email ?? ''),
    enabled: Boolean(email),
    queryFn: () => {
      const params = new URLSearchParams({
        keyword: email!,
        status: 'PENDING',
        size: String(SIZE),
        sort: 'OLDEST',
      });
      return fetchFeedbackPage(params);
    },
  });
}
