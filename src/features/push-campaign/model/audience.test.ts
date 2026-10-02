import { describe, expect, it } from 'vitest';

import {
  audienceSources,
  canSaveAudience,
  EMPTY_AUDIENCE,
  estimateAudienceCount,
  toAudienceRequest,
  type AudienceDraft,
} from './audience';

const selected = (patch: Partial<AudienceDraft> = {}): AudienceDraft => ({
  ...EMPTY_AUDIENCE,
  type: 'SELECTED',
  ...patch,
});

describe('estimateAudienceCount', () => {
  it('(SQL ∪ 직접 선택 ∪ 붙여넣기) − 제외 — 겹치는 사람은 한 번만, 제외가 우선', () => {
    const draft = selected({
      sqlIds: [1, 2, 3, 4],
      selectedIds: [3, 5],
      pastedIds: [5, 6],
      excludedIds: [1, 6, 99],
    });
    expect(estimateAudienceCount(draft)).toBe(4);
  });

  it('전체 사용자는 화면이 셀 수 없다 — null', () => {
    expect(estimateAudienceCount({ ...EMPTY_AUDIENCE, type: 'ALL' })).toBe(
      null,
    );
  });
});

describe('audienceSources', () => {
  it('값이 있는 출처만 순서대로 — SQL은 조회 전에도 문장이 있으면 보인다', () => {
    const draft = selected({
      sql: 'SELECT 1',
      pastedIds: [1],
      excludedIds: [2],
    });
    expect(audienceSources(draft).map((s) => s.kind)).toEqual([
      'sql',
      'pasted',
      'excluded',
    ]);
  });
});

describe('canSaveAudience', () => {
  it('전체는 늘 저장할 수 있다', () => {
    expect(canSaveAudience({ ...EMPTY_AUDIENCE, type: 'ALL' })).toBe(true);
  });

  it('선택은 포함 출처가 하나는 있어야 한다 — 제외만 있으면 BE가 거부한다', () => {
    expect(canSaveAudience(selected())).toBe(false);
    expect(canSaveAudience(selected({ excludedIds: [1] }))).toBe(false);
    expect(canSaveAudience(selected({ sql: 'SELECT 1' }))).toBe(true);
    expect(canSaveAudience(selected({ selectedIds: [1] }))).toBe(true);
  });
});

describe('toAudienceRequest', () => {
  it('직접 선택과 붙여넣기는 하나의 userProfileIds로 합치고, SQL은 문장만 보낸다(발송 시 재실행)', () => {
    const draft = selected({
      sqlIds: [9, 8],
      sql: '  SELECT u.id AS user_profile_id FROM public.user_profile u ',
      selectedIds: [3, 1],
      pastedIds: [2, 3],
      excludedIds: [7, 7],
    });
    expect(toAudienceRequest(draft)).toEqual({
      audienceType: 'SELECTED',
      userProfileIds: [1, 2, 3],
      audienceSql: 'SELECT u.id AS user_profile_id FROM public.user_profile u',
      excludedUserProfileIds: [7],
    });
  });

  it('전체는 ID를 비워 보낸다 — ID가 섞이면 BE가 400을 준다', () => {
    expect(
      toAudienceRequest({ ...EMPTY_AUDIENCE, type: 'ALL', selectedIds: [1] }),
    ).toEqual({
      audienceType: 'ALL',
      userProfileIds: [],
      audienceSql: undefined,
      excludedUserProfileIds: [],
    });
  });
});
