// 대상 카드 — 초안·예약은 예상 대상 타일, 그리고 저장된 대상 구성(SQL·직접 선택·제외) (Figma 2177:354)
import type {
  PushAudiencePreview,
  PushCampaign,
} from '@/features/push-campaign/api/push-campaign';
import { idsSummary } from '@/features/push-campaign/model/audience-source-label';
import { cn } from '@/shared/lib/cn';

const count = (n: number) => n.toLocaleString('ko-KR');

interface AudienceCardProps {
  campaign: PushCampaign;
  /** 발송 전에만 있다 — 시작 뒤엔 결과 카드가 고정된 수를 보여 준다 */
  preview?: PushAudiencePreview;
}

export function AudienceCard({ campaign, preview }: AudienceCardProps) {
  const selected = campaign.audienceType === 'SELECTED';
  const rows = selected
    ? [
        campaign.audienceSql && {
          label: 'SQL',
          count: '발송 시 조회',
          detail: campaign.audienceSql.trim().split('\n')[0] ?? '',
          mono: true,
        },
        campaign.userProfileIds.length > 0 && {
          label: '직접 선택',
          count: `${count(campaign.userProfileIds.length)}명`,
          detail: idsSummary(campaign.userProfileIds),
        },
        campaign.excludedUserProfileIds.length > 0 && {
          label: '제외',
          count: `${count(campaign.excludedUserProfileIds.length)}명`,
          detail: idsSummary(campaign.excludedUserProfileIds),
          danger: true,
        },
      ].filter((row) => row !== false && row !== null && row !== '')
    : [];

  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">
        {preview ? '예상 대상' : '대상'}
      </h2>

      {preview && (
        <div className="flex flex-wrap gap-2.5">
          <Tile
            label="예상 대상"
            value={`${count(preview.estimatedUserCount)}명`}
          />
          <Tile
            label="활성 기기"
            value={`${count(preview.estimatedTokenCount)}개`}
          />
          <Tile
            label="대상 유형"
            value={selected ? '선택' : '전체'}
            sub={campaign.audienceSql ? '발송 시 SQL 재조회' : undefined}
          />
        </div>
      )}

      {selected ? (
        <ul className="flex flex-col gap-0.5">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 hover:bg-hairline"
            >
              <span className="w-[72px] shrink-0 text-[13px] font-medium text-strong">
                {row.label}
              </span>
              <span
                className={cn(
                  'w-[88px] shrink-0 text-[13px] font-medium',
                  row.danger ? 'text-destructive' : 'text-primary',
                )}
              >
                {row.count}
              </span>
              <span
                className={cn(
                  'min-w-px flex-1 truncate text-[12px] text-subtle',
                  row.mono && 'font-mono',
                )}
              >
                {row.detail}
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

function Tile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex min-w-[120px] flex-1 flex-col gap-1 rounded-[12px] bg-background px-4 py-3.5">
      <span className="text-[12px] font-medium text-subtle">{label}</span>
      <span className="text-[22px] leading-[1.2] font-bold text-strong">
        {value}
      </span>
      {sub && <span className="text-[11px] text-subtle">{sub}</span>}
    </div>
  );
}
