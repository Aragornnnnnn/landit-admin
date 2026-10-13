// 개인 편지의 읽음 집계와 재작성 대상 선택을 검증한다.
import { describe, expect, it } from 'vitest';

import { selectRepeatRecipients, summarizeReads } from './read-summary';

describe('개인 편지', () => {
  it('최초 읽음 시각이 없는 수신자는 안 읽음으로 센다', () => {
    expect(
      summarizeReads([
        { userProfileId: 1, readAt: null },
        { userProfileId: 2, readAt: '2026-10-13T10:00:00' },
      ]),
    ).toEqual({ total: 2, read: 1, unread: 1, percent: 50 });
  });
  it('수신자가 없으면 비율을 0으로 표시한다', () => {
    expect(summarizeReads([]).percent).toBe(0);
  });
  it('재작성할 때 탈퇴·없는 사용자와 중복 ID를 제외한다', () => {
    const users = [
      { userProfileId: 1, nickname: '활성', status: 'ACTIVE' as const },
      { userProfileId: 2, nickname: '탈퇴', status: 'WITHDRAWN' as const },
    ];
    expect(selectRepeatRecipients([1, 2, 3, 1], users)).toEqual({
      recipients: [{ userProfileId: 1, nickname: '활성' }],
      excluded: 2,
    });
  });
});
