// 생성된 OpenAPI 계약으로 수동 권한과 선택 가능한 상품을 조회·변경한다.
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export type GrantRequest = Schema<'AdminSubscriptionGrantRequest'>;
export type Grant = Schema<'AdminSubscriptionGrantResponse'>;
export type GrantProduct = Schema<'AdminSubscriptionProductResponse'>;
const path = (userId: number) =>
  `/api/v1/admin/users/${userId}/subscription-grants`;
export const fetchGrantProducts = () =>
  api.get<GrantProduct[]>('/api/v1/admin/subscription/products');
export const fetchGrants = (userId: number) => api.get<Grant[]>(path(userId));
export const createGrant = (userId: number, request: GrantRequest) =>
  api.post<Grant>(path(userId), request);
export const revokeGrant = (userId: number, grantId: number) =>
  api.delete<Grant>(`${path(userId)}/${grantId}`);
