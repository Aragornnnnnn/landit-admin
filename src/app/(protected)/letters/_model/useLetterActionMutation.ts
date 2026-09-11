'use client';

// 편지 상태·고정 바꾸기 — PATCH 하나로 다 되고, 끝나면 목록 세 그룹을 모두 다시 읽는다.
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

export function useLetterActionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      letterId,
      action,
    }: {
      letterId: number;
      action: LetterAction;
    }) => api.patch(`${LETTERS_PATH}/${letterId}`, letterActionPatch(action)),
    onSuccess: (_data, { action }) => {
      toast.success(LETTER_ACTION_DONE[action]);
      queryClient.invalidateQueries({ queryKey: ['letters'] });
    },
    onError: (error) => {
      reportError(error);
      toast.error('바꾸지 못했어요. 잠시 후 다시 시도해 주세요.');
    },
  });
}
