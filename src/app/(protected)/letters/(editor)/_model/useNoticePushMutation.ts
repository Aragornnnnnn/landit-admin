// 발행한 공지의 푸시를 요청하고 발행과 발송 결과를 구분해 알린다.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { PUSH_CAMPAIGNS_PATH } from '@/features/push-campaign/api/push-campaign';
import { PUSH_CAMPAIGNS_KEY } from '@/features/push-campaign/model/usePushCampaignQuery';
import { api } from '@/shared/api/client';
import { reportError } from '@/shared/monitoring/report';

export function useNoticePushMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (letterId: number) =>
      api.post(`${PUSH_CAMPAIGNS_PATH}/notice/${letterId}`),
    onSuccess: () => {
      toast.success('푸시 발송을 요청했어요.');
      void queryClient.invalidateQueries({ queryKey: PUSH_CAMPAIGNS_KEY });
    },
    onError: (error) => {
      reportError(error);
      toast.error(
        '푸시 발송 요청을 확인하지 못했어요. 이 화면에서 다시 시도해 주세요.',
      );
    },
  });
}
