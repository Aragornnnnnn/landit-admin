'use client';

// 현재 피드백을 답장 없이 완료하는 버튼과 확인창을 제공한다.
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { FEEDBACKS_PATH } from '@/features/feedback/api/feedback-list';
import { api } from '@/shared/api/client';
import { reportError } from '@/shared/monitoring/report';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { Button } from '@/shared/ui/shadcn/button';

export function CompleteFeedbackAction({
  feedbackId,
  disabled,
  onComplete,
}: {
  feedbackId: number;
  disabled: boolean;
  onComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const complete = useMutation({
    mutationFn: () => api.post(`${FEEDBACKS_PATH}/${feedbackId}/complete`),
    onSuccess: () => {
      toast.success('피드백을 완료했어요.');
      onComplete();
      void queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
    onError: (error) => {
      reportError(error);
      toast.error('완료하지 못했어요. 다시 시도해 주세요.');
    },
  });

  return (
    <>
      <Button
        variant="secondary"
        className="self-start"
        disabled={disabled || complete.isPending}
        onClick={() => setOpen(true)}
      >
        답장 없이 완료
      </Button>
      <ActionConfirmDialog
        open={open}
        title="답장 없이 완료할까요?"
        pending={complete.isPending}
        onCancel={() => setOpen(false)}
        onConfirm={() => complete.mutate()}
      >
        이 피드백 한 건을 완료하고 처리중 목록에서 빼요.
      </ActionConfirmDialog>
    </>
  );
}
