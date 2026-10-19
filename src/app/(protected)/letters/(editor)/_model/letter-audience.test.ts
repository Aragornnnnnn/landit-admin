// 공지 대상 선택을 저장하고 빈 선택으로 해제하는 계약을 검증한다.
import { describe, expect, it } from 'vitest';

import {
  EMPTY_LETTER_DRAFT,
  toLetterDraft,
  toLetterRequest,
} from './letter-draft';

describe('공지 숨김 대상', () => {
  it('기존 선택을 편집기에 복원하고 저장 요청에 포함한다', () => {
    const draft = toLetterDraft({
      excludedUserIds: [12],
      excludedAudiences: ['YEARLY', 'TRIAL'],
    });
    expect(toLetterRequest(draft)).toMatchObject({
      excludedUserIds: [12],
      excludedAudiences: ['YEARLY', 'TRIAL'],
    });
  });
  it('선택을 모두 해제하면 빈 배열을 전송한다', () => {
    expect(toLetterRequest(EMPTY_LETTER_DRAFT)).toMatchObject({
      excludedUserIds: [],
      excludedAudiences: [],
    });
  });
});
