'use client';

// 배치 상세 조립 — 배치를 읽어 라인업 단계면 라인업 확인(LAN-811), 그 뒤면 Day 목록(LAN-812 전까지 1차 화면)을 고른다
import { useRouter } from 'next/navigation';

import { isLineupStage } from '@/features/content/model/content-actions';
import { useContentBatchQuery } from '@/features/content/model/useContentQuery';
import { DesktopOnly } from '@/features/content/ui/DesktopOnly';
import { ApiError } from '@/shared/api/api-error';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import { ContentBatchesPage } from '../../_ui/ContentBatchesPage';
import { LineupStage } from './lineup/LineupStage';

export function BatchDetailPage({ batchId }: { batchId: number }) {
  const router = useRouter();
  const batch = useContentBatchQuery(batchId);

  if (batch.isPending) return <ListSkeleton rows={5} className="pt-4" />;
  if (batch.isError) {
    // 첫 라인업이 끝까지 실패하면 BE가 배치를 지운다 — 폴링 중 404가 되면 목록으로 돌아갈 길을 준다
    const notFound =
      batch.error instanceof ApiError && batch.error.status === 404;
    return (
      <InlineError
        message={
          notFound ? '배치를 찾을 수 없어요' : '배치를 불러오지 못했어요'
        }
        onRetry={
          notFound
            ? () => router.replace('/content-batches')
            : () => batch.refetch()
        }
      />
    );
  }
  if (!isLineupStage(batch.data.batch.status))
    return <ContentBatchesPage batchId={batchId} />;
  return (
    <DesktopOnly>
      <LineupStage key={batch.data.batch.updatedAt} detail={batch.data} />
    </DesktopOnly>
  );
}
