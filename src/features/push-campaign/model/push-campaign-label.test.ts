import { describe, expect, it } from 'vitest';

import type { PushCampaign } from '../api/push-campaign';
import {
  isPushInFlight,
  PUSH_STATUS_DOT,
  PUSH_STATUS_LABEL,
  pushAudienceLabel,
  pushProgressRatio,
  pushScheduleLabel,
} from './push-campaign-label';

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

describe('상태 라벨·점', () => {
  it.each([
    ['DRAFT', '초안', undefined],
    ['SCHEDULE_PENDING', '예약됨', 'scheduled'],
    ['SCHEDULED', '예약됨', 'scheduled'],
    ['PENDING', '발송 중', 'progress'],
    ['QUEUED', '발송 중', 'progress'],
    ['SENDING', '발송 중', 'progress'],
    ['COMPLETED', '완료', 'done'],
    ['CANCELLED', '취소됨', undefined],
  ] as const)('%s → "%s" · 점 %s', (status, label, dot) => {
    expect(PUSH_STATUS_LABEL[status]).toBe(label);
    expect(PUSH_STATUS_DOT[status]).toBe(dot);
  });

  it('발송이 끝나지 않은 상태만 진행 중이다 — 상세는 이때만 다시 읽는다', () => {
    expect(isPushInFlight('SENDING')).toBe(true);
    expect(isPushInFlight('SCHEDULE_PENDING')).toBe(true);
    expect(isPushInFlight('SCHEDULED')).toBe(false);
    expect(isPushInFlight('COMPLETED')).toBe(false);
  });
});

describe('pushProgressRatio', () => {
  it('처리된 기기(성공+실패) 나누기 대상 기기', () => {
    expect(
      pushProgressRatio(
        campaign({
          targetTokenCount: 200,
          succeededCount: 100,
          failedCount: 24,
        }),
      ),
    ).toBe(0.62);
  });

  it('대상이 아직 고정되지 않았으면(0) 0으로 둔다 — 0으로 나누지 않는다', () => {
    expect(pushProgressRatio(campaign({ succeededCount: 3 }))).toBe(0);
  });
});

describe('pushAudienceLabel', () => {
  it('전체는 고정된 기기 수, 시작 전이면 —', () => {
    expect(pushAudienceLabel(campaign({ targetTokenCount: 9412 }))).toEqual({
      kind: '전체',
      detail: '9,412 기기',
    });
    expect(pushAudienceLabel(campaign()).detail).toBe('—');
  });

  it('선택은 고정된 사용자 수, 시작 전이면 고른 ID 수 — SQL이 있으면 표시한다', () => {
    const selected = campaign({
      audienceType: 'SELECTED',
      userProfileIds: [1, 2, 3],
      audienceSql: 'SELECT 1',
    });
    expect(pushAudienceLabel(selected)).toEqual({
      kind: '선택',
      detail: '3명 선택 · SQL',
    });
    expect(
      pushAudienceLabel({ ...selected, targetUserCount: 1204 }).detail,
    ).toBe('1,204명 · SQL');
  });
});

describe('pushScheduleLabel', () => {
  it('예약이 있으면 예약 시각, 취소됐으면 (취소)를 붙인다', () => {
    const at = '2026-09-12T10:00:00Z';
    expect(
      pushScheduleLabel(campaign({ status: 'SCHEDULED', scheduledAt: at })),
    ).toBe('09.12 19:00 예약');
    expect(
      pushScheduleLabel(campaign({ status: 'CANCELLED', scheduledAt: at })),
    ).toBe('09.12 19:00 (취소)');
  });

  it('예약 없이 보낸 건 완료 시각, 아무것도 없으면 —', () => {
    expect(
      pushScheduleLabel(
        campaign({ status: 'COMPLETED', completedAt: '2026-09-08T10:04:00' }),
      ),
    ).toBe('09.08 10:04');
    expect(pushScheduleLabel(campaign())).toBe('—');
  });
});
