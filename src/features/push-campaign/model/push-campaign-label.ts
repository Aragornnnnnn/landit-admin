// 캠페인 상태·대상·결과를 사람이 읽는 말로 (docs/screens/push-campaigns.md "정확한 카피" · "상태"). 목록·상세·모바일 카드가 같이 쓴다
import { formatCount } from '@/shared/lib/format-count';
import type { ChipDot } from '@/shared/ui/StatusChip';

import type { PushCampaign, PushCampaignStatus } from '../api/push-campaign';
import { formatKst } from './schedule-time';

export const PUSH_STATUS_LABEL: Record<PushCampaignStatus, string> = {
  DRAFT: '초안',
  PENDING: '발송 중',
  SCHEDULE_PENDING: '예약됨',
  SCHEDULED: '예약됨',
  QUEUED: '발송 중',
  SENDING: '발송 중',
  COMPLETED: '완료',
  CANCELLED: '취소됨',
};

/** 점 — 예약은 기다리는 상태(검정), 발송 중은 진행 중(오렌지), 완료는 끝난 일(초록). 초안·취소는 점이 없다 */
export const PUSH_STATUS_DOT: Record<PushCampaignStatus, ChipDot | undefined> =
  {
    DRAFT: undefined,
    PENDING: 'progress',
    SCHEDULE_PENDING: 'scheduled',
    SCHEDULED: 'scheduled',
    QUEUED: 'progress',
    SENDING: 'progress',
    COMPLETED: 'done',
    CANCELLED: undefined,
  };

/** 발송이 끝나지 않은 상태 — 상세를 열어 두면 이 동안만 다시 읽고, 목록 결과 열은 진행 바를 그린다 */
export function isPushInFlight(status: PushCampaignStatus): boolean {
  return (
    status === 'PENDING' ||
    status === 'SCHEDULE_PENDING' ||
    status === 'QUEUED' ||
    status === 'SENDING'
  );
}

/** 처리된 기기(성공+실패) / 대상 기기. 대상이 아직 고정되지 않았으면 0 */
export function pushProgressRatio(campaign: PushCampaign): number {
  if (campaign.targetTokenCount <= 0) return 0;
  return (
    (campaign.succeededCount + campaign.failedCount) / campaign.targetTokenCount
  );
}

/**
 * 대상 셀 — "전체 · 9,412 기기" / "선택 · 1,204명 · SQL".
 * 발송 시작 전엔 BE가 사용자 수를 아직 세지 않았으므로 고른 ID 수로 대신한다
 */
export function pushAudienceLabel(campaign: PushCampaign): {
  kind: '전체' | '선택';
  detail: string;
} {
  if (campaign.audienceType === 'ALL') {
    return {
      kind: '전체',
      detail:
        campaign.targetTokenCount > 0
          ? `${formatCount(campaign.targetTokenCount)} 기기`
          : '—',
    };
  }
  const people =
    campaign.targetUserCount > 0
      ? `${formatCount(campaign.targetUserCount)}명`
      : campaign.userProfileIds.length > 0
        ? `${formatCount(campaign.userProfileIds.length)}명 선택`
        : '—';
  return {
    kind: '선택',
    detail: campaign.audienceSql ? `${people} · SQL` : people,
  };
}

/** 발송·예약 셀 — 예약 시각(취소면 "(취소)"), 예약 없이 보낸 건 완료 시각, 아직이면 — */
export function pushScheduleLabel(campaign: PushCampaign): string {
  if (campaign.scheduledAt) {
    const at = formatKst(campaign.scheduledAt);
    return campaign.status === 'CANCELLED' ? `${at} (취소)` : `${at} 예약`;
  }
  return campaign.completedAt ? formatKst(campaign.completedAt) : '—';
}
