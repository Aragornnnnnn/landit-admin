// 사용자 목록과 대상 선택에 사용하는 서버 페이지 조회 API다.
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export type UserListResponse = Schema<'AdminUserListResponse'>;
export type UserListItem = Schema<'AdminUserListItem'>;

export const USERS_PATH = '/api/v1/admin/users';

/** 목록 한 장 — 검색·필터·페이지는 BE 쿼리 파라미터 그대로 넘긴다 */
export function fetchUserPage(params: URLSearchParams) {
  return api.get<UserListResponse>(`${USERS_PATH}?${params}`);
}
