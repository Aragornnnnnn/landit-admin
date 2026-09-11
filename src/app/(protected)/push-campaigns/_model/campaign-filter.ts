// 목록 필터 ↔ 쿼리스트링 ↔ BE 파라미터 — 탭·상태·페이지. 새로고침·공유에 살아남게 URL이 진실이다 (docs/screens/push-campaigns.md "목록")
import type { PushCampaignStatus } from '@/features/push-campaign/api/push-campaign';
import type { PushCampaignPageParams } from '@/features/push-campaign/model/usePushCampaignQuery';

/** 상단 탭 — 예약은 예약 시각 유무, 발송됨·초안은 상태 하나로 정해진다 */
export type CampaignTab = 'ALL' | 'SCHEDULED' | 'SENT' | 'DRAFT';

export interface CampaignFilter {
  tab: CampaignTab;
  /** 상태 Select — 없으면 전체 */
  status?: PushCampaignStatus;
  /** 0부터 — BE 페이지 */
  page: number;
}

export const DEFAULT_CAMPAIGN_FILTER: CampaignFilter = { tab: 'ALL', page: 0 };
export const CAMPAIGN_PAGE_SIZE = 20;

export const CAMPAIGN_TABS: { value: CampaignTab; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'SCHEDULED', label: '예약' },
  { value: 'SENT', label: '발송됨' },
  { value: 'DRAFT', label: '초안' },
];

/** Select 선택지 — BE 상태 하나씩. PENDING·QUEUED는 운영자가 고를 이유가 없어 SENDING만 "발송 중"으로 둔다 */
export const CAMPAIGN_STATUS_OPTIONS: {
  value: PushCampaignStatus | 'ALL';
  label: string;
}[] = [
  { value: 'ALL', label: '상태: 전체' },
  { value: 'DRAFT', label: '초안' },
  { value: 'SCHEDULED', label: '예약됨' },
  { value: 'SENDING', label: '발송 중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'CANCELLED', label: '취소됨' },
];

const TABS = CAMPAIGN_TABS.map((tab) => tab.value);
const STATUSES: PushCampaignStatus[] = [
  'DRAFT',
  'PENDING',
  'SCHEDULE_PENDING',
  'SCHEDULED',
  'QUEUED',
  'SENDING',
  'COMPLETED',
  'CANCELLED',
];

/** 탭이 상태를 이미 정하는 경우 — Select를 잠근다(둘이 충돌하면 어느 쪽이 이기는지 알 수 없다) */
const TAB_STATUS: Partial<Record<CampaignTab, PushCampaignStatus>> = {
  SENT: 'COMPLETED',
  DRAFT: 'DRAFT',
};

export function readCampaignFilter(
  params: ReadonlyURLSearchParamsLike,
): CampaignFilter {
  const tab = params.get('tab') ?? '';
  const status = params.get('status') ?? '';
  const page = Number(params.get('page'));
  return {
    tab: TABS.includes(tab as CampaignTab) ? (tab as CampaignTab) : 'ALL',
    status: STATUSES.includes(status as PushCampaignStatus)
      ? (status as PushCampaignStatus)
      : undefined,
    page: Number.isInteger(page) && page > 0 ? page : 0,
  };
}

/** 기본값은 적지 않는다 — 주소가 짧을수록 공유·비교가 쉽다 */
export function writeCampaignFilter(filter: CampaignFilter): string {
  const params = new URLSearchParams();
  if (filter.tab !== 'ALL') params.set('tab', filter.tab);
  if (filter.status) params.set('status', filter.status);
  if (filter.page > 0) params.set('page', String(filter.page));
  return params.toString();
}

/** 조건을 바꾸면 첫 페이지로 — 3페이지를 보다 조건을 바꾸면 결과가 3페이지보다 적을 수 있다 */
export function changeCampaignFilter(
  filter: CampaignFilter,
  patch: Partial<CampaignFilter>,
): CampaignFilter {
  const onlyPage = Object.keys(patch).length === 1 && patch.page !== undefined;
  return { ...filter, ...patch, page: onlyPage ? patch.page! : 0 };
}

export function campaignPageParams(
  filter: CampaignFilter,
): PushCampaignPageParams {
  return {
    scheduled: filter.tab === 'SCHEDULED' ? true : undefined,
    status: TAB_STATUS[filter.tab] ?? filter.status,
    page: filter.page,
    size: CAMPAIGN_PAGE_SIZE,
  };
}

export const isStatusSelectDisabled = (tab: CampaignTab) =>
  TAB_STATUS[tab] !== undefined;

/** 빈 상태 문구 — 원래 없는지, 조건 때문에 없는지 가른다 */
export function campaignEmptyLabel(filter: CampaignFilter): string {
  if (filter.status && !TAB_STATUS[filter.tab])
    return '조건에 맞는 푸시가 없어요';
  switch (filter.tab) {
    case 'SCHEDULED':
      return '예약된 푸시가 없어요';
    case 'SENT':
      return '발송한 푸시가 없어요';
    case 'DRAFT':
      return '초안이 없어요';
    default:
      return '아직 보낸 푸시가 없어요';
  }
}

interface ReadonlyURLSearchParamsLike {
  get(key: string): string | null;
}
