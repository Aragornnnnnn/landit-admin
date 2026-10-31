// 1차 Day 상세(검수·재생성)가 쓰는 변경 훅 — Day 상세가 Figma 안으로 바뀌는 LAN-813에서 features/content의 훅으로 대체하고 지운다.
// 조회 훅은 features/content/model/useContentQuery.ts로 옮겨졌다(같은 쿼리 키를 다른 폴링 주기로 두 번 정의하지 않기 위해)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { markRegenerated } from '@/features/content/model/review-visit';

import { runContentCommand } from '../_api/content-api';

export function useContentCommandMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ['content'],
    mutationFn: runContentCommand,
    onSuccess: (_result, command) => {
      // Day 목록의 "다시 볼 것"은 이 기록으로 센다 — 새 훅으로 바뀌기 전까지 여기서도 남긴다
      if (command.kind === 'regenerate') markRegenerated(command.draftId);
      toast.success('요청을 처리했어요.');
    },
    onSettled: () => client.invalidateQueries({ queryKey: ['content'] }),
  });
}
