// 배치·Day 상태가 생성 중일 때만 주기 조회하고 성공한 변경 뒤 모든 관련 자료를 갱신한다.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

import { CONTENT_ROOT, runContentCommand } from '../_api/content-api';
import { shouldPoll } from './content-state';

export function useContentBatchesQuery(page: number) {
  return useQuery({
    queryKey: ['content', 'list', page],
    queryFn: () =>
      api.get<Schema<'AdminContentBatchPage'>>(
        `${CONTENT_ROOT}?page=${page}&size=20`,
      ),
  });
}
export function useContentBatchQuery(id: number | undefined) {
  return useQuery({
    queryKey: ['content', 'batch', id],
    enabled: id !== undefined,
    queryFn: () =>
      api.get<Schema<'AdminContentBatchResponse'>>(`${CONTENT_ROOT}/${id}`),
    refetchInterval: (q) => (shouldPoll(q.state.data) ? 3000 : false),
  });
}
export function useContentDraftQuery(
  batchId: number | undefined,
  draftId: number | undefined,
  active = false,
) {
  return useQuery({
    queryKey: ['content', 'draft', batchId, draftId],
    enabled: batchId !== undefined && draftId !== undefined,
    queryFn: () =>
      api.get<Schema<'AdminContentDraftDetail'>>(
        `${CONTENT_ROOT}/${batchId}/drafts/${draftId}`,
      ),
    refetchInterval: (q) =>
      active || q.state.data?.status === 'GENERATING' ? 3000 : false,
  });
}
export function useNextContentDayQuery() {
  return useQuery({
    queryKey: ['content', 'next-day'],
    queryFn: () =>
      api.get<Schema<'AdminContentNextDayResponse'>>(
        `${CONTENT_ROOT}/next-day`,
      ),
  });
}
export function useContentCommandMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: runContentCommand,
    onSuccess: () => toast.success('요청을 처리했어요.'),
    onSettled: () => client.invalidateQueries({ queryKey: ['content'] }),
  });
}
