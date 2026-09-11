'use client';

// 편지 저장 — 새 편지면 POST(초안 생성), 이미 있으면 PATCH(부분 수정).
// 저장은 상태를 건드리지 않는다. 발행·숨김은 상단 버튼이 따로 부른다 (useLetterActionMutation)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  LETTERS_PATH,
  type LetterItem,
} from '@/features/letter/api/letter-list';
import { api } from '@/shared/api/client';
import { reportError } from '@/shared/monitoring/report';

import { toLetterRequest, type LetterDraft } from './letter-draft';

export function useSaveLetterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      letterId,
      draft,
    }: {
      letterId: number | undefined;
      draft: LetterDraft;
    }) => {
      const body = toLetterRequest(draft);
      return letterId
        ? api.patch<LetterItem>(`${LETTERS_PATH}/${letterId}`, body)
        : api.post<LetterItem>(LETTERS_PATH, body);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['letters'] }),
    onError: (error) => {
      reportError(error);
      toast.error('저장 안 됨 · 다시 시도해 주세요');
    },
  });
}
