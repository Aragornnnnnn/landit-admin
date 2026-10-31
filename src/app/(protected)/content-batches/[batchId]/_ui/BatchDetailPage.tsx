'use client';

// 배치 상세 조립 — 배치를 읽어 라인업 단계면 라인업 확인(LAN-811), 그 뒤면 Day 목록(LAN-812 전까지 1차 화면)을 고른다
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
  if (!isLineupStage(batch.data.batch.status))
    return <ContentBatchesPage batchId={batchId} />;
  return (
    <DesktopOnly>
      <LineupStage key={batch.data.batch.updatedAt} detail={batch.data} />
    </DesktopOnly>
  );
}
