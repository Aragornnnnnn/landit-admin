'use client';

// 대상 추가 패널의 사용자 목록 — 서버 필터(활성·알림 허용)로 한 장씩 받는다.
// 사용자 화면의 useAllUsersQuery(전부 이어받기)는 고르는 자리엔 무겁다 (docs/screens/push-campaigns.md "사용자 목록 탭")
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { USERS_PATH } from '@/features/user/api/user-list';
import { api } from '@/shared/api/client';
import type { AdminUserListPagePatched } from '@/shared/api/schema-patch';

export const USER_PICK_PAGE_SIZE = 20;

export interface UserPickParams {
  page: number;
  /** true면 ACTIVE만. false는 쓰지 않는다 — 탈퇴·정지 사용자에게 보낼 일이 없다 */
  activeOnly: boolean;
  /** true면 저장된 푸시 권한 GRANTED만 */
  pushConsentOnly: boolean;
}

export function useUserPickQuery(params: UserPickParams) {
  return useQuery({
    queryKey: ['users', 'pick', params] as const,
    queryFn: () => {
      const query = new URLSearchParams({
        page: String(params.page),
        size: String(USER_PICK_PAGE_SIZE),
      });
      if (params.activeOnly) query.set('active', 'true');
      if (params.pushConsentOnly) query.set('pushConsent', 'true');
      return api.get<AdminUserListPagePatched>(`${USERS_PATH}?${query}`);
    },
    placeholderData: keepPreviousData,
  });
}
