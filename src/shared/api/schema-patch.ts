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
 * 사용자 상세 — 스웨거 버그 교정.
 * BE 실제 응답의 learningLevel은 enum 문자열(BEGINNER·INTERMEDIATE·ADVANCED)인데,
 * 스웨거가 int32로 잘못 찍는다(2026-08-24, LAN-337 배포본). BE가 고치면 이 타입을 지운다.
 */
export type AdminUserDetail = Omit<
  Schema<'AdminUserDetailResponse'>,
  'learningLevel'
> & {
  learningLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null;
};
