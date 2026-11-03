'use client';

// Day 초안 상세 — Figma 안(질문 3열·참조·검증기·AI 검수·담당자 검수·재생성)은 LAN-813. 그때까지 1차 보기·검수 컴포넌트를 이 라우트에 둔다.
// 열람 기록은 여기서 남긴다 — Day 목록의 "다시 볼 것"이 이걸로 풀린다
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { markViewed } from '@/features/content/model/review-visit';
import {
  useContentBatchQuery,
  useContentDraftQuery,
} from '@/features/content/model/useContentQuery';
import { ApiError } from '@/shared/api/api-error';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import { ContentDraftView } from '../../../../_ui/ContentDraftView';
import { DraftActions } from '../../../../_ui/DraftActions';

export function DraftDetailPage({
  batchId,
  draftId,
}: {
  batchId: number;
  draftId: number;
}) {
  const batch = useContentBatchQuery(batchId);
  const draft = useContentDraftQuery(batchId, draftId);
  const status = draft.data?.status;

  // 아직 만드는 중일 때 본 건 새 결과를 본 게 아니다 — 끝난 뒤에만 기록한다
  useEffect(() => {
    if (status && status !== 'GENERATING') markViewed(draftId);
  }, [draftId, status]);

  if (draft.isPending || batch.isPending)
    return <ListSkeleton rows={5} className="pt-4" />;
  if (draft.isError || batch.isError) {
    const error = draft.error ?? batch.error;
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <InlineError
        message={
          notFound ? '이 배치에 없는 Day예요' : 'Day 초안을 불러오지 못했어요'
        }
        // 배치·초안 중 실패한 쪽만 다시 읽는다 — 초안만 다시 읽으면 배치 실패는 영영 안 풀린다
        onRetry={
          notFound
            ? undefined
            : () => {
                if (draft.isError) draft.refetch();
                if (batch.isError) batch.refetch();
              }
        }
      />
    );
  }
  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <Link
        href={`/content-batches/${batchId}`}
        className="flex items-center gap-1.5 text-[13px] text-body hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Day 목록
      </Link>
      <DraftActions batchStatus={batch.data.batch.status} draft={draft.data} />
      <ContentDraftView draft={draft.data} note={batch.data.batch.note} />
    </div>
  );
}
