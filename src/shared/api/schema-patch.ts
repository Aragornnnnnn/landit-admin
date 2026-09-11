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

/*
 * 푸시 캠페인 — 스웨거에 아직 없다(landit-be #174 머지, develop 미배포 · 2026-09-11).
 * BE `feature/notification/dto/*.java`·`docs/tasks/LAN-462/design.md`를 손으로 옮긴 임시 타입이다.
 * 배포돼 스웨거에 오르면 `pnpm api:types` 재생성 후 아래를 지우고 `Schema<'AdminPushCampaignView'>`로 바꾼다.
 */

export type PushCampaignStatusValue =
  | 'DRAFT'
  | 'PENDING'
  | 'SCHEDULE_PENDING'
  | 'SCHEDULED'
  | 'QUEUED'
  | 'SENDING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface AdminPushCampaignView {
  id: string;
  title: string;
  body: string;
  deepLink: string;
  createdBy: number;
  status: PushCampaignStatusValue;
  /** 발송 시작 시점에 고정한 대상 — 시작 전엔 0 */
  targetUserCount: number;
  targetTokenCount: number;
  pendingCount: number;
  succeededCount: number;
  failedCount: number;
  excludedCount: number;
  /** LocalDateTime — 오프셋 없음 */
  createdAt: string;
  completedAt: string | null;
  audienceType: 'ALL' | 'SELECTED';
  userProfileIds: number[];
  audienceSql: string | null;
  excludedUserProfileIds: number[];
  /** Instant — UTC ISO. 화면은 Asia/Seoul로 보여 준다 */
  scheduledAt: string | null;
}

export interface AdminPushCampaignPage {
  items: AdminPushCampaignView[];
  page: number;
  size: number;
  hasNext: boolean;
  totalCount: number;
  totalPages: number;
}

export interface AdminPushAudiencePreview {
  estimatedUserCount: number;
  estimatedTokenCount: number;
  estimatedAt: string;
}

/** 사용자 목록 — LAN-462가 더한 필터 응답(전체 수·페이지 수·푸시 권한). 같은 배포에 묶여 있어 같은 시점에 지운다 */
export type AdminUserListPagePatched = Omit<
  Schema<'AdminUserListResponse'>,
  'items'
> & {
  items: (Schema<'AdminUserListItem'> & {
    pushPermissionStatus?: 'GRANTED' | 'DENIED' | 'NOT_DETERMINED';
  })[];
  totalCount?: number;
  totalPages?: number;
};

export interface AdminPushCampaignRequest {
  title: string;
  body: string;
  deepLink: string;
  audienceType: 'ALL' | 'SELECTED';
  userProfileIds: number[];
  audienceSql?: string;
  excludedUserProfileIds: number[];
}
