'use client';

// 대시보드가 쓰는 조회 — 집계 API가 없어 목록 API로 받아 와 화면에서 센다 (docs/screens/dashboard.md).
// 어느 목록을 얼마나 받아 오는지가 곧 숫자의 정확도라, 범위를 여기 한 곳에 적어 둔다
import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/client';
import type { AdminUserListItem, Schema } from '@/shared/api/schema-patch';

type FeedbackListResponse = Schema<'AdminMailboxFeedbackListResponse'>;
type UserListResponse = { items?: AdminUserListItem[] };

/** 차트는 7일치다. 그 안의 건수를 다 세려면 넉넉히 받아야 한다 — 넘치면 막대가 낮게 나온다 */
const RECENT_DAYS = 7;
const RECENT_SIZE = 200;
/** 가입 수는 최근 두 주만 세면 되는데 BE에 기간 필터가 없어 최신순으로 받아 자른다 */
const USERS_SIZE = 200;

export function useDashboardData(now: Date) {
  const createdFrom = new Date(
    now.getTime() - RECENT_DAYS * 86_400_000,
  ).toISOString();

  const recent = useQuery({
    queryKey: ['dashboard', 'recent-feedbacks'] as const,
    queryFn: () =>
      api.get<FeedbackListResponse>(
        `/api/v1/admin/mailbox/feedbacks?size=${RECENT_SIZE}&sort=NEWEST&createdFrom=${encodeURIComponent(createdFrom)}`,
      ),
  });

  // 처리중은 기간과 무관하다 — 오래 기다린 건일수록 중요해서 따로 받는다
  const pending = useQuery({
    queryKey: ['dashboard', 'pending-feedbacks'] as const,
    queryFn: () =>
      api.get<FeedbackListResponse>(
        `/api/v1/admin/mailbox/feedbacks?status=PENDING&size=${RECENT_SIZE}&sort=OLDEST`,
      ),
  });

  const users = useQuery({
    queryKey: ['dashboard', 'recent-users'] as const,
    queryFn: () =>
      api.get<UserListResponse>(
        `/api/v1/admin/users?page=0&size=${USERS_SIZE}`,
      ),
  });

  return {
    recentFeedbacks: recent.data?.items ?? [],
    recentTotal: recent.data?.totalElements ?? 0,
    pendingFeedbacks: pending.data?.items ?? [],
    pendingTotal: pending.data?.totalElements ?? 0,
    users: users.data?.items ?? [],
    isPending: recent.isPending || pending.isPending || users.isPending,
    isError: recent.isError || pending.isError || users.isError,
    refetch: () => {
      void recent.refetch();
      void pending.refetch();
      void users.refetch();
    },
  };
}
