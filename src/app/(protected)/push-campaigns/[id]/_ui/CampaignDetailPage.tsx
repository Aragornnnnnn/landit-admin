'use client';

// 캠페인 상세 조립 — 상단 액션 · 예상 대상/발송 결과 · 내용 · 대상 · 미리보기 · 진행 (Figma 2177:354 · 2177:423).
// 지금 발송·예약·예약 취소 확인창은 다음 PR에서 붙는다 — 여기선 테스트 발송과 "같은 내용으로 새 푸시"만
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import {
  newIdempotencyKey,
  type PushCampaign,
} from '@/features/push-campaign/api/push-campaign';
import {
  isPushInFlight,
  PUSH_STATUS_DOT,
  PUSH_STATUS_LABEL,
} from '@/features/push-campaign/model/push-campaign-label';
import { formatKst } from '@/features/push-campaign/model/schedule-time';
import { usePushCampaignActionMutation } from '@/features/push-campaign/model/usePushCampaignMutation';
import {
  usePushAudiencePreviewQuery,
  usePushCampaignQuery,
} from '@/features/push-campaign/model/usePushCampaignQuery';
import { ApiError } from '@/shared/api/api-error';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Button } from '@/shared/ui/shadcn/button';
import { StatusChip } from '@/shared/ui/StatusChip';

import { campaignTimeline } from '../_model/detail-label';
import { PushPreview } from '../../_ui/PushPreview';
import { AudienceCard } from './AudienceCard';
import { ResultCard } from './ResultCard';
import { TimelineCard } from './TimelineCard';

export function CampaignDetailPage({ campaignId }: { campaignId: string }) {
  const campaign = usePushCampaignQuery(campaignId);

  if (campaign.isPending) return <ListSkeleton rows={5} className="pt-4" />;
  if (campaign.isError) {
    const notFound =
      campaign.error instanceof ApiError && campaign.error.status === 404;
    return (
      <InlineError
        message={
          notFound ? '캠페인을 찾을 수 없어요' : '캠페인을 불러오지 못했어요'
        }
        onRetry={notFound ? undefined : () => campaign.refetch()}
      />
    );
  }
  return <Detail campaign={campaign.data} />;
}

function Detail({ campaign }: { campaign: PushCampaign }) {
  const beforeSend =
    campaign.status === 'DRAFT' ||
    campaign.status === 'SCHEDULED' ||
    campaign.status === 'SCHEDULE_PENDING';
  const preview = usePushAudiencePreviewQuery(
    beforeSend ? campaign.id : undefined,
  );
  const dot = PUSH_STATUS_DOT[campaign.status];

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/push-campaigns"
          className="flex items-center gap-1.5 text-[13px] text-body hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          목록
        </Link>
        <StatusChip
          dot={dot === 'done' ? 'done' : dot ? 'progress' : undefined}
        >
          {PUSH_STATUS_LABEL[campaign.status]}
        </StatusChip>
        <span className="text-[13px] text-subtle">
          #{campaign.createdBy} · {formatKst(campaign.createdAt)}
        </span>
        <span className="ml-auto flex flex-wrap items-center gap-2">
          <Actions campaign={campaign} />
        </span>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <div className="flex flex-1 flex-col gap-4">
          {beforeSend ? (
            <AudienceCard campaign={campaign} preview={preview.data} />
          ) : (
            <ResultCard campaign={campaign} />
          )}
          <ContentCard campaign={campaign} />
          {!beforeSend && <AudienceCard campaign={campaign} />}
        </div>
        <div className="flex w-full flex-col gap-4 xl:w-[340px] xl:shrink-0">
          <PushPreview
            title={campaign.title}
            body={campaign.body}
            className="hidden xl:flex"
          />
          <TimelineCard steps={campaignTimeline(campaign)} />
        </div>
      </div>
    </div>
  );
}

// 상태별 액션 — 초안: 테스트 발송(+ 다음 PR의 발송·예약) · 끝난 캠페인: 같은 내용으로 새 푸시
function Actions({ campaign }: { campaign: PushCampaign }) {
  const action = usePushCampaignActionMutation();
  // 같은 클릭의 재시도는 같은 키 — 성공하면 다음 테스트를 위해 새 키를 쓴다
  const [testKey, setTestKey] = useState<string | null>(null);

  if (campaign.status === 'DRAFT') {
    return (
      <Button
        variant="outline"
        disabled={action.isPending}
        onClick={() => {
          const key = testKey ?? newIdempotencyKey();
          setTestKey(key);
          action.mutate(
            { campaignId: campaign.id, action: { type: 'test', key } },
            { onSuccess: () => setTestKey(null) },
          );
        }}
        className="h-10 px-4 text-[14px]"
      >
        내게 테스트 발송
      </Button>
    );
  }
  if (isPushInFlight(campaign.status)) return null;
  return (
    <Button asChild variant="outline" className="h-10 px-4 text-[14px]">
      <Link href={`/push-campaigns/new?from=${campaign.id}`}>
        같은 내용으로 새 푸시
      </Link>
    </Button>
  );
}

function ContentCard({ campaign }: { campaign: PushCampaign }) {
  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">내용</h2>
      <Row label="제목">{campaign.title}</Row>
      <Row label="본문">{campaign.body}</Row>
      <Row label="딥 링크">
        <span className="font-mono break-all">{campaign.deepLink}</span>
      </Row>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-[72px] shrink-0 pt-px text-[12px] font-medium text-subtle">
        {label}
      </span>
      <span className="min-w-px flex-1 text-[13px] leading-[1.5] text-strong">
        {children}
      </span>
    </div>
  );
}
