import { describe, expect, it } from 'vitest';

import type { ContentBatch } from '@/features/content/api/content-batch';

import {
  batchEmptyLabel,
  changeBatchFilter,
  DEFAULT_BATCH_FILTER,
  filterBatches,
  readBatchFilter,
  writeBatchFilter,
} from './batch-filter';

const batch = (batchId: number, status: ContentBatch['status']) =>
  ({ batchId, status }) as ContentBatch;

describe('readBatchFilter · writeBatchFilter', () => {
  it('빈 주소는 기본값, 모르는 상태·음수 페이지는 버린다', () => {
    expect(readBatchFilter(new URLSearchParams(''))).toEqual(
      DEFAULT_BATCH_FILTER,
    );
    expect(readBatchFilter(new URLSearchParams('status=NOPE&page=-2'))).toEqual(
      DEFAULT_BATCH_FILTER,
    );
  });

  it('읽기와 쓰기가 서로를 되돌리고 기본값은 적지 않는다', () => {
    const filter = { status: 'FAILED', page: 2 } as const;
    const query = writeBatchFilter(filter);

    expect(query).toBe('status=FAILED&page=2');
    expect(readBatchFilter(new URLSearchParams(query))).toEqual(filter);
    expect(writeBatchFilter(DEFAULT_BATCH_FILTER)).toBe('');
  });

  it('2차 에셋 상태도 필터로 읽는다', () => {
    expect(
      readBatchFilter(new URLSearchParams('status=ASSETS_REVIEW_READY')).status,
    ).toBe('ASSETS_REVIEW_READY');
  });
});

describe('changeBatchFilter', () => {
  it('상태를 바꾸면 첫 페이지로 돌아간다', () => {
    expect(changeBatchFilter({ page: 3 }, { status: 'FAILED' })).toEqual({
      status: 'FAILED',
      page: 0,
    });
    expect(changeBatchFilter({ page: 3 }, { page: 4 }).page).toBe(4);
  });
});

describe('filterBatches', () => {
  const items = [
    batch(1, 'FAILED'),
    batch(2, 'REVIEW_READY'),
    batch(3, 'FAILED'),
  ];

  it('상태가 없으면 전부, 있으면 그 상태만 남긴다 (BE에 status 파라미터가 없다)', () => {
    expect(filterBatches(items, undefined)).toHaveLength(3);
    expect(filterBatches(items, 'FAILED').map((b) => b.batchId)).toEqual([
      1, 3,
    ]);
  });
});

describe('batchEmptyLabel', () => {
  it('원래 없는지, 조건 때문에 없는지 가른다', () => {
    expect(batchEmptyLabel({ page: 0 })).toBe('접수된 배치가 없어요');
    expect(batchEmptyLabel({ status: 'FAILED', page: 0 })).toBe(
      '조건에 맞는 배치가 없어요',
    );
  });
});
