// 발송 결과 카드 — 대상·성공·실패·대기·제외 타일과 분포 바 (Figma 2177:423). 발송 중에도 같은 카드가 채워져 간다
import type { PushCampaign } from '@/features/push-campaign/api/push-campaign';
import { cn } from '@/shared/lib/cn';

import { resultShares } from '../_model/detail-label';

const count = (n: number) => n.toLocaleString('ko-KR');
const percent = (ratio: number) => `${(ratio * 100).toFixed(1)}%`;

export function ResultCard({ campaign }: { campaign: PushCampaign }) {
  const shares = resultShares(campaign);
  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">발송 결과</h2>
      <div className="flex flex-wrap gap-2.5">
        <Tile
          label="대상"
          value={count(campaign.targetTokenCount)}
          sub={`${count(campaign.targetUserCount)}명`}
        />
        <Tile
          label="성공"
          value={count(campaign.succeededCount)}
          sub={percent(shares.succeeded)}
          tone="text-success"
        />
        <Tile
          label="실패"
          value={count(campaign.failedCount)}
          sub={percent(shares.failed)}
          tone={campaign.failedCount > 0 ? 'text-destructive' : undefined}
        />
        <Tile label="대기" value={count(campaign.pendingCount)} />
        <Tile label="제외" value={count(campaign.excludedCount)} />
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
            성공 {count(campaign.succeededCount)}
          </Legend>
          <Legend color="bg-destructive">
            실패 {count(campaign.failedCount)}
          </Legend>
          {campaign.pendingCount > 0 && (
            <Legend color="bg-primary">
              대기 {count(campaign.pendingCount)}
            </Legend>
          )}
          <Legend color="bg-hairline">
            제외 {count(campaign.excludedCount)}
          </Legend>
        </div>
      </div>
    </section>
  );
}

function Tile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}) {
  return (
    <div className="flex min-w-[100px] flex-1 flex-col gap-1 rounded-[12px] bg-background px-4 py-3.5">
      <span className="text-[12px] font-medium text-subtle">{label}</span>
      <span
        className={cn('text-[22px] leading-[1.2] font-bold text-strong', tone)}
      >
        {value}
      </span>
      {sub && <span className="text-[11px] text-subtle">{sub}</span>}
    </div>
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
