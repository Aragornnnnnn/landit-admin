// 목록 필터 ↔ 쿼리스트링 변환 — 새로고침·공유·뒤로가기에 필터가 살아남게 URL이 진실이다 (docs/admin-spec.md "공통 상태")
import type { Schema } from '@/shared/api/schema-patch';

export type FeedbackType = NonNullable<
  Schema<'AdminMailboxFeedbackResponse'>['type']
>;
export type FeedbackStatus = NonNullable<
  Schema<'AdminMailboxFeedbackResponse'>['status']
>;
export type FeedbackSort = 'NEWEST' | 'OLDEST';

export interface FeedbackFilter {
  keyword: string;
  /** 없으면 전체 */
  type?: FeedbackType;
  /** 없으면 전체. 기본은 처리중 — 어드민이 매일 여는 화면이라 할 일이 먼저 보여야 한다 */
  status?: FeedbackStatus;
  /** 최근 며칠. 0이면 전체 기간 */
  days: number;
  sort: FeedbackSort;
  /** 0부터 */
  page: number;
}

export const FEEDBACK_PAGE_SIZE = 20;

export const DEFAULT_FEEDBACK_FILTER: FeedbackFilter = {
  keyword: '',
  status: 'PENDING',
  days: 30,
  sort: 'NEWEST',
  page: 0,
};

const TYPES: FeedbackType[] = [
  'BUG_REPORT',
  'FEATURE_REQUEST',
  'QUESTION',
  'CHEER',
];
const STATUSES: FeedbackStatus[] = ['PENDING', 'COMPLETED'];
const DAY_OPTIONS = [7, 30, 90, 0];

/** URL 쿼리스트링을 필터로 읽는다. 모르는 값은 기본값으로 되돌린다 — 손으로 주소를 고쳐도 화면이 깨지지 않게 */
export function readFeedbackFilter(
  params: URLSearchParams | ReadonlyURLSearchParamsLike,
): FeedbackFilter {
  const get = (key: string) => params.get(key) ?? undefined;
  const type = get('type');
  const status = get('status');
  const days = Number(get('days'));
  const page = Number(get('page'));

  return {
    keyword: get('keyword') ?? '',
    type: TYPES.includes(type as FeedbackType)
      ? (type as FeedbackType)
      : undefined,
    status:
      status === 'ALL'
        ? undefined
        : STATUSES.includes(status as FeedbackStatus)
          ? (status as FeedbackStatus)
          : DEFAULT_FEEDBACK_FILTER.status,
    days: DAY_OPTIONS.includes(days) ? days : DEFAULT_FEEDBACK_FILTER.days,
    sort: get('sort') === 'OLDEST' ? 'OLDEST' : 'NEWEST',
    page: Number.isInteger(page) && page > 0 ? page : 0,
  };
}

/** 필터를 쿼리스트링으로 — 기본값은 적지 않는다. 주소가 짧을수록 공유·비교가 쉽다 */
export function writeFeedbackFilter(filter: FeedbackFilter): string {
  const params = new URLSearchParams();
  if (filter.keyword) params.set('keyword', filter.keyword);
  if (filter.type) params.set('type', filter.type);
  // 전체(undefined)는 기본값(처리중)과 다르므로 명시해야 한다
  if (filter.status !== DEFAULT_FEEDBACK_FILTER.status) {
    params.set('status', filter.status ?? 'ALL');
  }
  if (filter.days !== DEFAULT_FEEDBACK_FILTER.days) {
    params.set('days', String(filter.days));
  }
  if (filter.sort !== DEFAULT_FEEDBACK_FILTER.sort) {
    params.set('sort', filter.sort);
  }
  if (filter.page > 0) params.set('page', String(filter.page));
  return params.toString();
}

/** 필터를 바꾸면 첫 페이지로 돌아간다 — 3페이지를 보다 조건을 바꾸면 결과가 3페이지보다 적을 수 있다 */
export function changeFeedbackFilter(
  filter: FeedbackFilter,
  patch: Partial<FeedbackFilter>,
): FeedbackFilter {
  const changedOnlyPage =
    Object.keys(patch).length === 1 && patch.page !== undefined;
  return { ...filter, ...patch, page: changedOnlyPage ? patch.page! : 0 };
}

/** 기본값과 다른 조건이 하나라도 있나 — 빈 상태 문구를 "원래 없음"과 "필터 때문"으로 가르는 기준 */
export function hasActiveFeedbackFilter(filter: FeedbackFilter): boolean {
  return (
    filter.keyword !== DEFAULT_FEEDBACK_FILTER.keyword ||
    filter.type !== DEFAULT_FEEDBACK_FILTER.type ||
    filter.status !== DEFAULT_FEEDBACK_FILTER.status ||
    filter.days !== DEFAULT_FEEDBACK_FILTER.days
  );
}

/** BE 조회 파라미터로 — days는 createdFrom 시각으로 바꾼다 */
export function toFeedbackQuery(filter: FeedbackFilter, now: Date) {
  const createdFrom =
    filter.days > 0
      ? new Date(now.getTime() - filter.days * 86_400_000).toISOString()
      : undefined;
  return {
    keyword: filter.keyword || undefined,
    type: filter.type,
    status: filter.status,
    createdFrom,
    page: filter.page,
    size: FEEDBACK_PAGE_SIZE,
    sort: filter.sort,
  };
}

// next/navigation의 ReadonlyURLSearchParams를 그대로 받기 위한 최소 계약
interface ReadonlyURLSearchParamsLike {
  get(key: string): string | null;
}
