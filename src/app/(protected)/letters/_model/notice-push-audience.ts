// 공지 푸시의 대상 선택을 기존 캠페인 입력과 구독 그룹으로 조합한다.
import {
  canSaveAudience,
  EMPTY_AUDIENCE,
  toAudienceRequest,
  type AudienceDraft,
} from '@/features/push-campaign/model/audience';
import {
  SUBSCRIPTION_AUDIENCE_LABELS,
  type SubscriptionAudience,
} from '@/features/subscription/ui/SubscriptionAudienceFields';

export interface NoticePushSelection {
  audience: AudienceDraft;
  groups: SubscriptionAudience[];
}

export const EMPTY_NOTICE_PUSH_SELECTION: NoticePushSelection = {
  audience: EMPTY_AUDIENCE,
  groups: [],
};

export function canRequestNoticePush({
  audience,
  groups,
}: NoticePushSelection) {
  return canSaveAudience(audience) || groups.length > 0;
}

export function toNoticePushAudience({
  audience,
  groups,
}: NoticePushSelection) {
  return {
    ...toAudienceRequest(audience),
    includedAudiences:
      audience.type === 'SELECTED' ? [...new Set(groups)].sort() : [],
  };
}

export type NoticePushAudience = ReturnType<typeof toNoticePushAudience>;

export function noticePushAudienceSummary(request: NoticePushAudience) {
  if (request.audienceType === 'ALL') return '공지를 볼 수 있는 전체 사용자';
  const sources = [
    request.userProfileIds?.length
      ? `직접 선택·ID ${request.userProfileIds.length}명`
      : '',
    request.audienceSql ? 'SQL 결과' : '',
    ...request.includedAudiences.map(
      (group) => SUBSCRIPTION_AUDIENCE_LABELS[group],
    ),
  ];
  const included = sources.filter(Boolean).join(' · ');
  const excluded = request.excludedUserProfileIds?.length ?? 0;
  return excluded > 0 ? `${included} · ${excluded}명 제외` : included;
}
