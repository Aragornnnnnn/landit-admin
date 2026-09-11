// 새 푸시 초안의 규칙 — 무엇을 담고, 무엇이 있어야 저장할 수 있고, 서버 본문으로 어떻게 바뀌는지 (docs/screens/push-campaigns.md "새 푸시").
// 화면은 이 함수들을 부르기만 한다. 대상 규칙은 features/push-campaign/model/audience.ts
import type {
  PushCampaign,
  PushCampaignRequest,
} from '@/features/push-campaign/api/push-campaign';
import {
  canSaveAudience,
  EMPTY_AUDIENCE,
  toAudienceRequest,
  type AudienceDraft,
} from '@/features/push-campaign/model/audience';
import {
  campaignSlug,
  deepLinkError,
  withUtm,
} from '@/features/push-campaign/model/deep-link';

export const TITLE_MAX = 255;
export const BODY_MAX = 500;

export interface CampaignDraft {
  title: string;
  body: string;
  deepLink: string;
  utmEnabled: boolean;
  utmCampaign: string;
  /** 운영자가 캠페인 값을 직접 고쳤나 — 그 뒤로는 제목이 바뀌어도 덮어쓰지 않는다 */
  utmEdited: boolean;
  audience: AudienceDraft;
}

export const EMPTY_CAMPAIGN_DRAFT: CampaignDraft = {
  title: '',
  body: '',
  deepLink: '',
  utmEnabled: true,
  utmCampaign: '',
  utmEdited: false,
  audience: EMPTY_AUDIENCE,
};

/** 제목을 바꾸면 utm_campaign 기본값이 따라간다 — 운영자가 손대기 전까지 */
export function withTitle(
  draft: CampaignDraft,
  title: string,
  now: Date = new Date(),
): CampaignDraft {
  return {
    ...draft,
    title,
    utmCampaign: draft.utmEdited ? draft.utmCampaign : campaignSlug(title, now),
  };
}

/** BE에 저장되는 딥 링크 — 스위치가 켜져 있으면 UTM을 붙인 것 */
export function finalDeepLink(draft: CampaignDraft): string {
  const link = draft.deepLink.trim();
  return draft.utmEnabled ? withUtm(link, draft.utmCampaign.trim()) : link;
}

export interface DraftErrors {
  title?: string;
  body?: string;
  deepLink?: string;
  audience?: string;
}

export function draftErrors(draft: CampaignDraft): DraftErrors {
  const errors: DraftErrors = {};
  const title = draft.title.trim();
  const body = draft.body.trim();
  if (!title) errors.title = '제목을 입력해 주세요';
  else if (title.length > TITLE_MAX)
    errors.title = `제목은 ${TITLE_MAX}자까지예요`;
  if (!body) errors.body = '본문을 입력해 주세요';
  else if (body.length > BODY_MAX) errors.body = `본문은 ${BODY_MAX}자까지예요`;
  const linkError = deepLinkError(finalDeepLink(draft));
  if (linkError) errors.deepLink = linkError;
  if (!canSaveAudience(draft.audience))
    errors.audience = '대상을 하나 이상 추가해 주세요';
  return errors;
}

export const canSaveCampaignDraft = (draft: CampaignDraft) =>
  Object.keys(draftErrors(draft)).length === 0;

export function toCampaignRequest(draft: CampaignDraft): PushCampaignRequest {
  return {
    title: draft.title.trim(),
    body: draft.body.trim(),
    deepLink: finalDeepLink(draft),
    ...toAudienceRequest(draft.audience),
  };
}

/**
 * "같은 내용으로 새 푸시" — 보낸 캠페인의 내용·대상을 새 초안에 옮긴다.
 * 저장된 딥 링크엔 UTM이 이미 붙어 있으므로 스위치를 끈 채 그대로 둔다(두 번 붙지 않게).
 * 저장된 userProfileIds는 직접 선택과 붙여넣기가 합쳐진 것이라 직접 선택으로 되돌린다
 */
export function fromCampaign(campaign: PushCampaign): CampaignDraft {
  return {
    title: campaign.title,
    body: campaign.body,
    deepLink: campaign.deepLink,
    utmEnabled: false,
    utmCampaign: '',
    utmEdited: false,
    audience: {
      type: campaign.audienceType,
      selectedIds: campaign.userProfileIds,
      pastedIds: [],
      sql: campaign.audienceSql ?? '',
      sqlIds: [],
      excludedIds: campaign.excludedUserProfileIds,
    },
  };
}

/** 아무것도 안 썼나 — ← 목록에서 물을지 정하는 기준 */
export function isEmptyCampaignDraft(draft: CampaignDraft): boolean {
  return (
    !draft.title.trim() &&
    !draft.body.trim() &&
    !draft.deepLink.trim() &&
    !canSaveAudience({ ...draft.audience, type: 'SELECTED' })
  );
}
