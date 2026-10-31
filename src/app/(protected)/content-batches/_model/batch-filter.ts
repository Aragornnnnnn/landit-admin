// 목록 필터 ↔ 쿼리스트링 — 상태·페이지. BE 목록엔 status 파라미터가 없어 상태는 현재 페이지 안에서 화면이 거른다 (docs/screens/content-batches.md "배치 목록")
import type {
  ContentBatch,
  ContentBatchStatus,
} from '@/features/content/api/content-batch';
import { BATCH_STATUS_ORDER } from '@/features/content/model/content-label';

export interface BatchFilter {
  /** 없으면 전체 */
  status?: ContentBatchStatus;
  /** 0부터 — BE 페이지 */
  page: number;
}

export const DEFAULT_BATCH_FILTER: BatchFilter = { page: 0 };

export function readBatchFilter(params: {
  get(key: string): string | null;
}): BatchFilter {
  const status = params.get('status') ?? '';
  const page = Number(params.get('page'));
  return {
    status: BATCH_STATUS_ORDER.includes(status as ContentBatchStatus)
      ? (status as ContentBatchStatus)
      : undefined,
    page: Number.isInteger(page) && page > 0 ? page : 0,
  };
}

/** 기본값은 적지 않는다 — 주소가 짧을수록 공유·비교가 쉽다 */
export function writeBatchFilter(filter: BatchFilter): string {
  const params = new URLSearchParams();
  if (filter.status) params.set('status', filter.status);
  if (filter.page > 0) params.set('page', String(filter.page));
  return params.toString();
}

/** 조건을 바꾸면 첫 페이지로 */
export function changeBatchFilter(
  filter: BatchFilter,
  patch: Partial<BatchFilter>,
): BatchFilter {
  return { ...filter, ...patch, page: patch.page ?? 0 };
}

export function filterBatches(
  items: ContentBatch[],
  status: ContentBatchStatus | undefined,
): ContentBatch[] {
  return status ? items.filter((item) => item.status === status) : items;
}

/** 빈 상태 문구 — 원래 없는지, 조건 때문에 없는지 가른다. 조건은 이 페이지 안에서만 거르므로 "이 페이지에" */
export function batchEmptyLabel(filter: BatchFilter): string {
  return filter.status
    ? '이 페이지에 조건에 맞는 배치가 없어요'
    : '접수된 배치가 없어요';
}
