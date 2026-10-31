// Day 목록의 검수 필터 칩 — 서버 status + 로컬 "다시 볼 것" 기록. 쿼리스트링 ?filter= (docs/screens/content-batches.md "Day 목록")
import type {
  ContentDaySummary,
  ContentDraftStatus,
} from '@/features/content/api/content-batch';

export type ReviewFilter =
  'REVISIT' | 'ALL' | 'UNREVIEWED' | 'NEEDS_FIX' | 'OK';

/** 칩 순서 그대로 */
export const REVIEW_FILTER_LABEL: Record<ReviewFilter, string> = {
  REVISIT: '다시 볼 것',
  ALL: '전체',
  UNREVIEWED: '미검토',
  NEEDS_FIX: '수정',
  OK: 'OK',
};

const FILTERS = Object.keys(REVIEW_FILTER_LABEL) as ReviewFilter[];

/** 검수가 끝난 상태 — 승인·발행도 OK에 포함한다 */
const DONE: ContentDraftStatus[] = ['OK', 'APPROVED', 'PUBLISHED'];

/** 다시 볼 것이 하나라도 있으면 그것부터 — 재생성 결과를 놓치지 않게 */
export function defaultReviewFilter(revisitCount: number): ReviewFilter {
  return revisitCount > 0 ? 'REVISIT' : 'ALL';
}

export function readReviewFilter(
  params: { get(key: string): string | null },
  revisitCount: number,
): ReviewFilter {
  const value = params.get('filter') ?? '';
  return FILTERS.includes(value as ReviewFilter)
    ? (value as ReviewFilter)
    : defaultReviewFilter(revisitCount);
}

export function matchesReviewFilter(
  filter: ReviewFilter,
  status: ContentDraftStatus,
  revisit: boolean,
): boolean {
  switch (filter) {
    case 'ALL':
      return true;
    case 'REVISIT':
      return revisit;
    case 'UNREVIEWED':
      return status === 'REVIEW_READY';
    case 'NEEDS_FIX':
      return status === 'NEEDS_FIX';
    case 'OK':
      return DONE.includes(status);
  }
}

export function countReviewFilters(
  days: ContentDaySummary[],
  revisit: Set<number>,
): Record<ReviewFilter, number> {
  const counts = { REVISIT: 0, ALL: 0, UNREVIEWED: 0, NEEDS_FIX: 0, OK: 0 };
  days.forEach((day) => {
    FILTERS.forEach((filter) => {
      if (matchesReviewFilter(filter, day.status, revisit.has(day.draftId)))
        counts[filter] += 1;
    });
  });
  return counts;
}
