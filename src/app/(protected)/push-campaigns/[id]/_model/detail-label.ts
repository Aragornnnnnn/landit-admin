// 상세 화면의 말 — 진행 타임라인과 결과 비율 (docs/screens/push-campaigns.md "상세")
import type { PushCampaign } from '@/features/push-campaign/api/push-campaign';
import { isPushInFlight } from '@/features/push-campaign/model/push-campaign-label';
import { formatKst } from '@/features/push-campaign/model/schedule-time';
import { formatCount } from '@/shared/lib/format-count';

export interface TimelineStep {
  label: string;
  when: string;
  /** done 초록 · active·next 오렌지 · todo·cancelled 회색 */
  state: 'done' | 'active' | 'next' | 'todo' | 'cancelled';
}

/** 초안 생성 → 발송(또는 예약) → 완료. 만든 사람은 이름을 주는 API가 없어 번호만 적는다 */
export function campaignTimeline(campaign: PushCampaign): TimelineStep[] {
  return [
    {
      label: '초안 생성',
      when: `${formatKst(campaign.createdAt)} · #${campaign.createdBy}`,
      state: 'done',
    },
    sendStep(campaign),
    {
      label: '완료',
      when: campaign.completedAt
        ? `${formatKst(campaign.completedAt)} · ${formatCount(campaign.targetTokenCount)} 기기`
        : '—',
      state: campaign.completedAt ? 'done' : 'todo',
    },
  ];
}

function sendStep(campaign: PushCampaign): TimelineStep {
  const scheduled = campaign.scheduledAt
    ? formatKst(campaign.scheduledAt)
    : null;
  if (campaign.status === 'CANCELLED')
    return { label: '예약 취소', when: scheduled ?? '—', state: 'cancelled' };
  if (campaign.status === 'SCHEDULED' || campaign.status === 'SCHEDULE_PENDING')
    return { label: '예약 발송', when: scheduled ?? '—', state: 'next' };
  if (isPushInFlight(campaign.status))
    return { label: '발송 중', when: scheduled ?? '진행 중', state: 'active' };
  if (campaign.status === 'COMPLETED')
    return { label: '발송', when: scheduled ?? '지금 발송', state: 'done' };
  return { label: '발송', when: '—', state: 'next' };
}

/** 분포 바와 타일의 비율 — 대상 기기 대비. 대상이 아직 고정되지 않았으면 전부 0 */
export function resultShares(campaign: PushCampaign) {
  const total = campaign.targetTokenCount;
  const share = (n: number) => (total > 0 ? n / total : 0);
  return {
    succeeded: share(campaign.succeededCount),
    failed: share(campaign.failedCount),
    pending: share(campaign.pendingCount),
  };
}
