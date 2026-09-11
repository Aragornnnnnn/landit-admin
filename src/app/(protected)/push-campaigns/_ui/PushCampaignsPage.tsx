'use client';

// 푸시 알림 목록 화면 조립 — 탭/상태 필터 · 다음 발송 배너 · 표/카드 · 페이지 (docs/screens/push-campaigns.md "목록")
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  useNextScheduledCampaignQuery,
  usePushCampaignPageQuery,
} from '@/features/push-campaign/model/usePushCampaignQuery';
import { useIsMobile } from '@/shared/lib/use-mobile';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Pagination } from '@/shared/ui/Pagination';
import { Button } from '@/shared/ui/shadcn/button';

import {
  CAMPAIGN_PAGE_SIZE,
  campaignEmptyLabel,
  campaignPageParams,
  changeCampaignFilter,
  readCampaignFilter,
  writeCampaignFilter,
  type CampaignFilter,
} from '../_model/campaign-filter';
import { CampaignCardList } from './CampaignCardList';
import { CampaignFilters } from './CampaignFilters';
import { CampaignTable } from './CampaignTable';
import { NextScheduleBanner } from './NextScheduleBanner';

export function PushCampaignsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const filter = readCampaignFilter(searchParams);
  const page = usePushCampaignPageQuery(campaignPageParams(filter));
  const next = useNextScheduledCampaignQuery();

  const change = (patch: Partial<CampaignFilter>) => {
    const query = writeCampaignFilter(changeCampaignFilter(filter, patch));
    router.replace(query ? `?${query}` : '/push-campaigns', { scroll: false });
  };

  const items = page.data?.items ?? [];

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      {/* 모바일은 상단바에 제목만 있어 건수와 새 푸시를 콘텐츠 첫 줄에 둔다 (프레임) */}
      <div className="flex items-center gap-3 md:hidden">
        <p className="text-[13px] text-subtle">
          {page.data ? `전체 ${page.data.totalCount}개` : ''}
        </p>
        <Button asChild className="ml-auto h-9 px-3.5 text-[14px]">
          <Link href="/push-campaigns/new">새 푸시</Link>
        </Button>
      </div>

      <CampaignFilters filter={filter} onChange={change} />

      {next.data && <NextScheduleBanner campaign={next.data} />}

      {page.isPending ? (
        <ListSkeleton rows={6} />
      ) : page.isError ? (
        <InlineError
          message="푸시 목록을 불러오지 못했어요"
          onRetry={() => page.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          className="rounded-[20px] bg-card"
          title={campaignEmptyLabel(filter)}
          action={
            filter.tab === 'ALL' && !filter.status ? (
              <Button asChild>
                <Link href="/push-campaigns/new">새 푸시 만들기</Link>
              </Button>
            ) : undefined
          }
        />
      ) : isMobile ? (
        <CampaignCardList items={items} />
      ) : (
        <CampaignTable items={items} totalCount={page.data.totalCount} />
      )}

      {page.data && items.length > 0 && (
        <Pagination
          page={filter.page}
          size={CAMPAIGN_PAGE_SIZE}
          totalElements={page.data.totalCount}
          totalPages={page.data.totalPages}
          onChangePage={(target) => change({ page: target })}
        />
      )}
    </div>
  );
}
