'use client';

// 편지 상태와 고정을 갱신하고 선택한 공지 푸시는 발행 성공 뒤 요청한다.
// 발행하면 편지가 임시저장 그룹에서 발행됨 그룹으로 옮겨 가므로 한 그룹만 갱신해선 화면이 어긋난다
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { LETTERS_PATH } from '@/features/letter/api/letter-list';
import { api } from '@/shared/api/client';
import { reportError } from '@/shared/monitoring/report';

import {
  LETTER_ACTION_DONE,
  letterActionPatch,
  type LetterAction,
} from './letter-actions';
import type { NoticePushAudience } from './notice-push-audience';
import { requestNoticePush } from './useNoticePushMutation';

export function useLetterActionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      letterId,
      action,
      sendPushOnPublish,
    }: {
      letterId: number;
      action: LetterAction;
      sendPushOnPublish?: NoticePushAudience;
    }) => {
      await api.patch(`${LETTERS_PATH}/${letterId}`, letterActionPatch(action));
      toast.success(LETTER_ACTION_DONE[action]);
      void queryClient.invalidateQueries({ queryKey: ['letters'] });
      return action === 'publish' && sendPushOnPublish
        ? requestNoticePush(letterId, queryClient, sendPushOnPublish)
        : false;
    },
    onError: (error) => {
      reportError(error);
      toast.error('바꾸지 못했어요. 잠시 후 다시 시도해 주세요.');
    },
  });
}
