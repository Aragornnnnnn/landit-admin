// 발행한 공지의 푸시를 요청하고 발행과 발송 결과를 구분해 알린다.
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { PUSH_CAMPAIGNS_PATH } from '@/features/push-campaign/api/push-campaign';
import { PUSH_CAMPAIGNS_KEY } from '@/features/push-campaign/model/usePushCampaignQuery';
import { ApiError } from '@/shared/api/api-error';
import { api } from '@/shared/api/client';
import { reportError } from '@/shared/monitoring/report';

import type { NoticePushAudience } from './notice-push-audience';

const NOTICE_PUSH_PATH = `${PUSH_CAMPAIGNS_PATH}/notice`;
const noticePushKey = (letterId: number | undefined) =>
  ['letters', 'notice-push', letterId] as const;

export async function requestNoticePush(
  letterId: number,
  queryClient: QueryClient,
  audience?: NoticePushAudience,
): Promise<boolean> {
  try {
    await api.post(
      `${NOTICE_PUSH_PATH}/${letterId}/${audience ? 'send' : 'retry'}`,
      audience,
    );
    toast.success('푸시 발송을 요청했어요.');
    void queryClient.invalidateQueries({ queryKey: PUSH_CAMPAIGNS_KEY });
    return true;
  } catch (error) {
    reportError(error);
    toast.error(
      error instanceof ApiError &&
        (error.status === 400 || error.status === 409)
        ? error.message
        : '푸시 발송 요청을 확인하지 못했어요. 공지 편집기에서 다시 시도해 주세요.',
    );
    return false;
  } finally {
    void queryClient.invalidateQueries({ queryKey: noticePushKey(letterId) });
  }
}

export function useNoticePushMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      letterId,
      audience,
    }: {
      letterId: number;
      audience?: NoticePushAudience;
    }) => requestNoticePush(letterId, queryClient, audience),
  });
}

export function useNoticePushStateQuery(letterId: number | undefined) {
  return useQuery({
    queryKey: noticePushKey(letterId),
    enabled: letterId !== undefined,
    queryFn: async () => {
      const result = await api.get<Record<string, unknown>>(
        `${NOTICE_PUSH_PATH}/${letterId}`,
      );
      return {
        requested: result.requested === true,
        retryable: result.retryable === true,
      };
    },
  });
}
