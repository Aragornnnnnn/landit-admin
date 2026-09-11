// 사용자 목록 API — 경로·응답 타입·조회 함수. 사용자 화면과 대시보드(가입 수)가 같이 쓴다
import { api } from '@/shared/api/client';
import type {
  AdminUserListPagePatched,
  Schema,
} from '@/shared/api/schema-patch';

// LAN-462가 더한 totalCount·totalPages·pushPermissionStatus까지 — 스웨거 반영 전까지 패치 타입
export type UserListResponse = AdminUserListPagePatched;
export type UserListItem = Schema<'AdminUserListItem'>;

export const USERS_PATH = '/api/v1/admin/users';

/** 목록 한 장 — 페이지·크기·active·pushConsent는 BE 쿼리 파라미터 그대로 넘긴다 */
export function fetchUserPage(params: URLSearchParams) {
  return api.get<UserListResponse>(`${USERS_PATH}?${params}`);
}
