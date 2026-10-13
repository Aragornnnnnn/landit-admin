'use client';

// 대시보드의 집계·목록 조회와 카드별 로딩·오류 상태를 제공한다.
// 어느 목록을 얼마나 받아 오는지가 곧 숫자의 정확도라, 범위를 여기 한 곳에 적어 둔다
import { useQuery } from '@tanstack/react-query';

import { useAppVersionsQuery } from '@/features/app-version/model/useAppVersionsQuery';
import { fetchFeedbackPage } from '@/features/feedback/api/feedback-list';
import { fetchLetterPage } from '@/features/letter/api/letter-list';

import { fetchSignupStatistics } from '../_api/signup-statistics';

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

  const signups = useQuery({
    queryKey: ['dashboard', 'signup-statistics'] as const,
    queryFn: fetchSignupStatistics,
  });

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
    signups: signups.data,
    publishedLetters: letters.data?.items ?? [],
    draftLetterCount: drafts.data?.items?.length ?? 0,
    appVersions: appVersions.data ?? [],
    recentPending: recent.isPending,
    pendingPending: pending.isPending,
    signupsPending: signups.isPending,
    lettersPending: letters.isPending || drafts.isPending,
    appVersionsPending: appVersions.isPending,
    recentError: recent.isError,
    pendingError: pending.isError,
    signupsError: signups.isError,
    lettersError: letters.isError || drafts.isError,
    appVersionsError: appVersions.isError,
    refetchRecent: () => {
      void recent.refetch();
    },
    refetchPending: () => {
      void pending.refetch();
    },
    refetchSignups: () => {
      void signups.refetch();
    },
    refetchLetters: () => {
      void letters.refetch();
      void drafts.refetch();
    },
    refetchAppVersions: () => {
      void appVersions.refetch();
    },
  };
}
