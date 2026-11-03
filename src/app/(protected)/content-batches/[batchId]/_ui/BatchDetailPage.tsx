'use client';

// 배치 상세 조립 — 배치를 읽어 라인업 단계면 라인업 확인, 그 뒤면 Day 목록을 고른다
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { isLineupStage } from '@/features/content/model/content-actions';
import { useContentBatchQuery } from '@/features/content/model/useContentQuery';
import { DesktopOnly } from '@/features/content/ui/DesktopOnly';
import { ApiError } from '@/shared/api/api-error';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import { DaysStage } from './days/DaysStage';
import { LineupStage } from './lineup/LineupStage';

export function BatchDetailPage({ batchId }: { batchId: number }) {
  const router = useRouter();
  const batch = useContentBatchQuery(batchId);

  // 첫 라인업이 끝까지 실패하면 BE가 배치를 지운다 — 폴링 중 404가 되면 알리고 목록으로 보낸다 (스펙 "상태")
  const notFound =
    batch.isError &&
    batch.error instanceof ApiError &&
    batch.error.status === 404;
  useEffect(() => {
    if (!notFound) return;
    toast.error('배치를 찾을 수 없어요');
    router.replace('/content-batches');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- router는 렌더마다 새 객체일 수 있어 넣으면 토스트가 반복된다
  }, [notFound]);

  if (batch.isPending || notFound)
    return <ListSkeleton rows={5} className="pt-4" />;
  if (batch.isError)
    return (
      <InlineError
        message="배치를 불러오지 못했어요"
        onRetry={() => batch.refetch()}
      />
    );
  return (
    <DesktopOnly>
      {isLineupStage(batch.data.batch.status) ? (
        <LineupStage key={batch.data.batch.updatedAt} detail={batch.data} />
      ) : (
        // 폴링 시각을 넘긴다 — 멈춘 배치는 같은 응답이 와서 데이터가 안 바뀌어도 16분 판정은 매 폴링 새로 해야 한다
        <DaysStage detail={batch.data} polledAt={batch.dataUpdatedAt} />
      )}
    </DesktopOnly>
  );
}
