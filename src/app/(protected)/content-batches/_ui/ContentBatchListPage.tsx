'use client';

// 배치 목록 화면 조립 — 다음 Day 요약 · 상태 Select · 새 배치 접수 · 표 · 페이지 (Figma 4128:716 · docs/screens/content-batches.md "배치 목록")
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { ContentBatchStatus } from '@/features/content/api/content-batch';
import {
  BATCH_STATUS_LABEL,
  BATCH_STATUS_ORDER,
  formatCharacterRatio,
} from '@/features/content/model/content-label';
import {
  CONTENT_PAGE_SIZE,
  useContentBatchPageQuery,
  useContentNextDayQuery,
} from '@/features/content/model/useContentQuery';
import { DesktopOnly } from '@/features/content/ui/DesktopOnly';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Pagination } from '@/shared/ui/Pagination';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';

import {
  batchEmptyLabel,
  changeBatchFilter,
  filterBatches,
  readBatchFilter,
  writeBatchFilter,
  type BatchFilter,
} from '../_model/batch-filter';
import { BatchTable } from './BatchTable';
import { CreateBatchDialog } from './CreateBatchDialog';

export function ContentBatchListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = readBatchFilter(searchParams);
  const page = useContentBatchPageQuery(filter.page);
  const nextDay = useContentNextDayQuery();
  const [creating, setCreating] = useState(false);

  const change = (patch: Partial<BatchFilter>) => {
    const query = writeBatchFilter(changeBatchFilter(filter, patch));
    router.replace(query ? `?${query}` : '/content-batches', { scroll: false });
  };

  const items = filterBatches(page.data?.items ?? [], filter.status);
  // 목록 응답의 totalCount는 전체 수라 한 장짜리 페이지 수로 바꿔 쓴다
  const totalPages = page.data
    ? Math.ceil(page.data.totalCount / CONTENT_PAGE_SIZE)
    : 0;

  return (
    <DesktopOnly>
      <div className="flex flex-col gap-4 pt-1 pb-12">
        <div className="flex flex-wrap items-center gap-3">
          <p className="flex items-baseline gap-2 text-[13px] text-subtle">
            {nextDay.data && (
              <>
                <span className="text-[15px] font-bold text-strong">
                  다음 Day {nextDay.data.nextDay}
                </span>
                <span>
                  · 발행 시나리오 {nextDay.data.publishedScenarioCount}개 · 예약
                  중 {nextDay.data.reservedDayCount}개 · 캐릭터 누적{' '}
                  {formatCharacterRatio(nextDay.data.characterCounts)}
                </span>
              </>
            )}
          </p>
          <Select
            value={filter.status ?? 'ALL'}
            onValueChange={(value) =>
              change({
                status:
                  value === 'ALL' ? undefined : (value as ContentBatchStatus),
              })
            }
          >
            <SelectTrigger
              aria-label="상태"
              className="h-auto w-[150px] rounded-[10px] border-field-border bg-card px-3 py-2.5 text-[13px] text-strong shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-[13px]">
                상태: 전체
              </SelectItem>
              {BATCH_STATUS_ORDER.map((status) => (
                <SelectItem key={status} value={status} className="text-[13px]">
                  {BATCH_STATUS_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* 기본 비율은 캐릭터 누적으로 정한다 — 다음 Day를 받기 전엔 열지 않는다(실패했으면 누적 없이 연다) */}
          <Button
            className="ml-auto h-10 px-4 text-[14px]"
            disabled={nextDay.isPending}
            onClick={() => setCreating(true)}
          >
            새 배치 접수
          </Button>
        </div>

        {page.isPending ? (
          <ListSkeleton rows={6} />
        ) : page.isError ? (
          <InlineError
            message="배치 목록을 불러오지 못했어요"
            onRetry={() => page.refetch()}
          />
        ) : items.length === 0 ? (
          <EmptyState
            className="rounded-[20px] bg-card"
            title={batchEmptyLabel(filter)}
            action={
              filter.status ? undefined : (
                <Button onClick={() => setCreating(true)}>새 배치 접수</Button>
              )
            }
          />
        ) : (
          <BatchTable
            items={items}
            // 상태로 걸렀으면 머리의 수도 걸러진 수 — 전체 수와 표 행 수가 어긋나 보이지 않게
            totalCount={filter.status ? items.length : page.data.totalCount}
          />
        )}

        {/* 상태 필터는 이 페이지 안에서만 거른다 — 이 페이지에 0건이어도 다른 페이지로 갈 수 있어야 한다 */}
        {page.data && page.data.totalCount > 0 && (
          <Pagination
            page={filter.page}
            size={CONTENT_PAGE_SIZE}
            totalElements={page.data.totalCount}
            totalPages={totalPages}
            onChangePage={(target) => change({ page: target })}
          />
        )}

        <CreateBatchDialog
          open={creating}
          nextDay={nextDay.data}
          onClose={() => setCreating(false)}
          onCreated={(batchId) => router.push(`/content-batches/${batchId}`)}
        />
      </div>
    </DesktopOnly>
  );
}
