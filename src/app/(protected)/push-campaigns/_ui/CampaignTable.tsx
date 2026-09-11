'use client';

// 데스크톱 표 — 흰 카드, 행 구분은 hover만 (Figma 2176:275 · admin-spec "목록 행 다듬기"). 행 전체가 상세 링크다
import Link from 'next/link';

import type { PushCampaign } from '@/features/push-campaign/api/push-campaign';
import {
  pushAudienceLabel,
  pushScheduleLabel,
} from '@/features/push-campaign/model/push-campaign-label';
import { formatKst } from '@/features/push-campaign/model/schedule-time';
import { cn } from '@/shared/lib/cn';

import { CampaignResult, CampaignStatus } from './CampaignCells';

// Figma 셀 너비 — 제목 flex / 대상 130 / 상태 100 / 발송·예약 130 / 결과 170 / 생성 90
const CELL = {
  title: 'flex-1 min-w-px',
  audience: 'w-[130px] shrink-0',
  status: 'w-[100px] shrink-0',
  schedule: 'w-[130px] shrink-0',
  result: 'w-[170px] shrink-0',
  createdAt: 'w-[90px] shrink-0',
};

interface CampaignTableProps {
  items: PushCampaign[];
  totalCount: number;
}

export function CampaignTable({ items, totalCount }: CampaignTableProps) {
  return (
    <section className="w-full rounded-[20px] bg-card pt-5 pb-1">
      <header className="flex items-baseline gap-2 px-5">
        <h2 className="text-[16px] font-bold text-strong">캠페인</h2>
        <span className="text-[13px] text-subtle">{totalCount}</span>
      </header>
      <div className="w-full overflow-x-auto px-1">
        <div className="min-w-[900px]">
          <div
            role="row"
            className="flex w-full items-center gap-4 px-5 pt-3 pb-2 text-xs font-medium text-subtle"
          >
            <span className={CELL.title}>제목</span>
            <span className={CELL.audience}>대상</span>
            <span className={CELL.status}>상태</span>
            <span className={CELL.schedule}>발송·예약</span>
            <span className={CELL.result}>결과</span>
            <span className={CELL.createdAt}>생성</span>
          </div>

          <div className="flex flex-col gap-0.5">
            {items.map((campaign) => {
              const audience = pushAudienceLabel(campaign);
              return (
                <Link
                  key={campaign.id}
                  href={`/push-campaigns/${campaign.id}`}
                  className="flex w-full items-center gap-4 rounded-lg px-5 py-3 transition-colors hover:bg-hairline"
                >
                  <span
                    className={cn(
                      CELL.title,
                      'truncate text-[14px] font-medium text-strong',
                    )}
                  >
                    {campaign.title}
                  </span>
                  <span
                    className={cn(CELL.audience, 'flex items-baseline gap-1.5')}
                  >
                    <span className="text-[13px] text-strong">
                      {audience.kind}
                    </span>
                    <span className="truncate text-[12px] text-subtle">
                      {audience.detail}
                    </span>
                  </span>
                  <CampaignStatus campaign={campaign} className={CELL.status} />
                  <span className={cn(CELL.schedule, 'text-[13px] text-body')}>
                    {pushScheduleLabel(campaign)}
                  </span>
                  <CampaignResult campaign={campaign} className={CELL.result} />
                  <span
                    className={cn(CELL.createdAt, 'text-[13px] text-subtle')}
                  >
                    {formatKst(campaign.createdAt)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
