'use client';

// 모바일 카드 목록 — 제목 + 상태, 메타 한 줄, 결과 (Figma 2183:679)
import Link from 'next/link';

import type { PushCampaign } from '@/features/push-campaign/api/push-campaign';
import {
  isPushInFlight,
  pushAudienceLabel,
  pushScheduleLabel,
} from '@/features/push-campaign/model/push-campaign-label';

import { CampaignResult, CampaignStatus } from './CampaignCells';

export function CampaignCardList({ items }: { items: PushCampaign[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((campaign) => {
        const audience = pushAudienceLabel(campaign);
        const showResult =
          campaign.status === 'COMPLETED' || isPushInFlight(campaign.status);
        return (
          <li key={campaign.id} className="rounded-2xl bg-card">
            <Link
              href={`/push-campaigns/${campaign.id}`}
              className="flex flex-col gap-1.5 px-4 py-3.5"
            >
              <span className="flex items-start gap-2">
                <span className="flex-1 text-[14px] font-medium text-strong">
                  {campaign.title}
                </span>
                <CampaignStatus campaign={campaign} className="shrink-0" />
              </span>
              <span className="text-[12px] text-subtle">
                {audience.kind} {audience.detail} ·{' '}
                {pushScheduleLabel(campaign)}
              </span>
              {showResult && <CampaignResult campaign={campaign} />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
