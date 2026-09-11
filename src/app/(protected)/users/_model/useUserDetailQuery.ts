'use client';

// 사용자 한 명 + 그 사람이 보낸 피드백 (docs/screens/users.md "상세")
import { useQuery } from '@tanstack/react-query';

import { fetchFeedbackPage } from '@/features/feedback/api/feedback-list';
import { api } from '@/shared/api/client';

import type { UserDetail } from './user-detail';

export function useUserDetailQuery(userProfileId: number) {
  return useQuery({
    queryKey: ['users', 'detail', userProfileId] as const,
    queryFn: () => api.get<UserDetail>(`/api/v1/admin/users/${userProfileId}`),
  });
}

/** 이 사용자가 보낸 피드백 — BE에 사용자별 조회가 없어 이메일을 검색어로 쓴다 (docs/screens/users.md) */
export function useUserFeedbacksQuery(email: string | null | undefined) {
  return useQuery({
    queryKey: ['feedbacks', 'byUser', email] as const,
    queryFn: () =>
      fetchFeedbackPage(
        new URLSearchParams({ keyword: email!, size: '50', sort: 'NEWEST' }),
      ),
    enabled: Boolean(email),
  });
}
