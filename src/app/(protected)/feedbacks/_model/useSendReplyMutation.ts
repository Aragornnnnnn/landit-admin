'use client';

// 답장 전송 — 성공하면 목록·배지·사용자 묶음을 다시 불러온다. 처리완료로 바뀐 게 바로 보여야 한다
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

type ReplyRequest = Schema<'AdminMailboxReplyRequest'>;
type ReplyResponse = Schema<'AdminMailboxReplyResponse'>;

const PATH = '/api/v1/admin/mailbox/replies';

export function useSendReplyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: ReplyRequest) =>
      api.post<ReplyResponse>(PATH, request),
    onSuccess: () => {
      // 목록·배지·사용자 묶음이 모두 'feedbacks'로 시작한다 — 한 번에 무효화한다
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });
}
