'use client';

// 개인 편지 발송 훅 — 성공 토스트와 실패 보고를 맡는다. 받는 사람 문제(404)는 토스트 대신 화면이 배너로 그린다
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { DIRECT_LETTER_KEY } from '@/features/direct-letter/api/direct-letter-query';
import { reportError } from '@/shared/monitoring/report';

import {
  sendDirectLetter,
  type DirectLetterRequest,
} from '../_api/direct-letter';
import { toSendFailure } from './send-failure';

export function useSendDirectLetterMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: DirectLetterRequest) => sendDirectLetter(body),
    onSuccess: (sent) => {
      void client.invalidateQueries({ queryKey: DIRECT_LETTER_KEY });
      toast.success(`${sent.recipientCount}명에게 보냈어요`);
    },
    onError: (error) => {
      reportError(error);
      const failure = toSendFailure(error);
      if (failure.kind === 'other') toast.error(failure.message);
    },
  });
}
