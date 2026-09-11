import { describe, expect, it } from 'vitest';

import { EMPTY_AUDIENCE } from './audience';
import { audienceSourceSummary, idsSummary } from './audience-source-label';

describe('idsSummary', () => {
  it('앞 몇 개만 #으로 적고 나머지는 +n', () => {
    expect(idsSummary([1284, 1283, 1279, 1201, 1188])).toBe(
      '#1284 · #1283 · #1279 · +2',
    );
    expect(idsSummary([7])).toBe('#7');
  });
});

describe('audienceSourceSummary', () => {
  it('SQL은 첫 줄만 — 긴 문장이 행을 넘치지 않게', () => {
    const draft = {
      ...EMPTY_AUDIENCE,
      sql: '  SELECT u.id AS user_profile_id\nFROM public.user_profile u',
    };
    expect(audienceSourceSummary(draft, 'sql')).toBe(
      'SELECT u.id AS user_profile_id',
    );
  });

  it('ID 출처는 ID 요약', () => {
    const draft = { ...EMPTY_AUDIENCE, excludedIds: [1100, 1101] };
    expect(audienceSourceSummary(draft, 'excluded')).toBe('#1100 · #1101');
  });
});
