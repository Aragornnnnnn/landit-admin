'use client';

// 캠페인 변경 훅 — 생성 · 테스트 · 발송 · 예약 · 예약 취소 · SQL 대상 조회.
// 멱등성 키는 호출부가 버튼을 누른 순간 만들어 넘긴다 — 같은 클릭의 재시도가 같은 키를 쓰게 (api/push-campaign.ts)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiError } from '@/shared/api/api-error';
import { reportError } from '@/shared/monitoring/report';

import {
  cancelPushCampaignSchedule,
  createPushCampaign,
  queryPushAudience,
  schedulePushCampaign,
  sendPushCampaign,
  testPushCampaign,
  type PushCampaignRequest,
} from '../api/push-campaign';
import { PUSH_CAMPAIGNS_KEY } from './usePushCampaignQuery';

/** BE가 준 메시지까지만 보여 준다 — 스택·내부 URL은 UI에 내지 않는다 (docs/security.md) */
function failureMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.message ? error.message : fallback;
}

export function useCreatePushCampaignMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, key }: { body: PushCampaignRequest; key: string }) =>
      createPushCampaign(body, key),
    onSuccess: () => {
      toast.success('초안을 저장했어요');
      queryClient.invalidateQueries({ queryKey: PUSH_CAMPAIGNS_KEY });
    },
    onError: (error) => {
      reportError(error);
      toast.error(failureMessage(error, '저장 안 됨 · 다시 시도해 주세요'));
    },
  });
}

export type PushCampaignAction =
  | { type: 'test'; key: string }
  | { type: 'send'; key: string }
  | { type: 'schedule'; key: string; scheduledAt: string }
  | { type: 'cancel' };

const ACTION_DONE: Record<PushCampaignAction['type'], string> = {
  test: '내 기기로 보냈어요',
  send: '발송을 시작했어요',
  schedule: '예약했어요',
  cancel: '예약을 취소했어요',
};

function runAction(campaignId: string, action: PushCampaignAction) {
  switch (action.type) {
    case 'test':
      return testPushCampaign(campaignId, action.key);
    case 'send':
      return sendPushCampaign(campaignId, action.key);
    case 'schedule':
      return schedulePushCampaign(campaignId, action.scheduledAt, action.key);
    case 'cancel':
      return cancelPushCampaignSchedule(campaignId);
  }
}

/** 상세의 네 액션 — 끝나면 목록·상세를 모두 다시 읽는다(상태가 바뀌어 목록 탭이 달라진다) */
export function usePushCampaignActionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      campaignId,
      action,
    }: {
      campaignId: string;
      action: PushCampaignAction;
    }) => runAction(campaignId, action),
    onSuccess: (_data, { action }) => {
      toast.success(ACTION_DONE[action.type]);
      queryClient.invalidateQueries({ queryKey: PUSH_CAMPAIGNS_KEY });
    },
    onError: (error) => {
      reportError(error);
      toast.error(
        failureMessage(error, '처리하지 못했어요. 다시 시도해 주세요'),
      );
    },
  });
}

/** SQL 미리보기 — 실패 토스트에 SQL 원문은 싣지 않는다. 결과 ID는 호출부가 대상 초안에 담는다 */
export function usePushAudienceQueryMutation() {
  return useMutation({
    mutationFn: (sql: string) => queryPushAudience(sql),
    onError: (error) => {
      reportError(error);
      toast.error(failureMessage(error, 'SQL을 실행하지 못했어요'));
    },
  });
}
