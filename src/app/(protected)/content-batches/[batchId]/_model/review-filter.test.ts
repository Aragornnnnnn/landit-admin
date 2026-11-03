import { describe, expect, it } from 'vitest';

import type { ContentDaySummary } from '@/features/content/api/content-batch';

import {
  countReviewFilters,
  defaultReviewFilter,
  matchesReviewFilter,
  readReviewFilter,
  REVIEW_FILTER_LABEL,
} from './review-filter';

const day = (
  draftId: number,
  status: ContentDaySummary['status'],
): ContentDaySummary => ({
  draftId,
  plannedDay: 300 + draftId,
  status,
  title: null,
  errorMessage: null,
});

describe('readReviewFilter', () => {
  it('모르는 값이나 빈 값은 기본 필터로 본다', () => {
    expect(readReviewFilter(new URLSearchParams(''), 0)).toBe('ALL');
    expect(readReviewFilter(new URLSearchParams('filter=NOPE'), 0)).toBe('ALL');
    expect(readReviewFilter(new URLSearchParams('filter=OK'), 0)).toBe('OK');
  });

  it('주소에 필터가 없고 다시 볼 것이 있으면 그것부터 보여 준다', () => {
    expect(defaultReviewFilter(2)).toBe('REVISIT');
    expect(defaultReviewFilter(0)).toBe('ALL');
    expect(readReviewFilter(new URLSearchParams(''), 2)).toBe('REVISIT');
  });
});

describe('matchesReviewFilter', () => {
  it.each([
    ['ALL', 'GENERATING', false, true],
    ['UNREVIEWED', 'REVIEW_READY', false, true],
    ['UNREVIEWED', 'OK', false, false],
    ['NEEDS_FIX', 'NEEDS_FIX', false, true],
    ['OK', 'OK', false, true],
    ['OK', 'APPROVED', false, true],
    ['REVISIT', 'OK', true, true],
    ['REVISIT', 'OK', false, false],
  ] as const)(
    '%s 필터 · %s · 다시 볼 것 %s → %s',
    (filter, status, revisit, expected) => {
      expect(matchesReviewFilter(filter, status, revisit)).toBe(expected);
    },
  );
});

describe('countReviewFilters', () => {
  it('칩마다 해당하는 Day 수를 센다', () => {
    const days = [
      day(1, 'OK'),
      day(2, 'NEEDS_FIX'),
      day(3, 'REVIEW_READY'),
      day(4, 'GENERATING'),
    ];
    const revisit = new Set([1]);

    expect(countReviewFilters(days, revisit)).toEqual({
      REVISIT: 1,
      ALL: 4,
      UNREVIEWED: 1,
      NEEDS_FIX: 1,
      OK: 1,
    });
    expect(Object.keys(REVIEW_FILTER_LABEL)).toEqual([
      'REVISIT',
      'ALL',
      'UNREVIEWED',
      'NEEDS_FIX',
      'OK',
    ]);
  });
});
