'use client';

// 캠페인 조회 훅 — 목록 한 장·다음 예약·상세·예상 대상. 목록·상세·편집기가 같은 키를 쓰고, 변경 뮤테이션이 'push-campaigns'를 통째로 무효화한다
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  fetchPushAudiencePreview,
  fetchPushCampaign,
  fetchPushCampaignPage,
  type PushCampaignStatus,
} from '../api/push-campaign';

export const PUSH_CAMPAIGNS_KEY = ['push-campaigns'] as const;

/** 발송이 끝나지 않은 상태 — 상세를 열어 두면 이 동안만 주기적으로 다시 읽는다 */
const IN_FLIGHT: ReadonlySet<PushCampaignStatus> = new Set([
  'PENDING',
  'SCHEDULE_PENDING',
  'QUEUED',
  'SENDING',
]);
const IN_FLIGHT_REFETCH_MS = 10_000;

export interface PushCampaignPageParams {
  scheduled?: boolean;
  status?: PushCampaignStatus;
  page: number;
  size: number;
}

export function usePushCampaignPageQuery(params: PushCampaignPageParams) {
  return useQuery({
    queryKey: [...PUSH_CAMPAIGNS_KEY, 'page', params] as const,
    queryFn: () => {
      const query = new URLSearchParams({
        page: String(params.page),
        size: String(params.size),
      });
      if (params.scheduled !== undefined)
        query.set('scheduled', String(params.scheduled));
      if (params.status) query.set('status', params.status);
      return fetchPushCampaignPage(query);
    },
    placeholderData: keepPreviousData,
  });
}

/** 목록 위 "다음 발송" 배너 — 예약된 것 중 첫 항목만. 없으면 배너를 그리지 않는다 */
export function useNextScheduledCampaignQuery() {
  return useQuery({
    queryKey: [...PUSH_CAMPAIGNS_KEY, 'next-scheduled'] as const,
    queryFn: async () => {
      const page = await fetchPushCampaignPage(
        new URLSearchParams({
          scheduled: 'true',
          status: 'SCHEDULED',
          page: '0',
          size: '1',
        }),
      );
      return page.items[0] ?? null;
    },
  });
}

export function usePushCampaignQuery(campaignId: string) {
  return useQuery({
    queryKey: [...PUSH_CAMPAIGNS_KEY, 'detail', campaignId] as const,
    queryFn: () => fetchPushCampaign(campaignId),
    refetchInterval: (query) =>
      query.state.data && IN_FLIGHT.has(query.state.data.status)
        ? IN_FLIGHT_REFETCH_MS
        : false,
  });
}

/** 예상 대상은 저장된 캠페인에만 있다 — 편집 중엔 화면이 직접 합산한다 */
export function usePushAudiencePreviewQuery(campaignId: string | undefined) {
  return useQuery({
    queryKey: [...PUSH_CAMPAIGNS_KEY, 'preview', campaignId] as const,
    queryFn: () => fetchPushAudiencePreview(campaignId!),
    enabled: Boolean(campaignId),
  });
}
