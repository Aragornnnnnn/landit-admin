// 푸시 캠페인 API — 경로·응답 타입·조회/변경 함수. 목록·편집기·상세 세 라우트가 같이 쓴다 (docs/screens/push-campaigns.md "데이터")
import { api } from '@/shared/api/client';
import type {
  AdminPushAudiencePreview,
  AdminPushCampaignPage,
  AdminPushCampaignRequest,
  AdminPushCampaignView,
} from '@/shared/api/schema-patch';

export type PushCampaign = AdminPushCampaignView;
export type PushCampaignPage = AdminPushCampaignPage;
export type PushCampaignRequest = AdminPushCampaignRequest;
export type PushAudiencePreview = AdminPushAudiencePreview;
export type PushCampaignStatus = PushCampaign['status'];
export type PushAudienceType = PushCampaign['audienceType'];

export const PUSH_CAMPAIGNS_PATH = '/api/v1/admin/push-campaigns';

/**
 * 변경 요청마다 새로 만드는 멱등성 키 — 같은 클릭의 재시도는 같은 키로 보내야 BE가 중복 생성·발송을 막는다.
 * 그래서 키는 "요청 직전"이 아니라 "사용자가 버튼을 누른 순간" 만들어 재시도 동안 붙들고 있는다
 */
export const newIdempotencyKey = () => crypto.randomUUID();

const idempotent = (key: string) => ({
  headers: { 'Idempotency-Key': key },
});

/** 목록 한 장 — scheduled·status·page·size는 BE 쿼리 파라미터 그대로 */
export function fetchPushCampaignPage(params: URLSearchParams) {
  return api.get<PushCampaignPage>(`${PUSH_CAMPAIGNS_PATH}?${params}`);
}

export function fetchPushCampaign(campaignId: string) {
  return api.get<PushCampaign>(`${PUSH_CAMPAIGNS_PATH}/${campaignId}`);
}

/** 지금 기준 예상 사용자·기기 수 — 발송 시점에 다시 계산되므로 참고치다 */
export function fetchPushAudiencePreview(campaignId: string) {
  return api.get<PushAudiencePreview>(
    `${PUSH_CAMPAIGNS_PATH}/${campaignId}/audience-preview`,
  );
}

/** 읽기 전용 SQL로 대상 ID를 미리 조회한다 — 발송은 하지 않는다. 결과 ID 배열이 그대로 온다 */
export function queryPushAudience(sql: string) {
  return api.post<number[]>(`${PUSH_CAMPAIGNS_PATH}/audience-query`, { sql });
}

export function createPushCampaign(body: PushCampaignRequest, key: string) {
  return api.post<PushCampaign>(PUSH_CAMPAIGNS_PATH, body, idempotent(key));
}

/** 관리자 본인 기기로 보낸다 — DRAFT에서만 */
export function testPushCampaign(campaignId: string, key: string) {
  return api.post<PushCampaign>(
    `${PUSH_CAMPAIGNS_PATH}/${campaignId}/test`,
    undefined,
    idempotent(key),
  );
}

export function sendPushCampaign(campaignId: string, key: string) {
  return api.post<PushCampaign>(
    `${PUSH_CAMPAIGNS_PATH}/${campaignId}/send`,
    undefined,
    idempotent(key),
  );
}

/** 한국 시간 예약 — scheduledAt은 `+09:00` 오프셋 문자열(schedule-time.ts가 만든다) */
export function schedulePushCampaign(
  campaignId: string,
  scheduledAt: string,
  key: string,
) {
  return api.post<PushCampaign>(
    `${PUSH_CAMPAIGNS_PATH}/${campaignId}/schedule`,
    { scheduledAt },
    idempotent(key),
  );
}

export function cancelPushCampaignSchedule(campaignId: string) {
  return api.post<PushCampaign>(
    `${PUSH_CAMPAIGNS_PATH}/${campaignId}/cancel-schedule`,
  );
}
