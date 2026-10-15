'use client';

// 사용자 검색 조건별로 서버의 한 페이지와 전체 건수를 조회한다.
import { useQuery } from '@tanstack/react-query';

import { fetchUserPage } from '@/features/user/api/user-list';

import { userSearchParams, type UserFilter } from './user-filter';

export function useUsersQuery(filter: UserFilter) {
  const params = userSearchParams(filter);
  return useQuery({
    queryKey: ['users', 'search', params.toString()] as const,
    queryFn: () => fetchUserPage(params),
    staleTime: 0,
  });
}
