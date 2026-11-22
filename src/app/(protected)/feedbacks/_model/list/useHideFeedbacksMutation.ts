// 현재 페이지의 숨김 요청을 모아 결과를 집계하고 피드백 조회를 갱신한다.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { hideFeedback } from '@/features/feedback/api/feedback-list';
import { reportError } from '@/shared/monitoring/report';

export function useHideFeedbacksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackIds: number[]) => {
      const results = await Promise.allSettled(feedbackIds.map(hideFeedback));
      return feedbackIds.filter((_, index) => {
        const result = results[index];
        if (result.status === 'fulfilled') return false;

        reportError(result.reason);
        return true;
      });
    },
    onSuccess: async (failedIds, feedbackIds) => {
      const hiddenCount = feedbackIds.length - failedIds.length;

      if (hiddenCount > 0) {
        toast.success(`피드백 ${hiddenCount}건을 어드민에서 숨겼어요.`);
      }
      if (failedIds.length > 0) {
        toast.error(`피드백 ${failedIds.length}건을 숨기지 못했어요.`);
      }

      await queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });
}
