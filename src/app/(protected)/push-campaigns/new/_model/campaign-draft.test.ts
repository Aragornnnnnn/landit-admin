import { describe, expect, it } from 'vitest';

import type { PushCampaign } from '@/features/push-campaign/api/push-campaign';

import {
  canSaveCampaignDraft,
  draftErrors,
  EMPTY_CAMPAIGN_DRAFT,
  finalDeepLink,
  fromCampaign,
  isEmptyCampaignDraft,
  toCampaignRequest,
  withTitle,
  type CampaignDraft,
} from './campaign-draft';

const draft = (patch: Partial<CampaignDraft> = {}): CampaignDraft => ({
  ...EMPTY_CAMPAIGN_DRAFT,
  title: '설문 안내',
  body: '설문에 답해 주세요',
  deepLink: '/survey',
  utmCampaign: 'survey_0912',
  ...patch,
});

describe('finalDeepLink', () => {
  it('UTM 스위치가 켜져 있으면 붙이고, 꺼져 있으면 입력 그대로', () => {
    expect(finalDeepLink(draft())).toBe(
      '/survey?utm_source=push&utm_medium=admin&utm_campaign=survey_0912',
    );
    expect(finalDeepLink(draft({ utmEnabled: false }))).toBe('/survey');
  });
});

describe('withTitle', () => {
  const date = new Date('2026-09-12T10:00:00+09:00');

  it('제목을 바꾸면 캠페인 값이 따라간다 — 운영자가 손대기 전까지', () => {
    const next = withTitle(EMPTY_CAMPAIGN_DRAFT, '설문 안내', date);
    expect(next.utmCampaign).toBe('설문_안내_0912');
  });

  it('운영자가 캠페인 값을 직접 고쳤으면 제목이 바뀌어도 건드리지 않는다', () => {
    const edited = {
      ...EMPTY_CAMPAIGN_DRAFT,
      utmCampaign: 'my',
      utmEdited: true,
    };
    expect(withTitle(edited, '다른 제목', date).utmCampaign).toBe('my');
  });
});

describe('draftErrors · canSaveCampaignDraft', () => {
  it('제목·본문·딥 링크가 있어야 저장할 수 있다', () => {
    expect(draftErrors(EMPTY_CAMPAIGN_DRAFT)).toEqual({
      title: '제목을 입력해 주세요',
      body: '본문을 입력해 주세요',
      deepLink: '딥 링크를 입력해 주세요',
    });
    expect(canSaveCampaignDraft(draft())).toBe(true);
  });

  it('길이 초과는 막는다 — 딥 링크는 UTM을 붙인 뒤 길이로 잰다', () => {
    expect(draftErrors(draft({ title: 'a'.repeat(256) })).title).toBe(
      '제목은 255자까지예요',
    );
    expect(draftErrors(draft({ body: 'a'.repeat(501) })).body).toBe(
      '본문은 500자까지예요',
    );
    const long = draft({ deepLink: '/' + 'a'.repeat(950) });
    expect(draftErrors(long).deepLink).toBe('딥 링크는 1000자까지예요');
    expect(
      draftErrors({ ...long, utmEnabled: false }).deepLink,
    ).toBeUndefined();
  });
});

describe('toCampaignRequest', () => {
  it('앞뒤 공백을 다듬고 최종 딥 링크와 대상을 담는다', () => {
    expect(toCampaignRequest(draft({ title: ' 설문 안내 ' }))).toEqual({
      title: '설문 안내',
      body: '설문에 답해 주세요',
      deepLink:
        '/survey?utm_source=push&utm_medium=admin&utm_campaign=survey_0912',
      audienceType: 'ALL',
      userProfileIds: [],
      audienceSql: undefined,
      excludedUserProfileIds: [],
    });
  });
});

describe('fromCampaign · isEmptyCampaignDraft', () => {
  it('보낸 캠페인을 새 초안으로 — 저장된 딥 링크는 UTM이 이미 붙어 있어 스위치를 끈 채 그대로 둔다', () => {
    const campaign = {
      title: '제목',
      body: '본문',
      deepLink: '/a?utm_source=push',
      audienceType: 'SELECTED',
      userProfileIds: [1, 2],
      audienceSql: 'SELECT 1',
      excludedUserProfileIds: [3],
    } as PushCampaign;
    const copied = fromCampaign(campaign);
    expect(copied.utmEnabled).toBe(false);
    expect(copied.deepLink).toBe('/a?utm_source=push');
    expect(copied.audience).toMatchObject({
      type: 'SELECTED',
      selectedIds: [1, 2],
      sql: 'SELECT 1',
      excludedIds: [3],
    });
    expect(isEmptyCampaignDraft(copied)).toBe(false);
    expect(isEmptyCampaignDraft(EMPTY_CAMPAIGN_DRAFT)).toBe(true);
  });
});
