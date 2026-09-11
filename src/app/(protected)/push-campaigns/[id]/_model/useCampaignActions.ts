'use client';

// 상세의 되돌릴 수 없는 액션 — 지금 발송 · 예약 · 예약 취소. 확인창을 열고, 확인하면 뮤테이션을 부른다.
// 멱등성 키는 확인창을 여는 순간 만든다 — 확인창 안에서 재시도해도 같은 키가 가게 (api/push-campaign.ts)
import { useState } from 'react';

import { newIdempotencyKey } from '@/features/push-campaign/api/push-campaign';
import {
  toKstIso,
  type ScheduleInput,
} from '@/features/push-campaign/model/schedule-time';
import { usePushCampaignActionMutation } from '@/features/push-campaign/model/usePushCampaignMutation';

export type AskedAction = 'send' | 'schedule' | 'cancel';

export function useCampaignActions(campaignId: string) {
  const mutation = usePushCampaignActionMutation();
  const [asked, setAsked] = useState<{ type: AskedAction; key: string } | null>(
    null,
  );

  const request = (type: AskedAction) =>
    setAsked({ type, key: newIdempotencyKey() });
  const dismiss = () => setAsked(null);
  const done = { onSuccess: dismiss };

  return {
    asked: asked?.type ?? null,
    pending: mutation.isPending,
    request,
    dismiss,
    confirmSend: () =>
      asked &&
      mutation.mutate(
        { campaignId, action: { type: 'send', key: asked.key } },
        done,
      ),
    confirmSchedule: (input: ScheduleInput) =>
      asked &&
      mutation.mutate(
        {
          campaignId,
          action: {
            type: 'schedule',
            key: asked.key,
            scheduledAt: toKstIso(input),
          },
        },
        done,
      ),
    confirmCancel: () =>
      mutation.mutate({ campaignId, action: { type: 'cancel' } }, done),
    /** SCHEDULE_PENDING — 같은 시각으로 다시 등록한다. 확인창 없이, 새 키로 */
    retrySchedule: (input: ScheduleInput) =>
      mutation.mutate({
        campaignId,
        action: {
          type: 'schedule',
          key: newIdempotencyKey(),
          scheduledAt: toKstIso(input),
        },
      }),
  };
}
