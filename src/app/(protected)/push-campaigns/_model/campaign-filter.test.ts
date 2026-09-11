import { describe, expect, it } from 'vitest';

import {
  campaignEmptyLabel,
  campaignPageParams,
  changeCampaignFilter,
  DEFAULT_CAMPAIGN_FILTER,
  isStatusSelectDisabled,
  readCampaignFilter,
  writeCampaignFilter,
} from './campaign-filter';

describe('readCampaignFilter · writeCampaignFilter', () => {
  it('빈 주소는 기본값, 모르는 값은 버린다', () => {
    expect(readCampaignFilter(new URLSearchParams(''))).toEqual(
      DEFAULT_CAMPAIGN_FILTER,
    );
    expect(
      readCampaignFilter(new URLSearchParams('tab=X&status=Y&page=-1')),
    ).toEqual(DEFAULT_CAMPAIGN_FILTER);
  });

  it('읽기와 쓰기가 서로를 되돌리고 기본값은 적지 않는다', () => {
    const filter = { tab: 'SCHEDULED', status: 'SCHEDULED', page: 2 } as const;
    const query = writeCampaignFilter(filter);
    expect(query).toBe('tab=SCHEDULED&status=SCHEDULED&page=2');
    expect(readCampaignFilter(new URLSearchParams(query))).toEqual(filter);
    expect(writeCampaignFilter(DEFAULT_CAMPAIGN_FILTER)).toBe('');
  });
});

describe('campaignPageParams', () => {
  it('탭을 BE 파라미터로 — 예약은 scheduled, 발송됨·초안은 status', () => {
    expect(campaignPageParams({ tab: 'SCHEDULED', page: 0 })).toEqual({
      scheduled: true,
      status: undefined,
      page: 0,
      size: 20,
    });
    expect(campaignPageParams({ tab: 'SENT', page: 1 }).status).toBe(
      'COMPLETED',
    );
    expect(campaignPageParams({ tab: 'DRAFT', page: 0 }).status).toBe('DRAFT');
  });

  it('상태 Select는 전체·예약 탭에서만 더해진다 — 발송됨·초안 탭은 이미 상태가 정해져 있다', () => {
    expect(
      campaignPageParams({ tab: 'SCHEDULED', status: 'CANCELLED', page: 0 })
        .status,
    ).toBe('CANCELLED');
    expect(
      campaignPageParams({ tab: 'DRAFT', status: 'CANCELLED', page: 0 }).status,
    ).toBe('DRAFT');
    expect(isStatusSelectDisabled('DRAFT')).toBe(true);
    expect(isStatusSelectDisabled('ALL')).toBe(false);
  });
});

describe('changeCampaignFilter', () => {
  it('탭이나 상태를 바꾸면 첫 페이지로 돌아간다', () => {
    const changed = changeCampaignFilter(
      { tab: 'ALL', page: 3 },
      { tab: 'SENT' },
    );
    expect(changed.page).toBe(0);
    expect(
      changeCampaignFilter({ tab: 'ALL', page: 3 }, { page: 4 }).page,
    ).toBe(4);
  });
});

describe('campaignEmptyLabel', () => {
  it.each([
    ['ALL', undefined, '아직 보낸 푸시가 없어요'],
    ['SCHEDULED', undefined, '예약된 푸시가 없어요'],
    ['SENT', undefined, '발송한 푸시가 없어요'],
    ['DRAFT', undefined, '초안이 없어요'],
    ['ALL', 'CANCELLED', '조건에 맞는 푸시가 없어요'],
  ] as const)('%s · %s → "%s"', (tab, status, label) => {
    expect(campaignEmptyLabel({ tab, status, page: 0 })).toBe(label);
  });
});
