import { describe, expect, it } from 'vitest';

import type { PushCampaign } from '@/features/push-campaign/api/push-campaign';

import { campaignTimeline, resultShares } from './detail-label';

const campaign = (patch: Partial<PushCampaign> = {}): PushCampaign => ({
  id: 'c1',
  title: '제목',
  body: '본문',
  deepLink: '/home',
  createdBy: 12,
  status: 'DRAFT',
  targetUserCount: 0,
  targetTokenCount: 0,
  pendingCount: 0,
  succeededCount: 0,
  failedCount: 0,
  excludedCount: 0,
  createdAt: '2026-09-11T14:02:00',
  completedAt: null,
  audienceType: 'ALL',
  userProfileIds: [],
  audienceSql: null,
  excludedUserProfileIds: [],
  scheduledAt: null,
  ...patch,
});

describe('campaignTimeline', () => {
  it('초안은 생성만 끝났고 발송이 다음이다', () => {
    expect(campaignTimeline(campaign())).toEqual([
      { label: '초안 생성', when: '09.11 14:02 · #12', state: 'done' },
      { label: '발송', when: '—', state: 'next' },
      { label: '완료', when: '—', state: 'todo' },
    ]);
  });

  it('예약됨은 예약 시각이 다음이고, 취소되면 그 단계가 취소로 남는다', () => {
    const at = '2026-09-12T10:00:00Z';
    expect(
      campaignTimeline(campaign({ status: 'SCHEDULED', scheduledAt: at }))[1],
    ).toEqual({ label: '예약 발송', when: '09.12 19:00', state: 'next' });
    expect(
      campaignTimeline(campaign({ status: 'CANCELLED', scheduledAt: at }))[1],
    ).toEqual({ label: '예약 취소', when: '09.12 19:00', state: 'cancelled' });
  });

  it('발송 중은 진행 중으로, 완료는 제출 완료 시각과 기기 수로', () => {
    expect(campaignTimeline(campaign({ status: 'SENDING' }))[1]).toEqual({
      label: '발송 중',
      when: '진행 중',
      state: 'active',
    });
    const done = campaign({
      status: 'COMPLETED',
      completedAt: '2026-09-08T10:04:00',
      targetTokenCount: 9412,
    });
    expect(campaignTimeline(done)[2]).toEqual({
      label: '완료',
      when: '09.08 10:04 · 9,412 기기',
      state: 'done',
    });
  });
});

describe('resultShares', () => {
  it('대상 기기 대비 성공·실패·대기 비율', () => {
    const shares = resultShares(
      campaign({
        targetTokenCount: 1000,
        succeededCount: 900,
        failedCount: 50,
        excludedCount: 30,
        pendingCount: 20,
      }),
    );
    expect(shares).toEqual({ succeeded: 0.9, failed: 0.05, pending: 0.02 });
  });

  it('대상이 0이면 전부 0 — 0으로 나누지 않는다', () => {
    expect(resultShares(campaign()).succeeded).toBe(0);
  });
});
