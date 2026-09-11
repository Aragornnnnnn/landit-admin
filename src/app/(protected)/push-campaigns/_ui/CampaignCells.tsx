// 표와 모바일 카드가 같이 쓰는 셀 — 상태(점+라벨) · 결과(진행 바 또는 성공·실패). 같은 캠페인은 어디서 봐도 같은 말이어야 한다
import type { PushCampaign } from '@/features/push-campaign/api/push-campaign';
import {
  isPushInFlight,
  PUSH_STATUS_DOT,
  PUSH_STATUS_LABEL,
  pushProgressRatio,
  type PushStatusDot,
} from '@/features/push-campaign/model/push-campaign-label';
import { cn } from '@/shared/lib/cn';

// 예약은 기다리는 상태(검정), 발송 중은 진행 중(오렌지), 완료는 끝난 일(초록) — docs/screens/push-campaigns.md "상태 배지"
const DOT_COLOR: Record<PushStatusDot, string> = {
  scheduled: 'bg-strong',
  progress: 'bg-primary',
  done: 'bg-success',
};

const count = (n: number) => n.toLocaleString('ko-KR');

export function CampaignStatus({
  campaign,
  className,
}: {
  campaign: PushCampaign;
  className?: string;
}) {
  const dot = PUSH_STATUS_DOT[campaign.status];
  const inFlight = isPushInFlight(campaign.status);
  return (
    <span className={cn('flex items-center gap-[5px]', className)}>
      {dot && (
        <span
          aria-hidden
          className={cn('size-1.5 shrink-0 rounded-full', DOT_COLOR[dot])}
        />
      )}
      <span
        className={cn(
          'text-[13px]',
          inFlight ? 'font-medium text-primary' : 'text-body',
          !dot && 'text-subtle',
        )}
      >
        {PUSH_STATUS_LABEL[campaign.status]}
      </span>
    </span>
  );
}

/** 발송 중은 진행 바 + "62% · 5,820", 완료는 "성공 9,102 · 실패 44". 그 밖은 — */
export function CampaignResult({
  campaign,
  className,
}: {
  campaign: PushCampaign;
  className?: string;
}) {
  if (isPushInFlight(campaign.status) && campaign.targetTokenCount > 0) {
    const ratio = pushProgressRatio(campaign);
    const processed = campaign.succeededCount + campaign.failedCount;
    return (
      <span className={cn('flex items-center gap-2.5', className)}>
        <span
          aria-hidden
          className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-hairline"
        >
          <span
            className="block h-full rounded-full bg-primary"
            style={{ width: `${Math.round(ratio * 100)}%` }}
          />
        </span>
        <span className="text-[12px] font-medium text-primary">
          {Math.round(ratio * 100)}% · {count(processed)}
        </span>
      </span>
    );
  }
  if (campaign.status === 'COMPLETED') {
    return (
      <span className={cn('flex items-center gap-1 text-[13px]', className)}>
        <span className="text-strong">
          성공 {count(campaign.succeededCount)}
        </span>
        <span className="text-subtle">·</span>
        <span
          className={
            campaign.failedCount > 0 ? 'text-destructive' : 'text-subtle'
          }
        >
          실패 {count(campaign.failedCount)}
        </span>
      </span>
    );
  }
  return <span className={cn('text-[13px] text-subtle', className)}>—</span>;
}
