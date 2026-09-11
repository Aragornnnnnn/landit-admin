'use client';

// 대시보드가 쓰는 조회 — 집계 API가 없어 목록 API로 받아 와 화면에서 센다 (docs/screens/dashboard.md).
// 어느 목록을 얼마나 받아 오는지가 곧 숫자의 정확도라, 범위를 여기 한 곳에 적어 둔다
import { useQuery } from '@tanstack/react-query';

import { useAppVersionsQuery } from '@/features/app-version/model/useAppVersionsQuery';
import { fetchFeedbackPage } from '@/features/feedback/api/feedback-list';
import { fetchLetterPage } from '@/features/letter/api/letter-list';
import { useAllUsersQuery } from '@/features/user/model/useAllUsersQuery';

/** 차트는 7일치다. BE가 한 번에 최대 50건까지만 준다(51부터 400, 실 서버 확인) — 7일 접수가 50건을
 * 넘으면 막대와 카운트가 실제보다 작게 나온다. 그때는 페이지를 이어 받도록 바꿔야 한다 */
const RECENT_DAYS = 7;
const RECENT_SIZE = 50;

export function useDashboardData(now: Date) {
  // BE 계약이 date라 시각을 붙이면 400이 난다 (실 서버 확인)
  const createdFrom = new Date(now.getTime() - RECENT_DAYS * 86_400_000)
    .toISOString()
    .slice(0, 10);

  const recent = useQuery({
    queryKey: ['dashboard', 'recent-feedbacks'] as const,
    queryFn: () =>
      fetchFeedbackPage(
        new URLSearchParams({
          size: String(RECENT_SIZE),
          sort: 'NEWEST',
          createdFrom,
        }),
      ),
  });

  // 처리중은 기간과 무관하다 — 오래 기다린 건일수록 중요해서 따로 받는다
  const pending = useQuery({
    queryKey: ['dashboard', 'pending-feedbacks'] as const,
    queryFn: () =>
      fetchFeedbackPage(
        new URLSearchParams({
          status: 'PENDING',
          size: String(RECENT_SIZE),
          sort: 'OLDEST',
        }),
      ),
  });

  // 가입 수는 지난달까지 세야 해서 사용자 전체를 받는다 — 사용자 화면과 같은 쿼리라 캐시도 같이 쓴다.
  // 다 받을 때까지 기다린다. 중간값을 보여 주면 숫자가 올라가며 흔들린다
  const users = useAllUsersQuery();

  // 편지함 카드는 "지금 사용자에게 보이는" 것만 본다 — 발행된 편지 위에서 세 통
  const letters = useQuery({
    queryKey: ['dashboard', 'published-letters'] as const,
    queryFn: () =>
      fetchLetterPage(
        new URLSearchParams({
          publicationStatus: 'PUBLISHED',
          page: '0',
          size: '20',
        }),
      ),
  });

  const drafts = useQuery({
    queryKey: ['dashboard', 'draft-letters'] as const,
    queryFn: () =>
      fetchLetterPage(
        new URLSearchParams({
          publicationStatus: 'DRAFT',
          page: '0',
          size: '20',
        }),
      ),
  });

  // 앱 버전 화면과 같은 키 — 거기서 저장하면 여기도 함께 갱신된다
  const appVersions = useAppVersionsQuery();

  return {
    recentFeedbacks: recent.data?.items ?? [],
    recentTotal: recent.data?.totalElements ?? 0,
    pendingFeedbacks: pending.data?.items ?? [],
    pendingTotal: pending.data?.totalElements ?? 0,
    users: users.users,
    publishedLetters: letters.data?.items ?? [],
    draftLetterCount: drafts.data?.items?.length ?? 0,
    appVersions: appVersions.data ?? [],
    isPending:
      recent.isPending ||
      pending.isPending ||
      users.isPending ||
      users.isLoadingMore,
    // 실패는 구역별로 알린다 — 피드백 API가 죽어도 사용자·편지·앱 버전은 멀쩡히 보여야 한다
    feedbacksError: recent.isError || pending.isError,
    usersError: users.isError,
    lettersError: letters.isError || drafts.isError,
    appVersionsError: appVersions.isError,
    refetchFeedbacks: () => {
      void recent.refetch();
      void pending.refetch();
    },
    refetchUsers: () => {
      void users.refetch();
    },
  };
}
