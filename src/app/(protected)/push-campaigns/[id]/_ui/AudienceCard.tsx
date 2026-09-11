// 대상 카드 — 초안·예약은 예상 대상 타일, 그리고 저장된 대상 구성(SQL·직접 선택·제외) (Figma 2177:354)
import type {
  PushAudiencePreview,
  PushCampaign,
} from '@/features/push-campaign/api/push-campaign';
import {
  audienceSources,
  toAudienceDraft,
} from '@/features/push-campaign/model/audience';
import {
  AUDIENCE_SOURCE_LABEL,
  audienceSourceSummary,
} from '@/features/push-campaign/model/audience-source-label';
import { cn } from '@/shared/lib/cn';
import { formatCount } from '@/shared/lib/format-count';

import { StatTile } from './StatTile';

interface AudienceCardProps {
  campaign: PushCampaign;
  /** 발송 전에만 있다 — 시작 뒤엔 결과 카드가 고정된 수를 보여 준다 */
  preview?: PushAudiencePreview;
}

export function AudienceCard({ campaign, preview }: AudienceCardProps) {
  const selected = campaign.audienceType === 'SELECTED';
  const draft = toAudienceDraft(campaign);

  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">
        {preview ? '예상 대상' : '대상'}
      </h2>

      {preview && (
        <div className="flex flex-wrap gap-2.5">
          <StatTile
            label="예상 대상"
            value={`${formatCount(preview.estimatedUserCount)}명`}
          />
          <StatTile
            label="활성 기기"
            value={`${formatCount(preview.estimatedTokenCount)}개`}
          />
          <StatTile
            label="대상 유형"
            value={selected ? '선택' : '전체'}
            sub={campaign.audienceSql ? '발송 시 SQL 재조회' : undefined}
          />
        </div>
      )}

      {selected ? (
        <ul className="flex flex-col gap-0.5">
          {audienceSources(draft).map(({ kind, count }) => (
            <li
              key={kind}
              className="flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 hover:bg-hairline"
            >
              <span className="w-[72px] shrink-0 text-[13px] font-medium text-strong">
                {AUDIENCE_SOURCE_LABEL[kind]}
              </span>
              <span
                className={cn(
                  'w-[88px] shrink-0 text-[13px] font-medium',
                  kind === 'excluded' ? 'text-destructive' : 'text-primary',
                )}
              >
                {/* SQL은 문장만 저장돼 발송 시 다시 조회된다 — 지금은 인원을 모른다 */}
                {kind === 'sql' ? '발송 시 조회' : `${formatCount(count)}명`}
              </span>
              <span
                className={cn(
                  'min-w-px flex-1 truncate text-[12px] text-subtle',
                  kind === 'sql' && 'font-mono',
                )}
              >
                {audienceSourceSummary(draft, kind)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-body">전체 사용자</p>
      )}
    </section>
  );
}
