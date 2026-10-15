// 만료·회수 여부에 따라 수동 권한을 구분하는 경계를 검증한다.
import { describe, expect, it } from 'vitest';

import { isGrantActive } from './subscription-grant';

describe('수동 이용 권한', () => {
  it('서울 만료 시각 직전까지만 유효하다', () => {
    const grant = { expiresAt: '2026-10-15T12:00:00' };
    expect(isGrantActive(grant, Date.parse('2026-10-15T02:59:59Z'))).toBe(true);
    expect(isGrantActive(grant, Date.parse('2026-10-15T03:00:00Z'))).toBe(
      false,
    );
  });
  it('회수했거나 만료를 알 수 없으면 유효한 권한으로 표시하지 않는다', () => {
    expect(
      isGrantActive({
        expiresAt: '2099-01-01T00:00:00',
        revokedAt: '2026-01-01T00:00:00',
      }),
    ).toBe(false);
    expect(isGrantActive({})).toBe(false);
  });
});
