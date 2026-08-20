// 스웨거가 잘못 표현한 타입을 손으로 바로잡는 자리 — BE가 고치면 항목을 지우고 schema.d.ts만 쓴다
import type { components, paths } from './schema';

/** `components.schemas.<이름>`을 짧게 부른다 — `Schema<'AdminUserDetailResponse'>` */
export type Schema<K extends keyof components['schemas']> =
  components['schemas'][K];

/** 경로+메서드의 200 응답 JSON 타입 — `ResponseOf<'/api/v1/admin/users', 'get'>` */
export type ResponseOf<
  P extends keyof paths,
  M extends keyof paths[P] & ('get' | 'post' | 'put' | 'patch' | 'delete'),
> = paths[P][M] extends {
  responses: { 200: { content: { '*/*': infer R } } };
}
  ? R
  : never;

/**
 * 관리자 사용자 목록의 한 줄.
 *
 * 스웨거 버그 — landit-be의 여러 응답이 중첩 record 이름을 `Item`으로 써서 springdoc이 하나로 합쳐 버렸고,
 * `AdminUserListResponse.items`가 피드백 Item(feedbackId·preview…)을 가리키게 됐다.
 * 실제 BE `AdminUserListResponse.Item`(landit-be feature/admin/dto)은 아래 필드다. BE가 이름을 갈라 스웨거를 고치면 이 타입을 지운다.
 */
export interface AdminUserListItem {
  userProfileId: number;
  email: string;
  nickname: string;
  role: Schema<'AdminUserDetailResponse'>['role'];
  status: Schema<'AdminUserDetailResponse'>['status'];
  /** ISO 8601 */
  createdAt: string;
}

/** 스웨거의 `items: Item[]`를 실제 타입으로 바꾼 사용자 목록 응답 */
export type AdminUserListResponse = Omit<
  Schema<'AdminUserListResponse'>,
  'items'
> & {
  items?: AdminUserListItem[];
};
