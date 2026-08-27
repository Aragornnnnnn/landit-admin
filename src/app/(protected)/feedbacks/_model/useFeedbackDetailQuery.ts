'use client';

// 피드백 단건 상세 조회 — 목록 필터·페이지와 무관하게 어떤 건이든 연다 (BE LAN-374).
// 처리완료 건의 최신 답장(reply)도 이 응답에 실려 온다
import { useQuery } from '@tanstack/react-query';

import { api } from '@/shared/api/client';
import type { AdminFeedbackDetail } from '@/shared/api/schema-patch';

const PATH = '/api/v1/admin/mailbox/feedbacks';

export function useFeedbackDetailQuery(feedbackId: number | undefined) {
  return useQuery({
    // 'feedbacks' 프리픽스를 지킨다 — 답장 전송이 이 키까지 한 번에 무효화한다
    queryKey: ['feedbacks', 'detail', feedbackId] as const,
    queryFn: () => api.get<AdminFeedbackDetail>(`${PATH}/${feedbackId}`),
    enabled: feedbackId !== undefined,
  });
}
