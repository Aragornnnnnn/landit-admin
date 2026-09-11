'use client';

// "다음 발송" 배너 — 곧 나갈 예약 하나를 목록 위에 띄운다. 예약이 없으면 아무것도 그리지 않는다 (Figma 2176:275)
import { Clock } from 'lucide-react';
import Link from 'next/link';

import type { PushCampaign } from '@/features/push-campaign/api/push-campaign';
import { Button } from '@/shared/ui/shadcn/button';

import { nextScheduleLabel } from '../_model/next-schedule-label';

export function NextScheduleBanner({ campaign }: { campaign: PushCampaign }) {
  if (!campaign.scheduledAt) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-card px-4 py-3 md:gap-4 md:px-5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
        <Clock className="size-[18px]" aria-hidden />
      </span>
      <span className="flex min-w-px flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[12px] font-medium text-primary">
            다음 발송
          </span>
          <span className="truncate text-[14px] font-medium text-strong">
            {nextScheduleLabel(campaign.scheduledAt)} · {campaign.title}
          </span>
        </span>
        <span className="text-[12px] text-subtle">
          {campaign.userProfileIds.length > 0
            ? `${campaign.userProfileIds.length.toLocaleString('ko-KR')}명 선택`
            : '전체 사용자'}
          {campaign.audienceSql ? ' · SQL' : ''}
        </span>
      </span>
      <Button asChild variant="outline" className="hidden h-9 px-3.5 md:flex">
        <Link href={`/push-campaigns/${campaign.id}`}>상세 보기</Link>
      </Button>
    </div>
  );
}
