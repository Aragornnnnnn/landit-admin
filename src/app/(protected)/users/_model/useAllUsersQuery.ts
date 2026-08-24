'use client';

// 사용자 전체를 순차로 받아 둔다 — BE에 검색·필터가 없어 우리가 걸러야 하고, 거르려면 다 있어야 한다.
// 50명씩 hasNext가 false일 때까지 이어 받고, 그동안 화면은 받은 만큼으로 먼저 동작한다 (docs/screens/users.md)
import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

import { USERS_FETCH_SIZE } from './user-filter';

type AdminUserListItem = Schema<'AdminUserListItem'>;
type AdminUserListResponse = Schema<'AdminUserListResponse'>;

const PATH = '/api/v1/admin/users';

export function useAllUsersQuery() {
  const query = useInfiniteQuery({
    queryKey: ['users', 'all'] as const,
    queryFn: ({ pageParam }) =>
      api.get<AdminUserListResponse>(
        `${PATH}?page=${pageParam}&size=${USERS_FETCH_SIZE}`,
      ),
    initialPageParam: 0,
    getNextPageParam: (last, all) => (last.hasNext ? all.length : undefined),
    // 어드민 데이터는 오래 들고 있지 않는다 — 화면을 떠났다 오면 다시 받는다
    staleTime: 0,
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  useEffect(() => {
    // 다음 장이 있으면 곧바로 이어 받는다. 사용자가 "더 보기"를 누를 이유가 없다 — 검색하려면 어차피 전부 필요하다
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const users: AdminUserListItem[] = (query.data?.pages ?? []).flatMap(
    (page) => page.items ?? [],
  );

  return {
    users,
    /** 첫 장도 아직 못 받은 상태 — 이때만 화면이 비어 있다 */
    isPending: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
    /** 아직 더 받을 게 남았나 — 검색이 "불러온 범위"임을 알리는 기준 */
    isLoadingMore: query.hasNextPage || query.isFetchingNextPage,
  };
}
