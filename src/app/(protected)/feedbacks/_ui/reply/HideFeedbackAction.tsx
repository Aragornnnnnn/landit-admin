'use client';

// 현재 피드백을 어드민에서 숨기는 버튼과 확인창을 제공한다.
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { hideFeedback } from '@/features/feedback/api/feedback-list';
import { reportError } from '@/shared/monitoring/report';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { Button } from '@/shared/ui/shadcn/button';

export function HideFeedbackAction({
  feedbackId,
  content,
  disabled,
  onHide,
}: {
  feedbackId: number;
  content?: string;
  disabled: boolean;
  onHide: () => void;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const hide = useMutation({
    mutationFn: () => hideFeedback(feedbackId),
    onSuccess: () => {
      toast.success('어드민에서 피드백을 숨겼어요.');
      onHide();
      void queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
    onError: (error) => {
      reportError(error);
      toast.error('숨기지 못했어요. 다시 시도해 주세요.');
    },
  });

  return (
    <>
      <Button
        variant="secondary"
        className="self-start"
        disabled={disabled || hide.isPending}
        onClick={() => setOpen(true)}
      >
        어드민에서 숨기기
      </Button>
      <ActionConfirmDialog
        open={open}
        title="어드민에서 피드백을 숨길까요?"
        pending={hide.isPending}
        onCancel={() => setOpen(false)}
        onConfirm={() => hide.mutate()}
      >
        <p>
          피드백 1건을 어드민 목록과 상세에서 숨겨요. 사용자 편지함은
          그대로예요.
        </p>
        {content && <p className="line-clamp-3">{content}</p>}
      </ActionConfirmDialog>
    </>
  );
}
