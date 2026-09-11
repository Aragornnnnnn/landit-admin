'use client';

// 새 푸시 진입 — 빈 초안으로 시작하거나, ?from={id}의 캠페인을 읽어 채운 초안으로 시작한다
import { useSearchParams } from 'next/navigation';

import { usePushCampaignQuery } from '@/features/push-campaign/model/usePushCampaignQuery';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import { fromCampaign } from '../_model/campaign-draft';
import { CampaignEditor } from './CampaignEditor';

export function NewCampaignPage() {
  const from = useSearchParams().get('from') ?? undefined;
  const source = usePushCampaignQuery(from);

  if (!from) return <CampaignEditor />;
  if (source.isPending) return <ListSkeleton rows={4} className="pt-6" />;
  if (source.isError)
    return (
      <InlineError
        message="원본 캠페인을 불러오지 못했어요"
        onRetry={() => source.refetch()}
      />
    );
  // 원본이 도착한 뒤에 마운트한다 — 초안의 초기값이 곧 원본이 되게
  return <CampaignEditor key={from} initial={fromCampaign(source.data)} />;
}
