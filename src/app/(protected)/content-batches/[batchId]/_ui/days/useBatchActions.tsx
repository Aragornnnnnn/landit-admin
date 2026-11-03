'use client';

// Day 목록의 되돌릴 수 없는 액션 — 재시작 · 승인. 확인창을 열고, 확인하면 뮤테이션을 부른다 (docs/screens/content-batches.md "정확한 카피")
import { useState } from 'react';

import type { ContentBatch } from '@/features/content/api/content-batch';
import { useContentBatchMutation } from '@/features/content/model/useContentMutation';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';

type Asked = 'resume' | 'approve';

export function useBatchActions(batch: ContentBatch) {
  const mutation = useContentBatchMutation();
  const [asked, setAsked] = useState<Asked | null>(null);
  const dismiss = () => setAsked(null);
  const confirm = (type: Asked) =>
    mutation.mutate({ type, batchId: batch.batchId }, { onSuccess: dismiss });

  const dialogs = (
    <>
      <ActionConfirmDialog
        open={asked === 'resume'}
        title={`배치 #${batch.batchId}를 재시작할까요?`}
        pending={mutation.isPending}
        onCancel={dismiss}
        onConfirm={() => confirm('resume')}
      >
        <p>멈춘 Day부터 생성을 이어가요. 끝난 Day는 그대로 둬요.</p>
      </ActionConfirmDialog>
      <ActionConfirmDialog
        open={asked === 'approve'}
        title={`Day ${batch.dayCount}개를 승인할까요?`}
        pending={mutation.isPending}
        onCancel={dismiss}
        onConfirm={() => confirm('approve')}
      >
        <p>
          표현 id 12개씩 {batch.dayCount * 12}개를 예약하고 에셋 생성 단계로
          넘어가요. 되돌릴 수 없어요.
        </p>
      </ActionConfirmDialog>
    </>
  );

  return { ask: setAsked, pending: mutation.isPending, dialogs };
}
