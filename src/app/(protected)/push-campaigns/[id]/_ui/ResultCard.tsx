// 발송 결과 카드 — 대상·성공·실패·대기·제외 타일과 분포 바 (Figma 2177:423). 발송 중에도 같은 카드가 채워져 간다
import type { PushCampaign } from '@/features/push-campaign/api/push-campaign';
import { cn } from '@/shared/lib/cn';
import { formatCount } from '@/shared/lib/format-count';

import { resultShares } from '../_model/detail-label';
import { StatTile } from './StatTile';

const percent = (ratio: number) => `${(ratio * 100).toFixed(1)}%`;

export function ResultCard({ campaign }: { campaign: PushCampaign }) {
  const shares = resultShares(campaign);
  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">발송 결과</h2>
      <div className="flex flex-wrap gap-2.5">
        <StatTile
          label="대상"
          value={formatCount(campaign.targetTokenCount)}
          sub={`${formatCount(campaign.targetUserCount)}명`}
        />
        <StatTile
          label="성공"
          value={formatCount(campaign.succeededCount)}
          sub={percent(shares.succeeded)}
          tone="text-success"
        />
        <StatTile
          label="실패"
          value={formatCount(campaign.failedCount)}
          sub={percent(shares.failed)}
          tone={campaign.failedCount > 0 ? 'text-destructive' : undefined}
        />
        <StatTile label="대기" value={formatCount(campaign.pendingCount)} />
        <StatTile label="제외" value={formatCount(campaign.excludedCount)} />
      </div>

      <div className="flex flex-col gap-2">
        <div
          aria-hidden
          className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-hairline"
        >
          <span
            className="bg-success"
            style={{ width: percent(shares.succeeded) }}
          />
          <span
            className="bg-destructive"
            style={{ width: percent(shares.failed) }}
          />
          <span
            className="bg-primary"
            style={{ width: percent(shares.pending) }}
          />
        </div>
        <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[12px] text-body">
          <Legend color="bg-success">
            성공 {formatCount(campaign.succeededCount)}
          </Legend>
          <Legend color="bg-destructive">
            실패 {formatCount(campaign.failedCount)}
          </Legend>
          {campaign.pendingCount > 0 && (
            <Legend color="bg-primary">
              대기 {formatCount(campaign.pendingCount)}
            </Legend>
          )}
          <Legend color="bg-hairline">
            제외 {formatCount(campaign.excludedCount)}
          </Legend>
        </div>
      </div>
    </section>
  );
}

function Legend({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span aria-hidden className={cn('size-2 rounded-full', color)} />
      {children}
    </span>
  );
}
