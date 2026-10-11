import { describe, expect, it } from 'vitest';

import {
  addRecipients,
  canSendDirectLetter,
  draftErrors,
  EMPTY_DIRECT_LETTER_DRAFT,
  RECIPIENT_MAX,
  recipientSummary,
  removeRecipient,
  toDirectLetterRequest,
  type DirectLetterDraft,
  type Recipient,
} from './direct-letter-draft';

const person = (
  userProfileId: number,
  nickname = `사용자${userProfileId}`,
) => ({
  userProfileId,
  nickname,
});

const draft = (patch: Partial<DirectLetterDraft> = {}): DirectLetterDraft => ({
  recipients: [person(1290, '하늘')],
  title: '결제 오류 보상 안내',
  body: '안녕하세요, 랜딧 팀이에요.',
  ...patch,
});

describe('addRecipients', () => {
  it('이미 받는 사람인 ID는 다시 넣지 않고, 새 사람은 고른 순서대로 뒤에 붙인다', () => {
    const before = draft({ recipients: [person(1), person(2)] });

    const after = addRecipients(before, [person(2), person(3), person(4)]);

    expect(after.recipients.map((r) => r.userProfileId)).toEqual([1, 2, 3, 4]);
  });
});

describe('removeRecipient', () => {
  it('그 사람만 빼고 나머지 순서는 그대로 둔다', () => {
    const before = draft({ recipients: [person(1), person(2), person(3)] });

    const after = removeRecipient(before, 2);

    expect(after.recipients.map((r) => r.userProfileId)).toEqual([1, 3]);
  });
});

describe('draftErrors', () => {
  it('받는 사람·제목·본문이 다 있으면 오류가 없다', () => {
    expect(draftErrors(draft())).toEqual({});
  });

  it('받는 사람이 없으면 받는 사람 오류다', () => {
    expect(draftErrors(draft({ recipients: [] })).recipients).toBe(
      '받는 사람을 한 명 이상 추가해 주세요',
    );
  });

  it('받는 사람이 100명을 넘으면 한도 오류다 — BE가 한 번에 100명까지만 받는다', () => {
    const many: Recipient[] = Array.from(
      { length: RECIPIENT_MAX + 1 },
      (_, i) => person(i + 1),
    );

    expect(draftErrors(draft({ recipients: many })).recipients).toBe(
      '한 번에 100명까지 보낼 수 있어요',
    );
  });

  it('100명 딱 맞으면 보낼 수 있다', () => {
    const exact = Array.from({ length: RECIPIENT_MAX }, (_, i) =>
      person(i + 1),
    );

    expect(canSendDirectLetter(draft({ recipients: exact }))).toBe(true);
  });

  it('제목·본문이 공백뿐이면 비어 있는 것으로 본다', () => {
    const errors = draftErrors(draft({ title: '   ', body: '\n \n' }));

    expect(errors).toEqual({
      title: '제목을 입력해 주세요',
      body: '본문을 입력해 주세요',
    });
  });

  it('제목이 앞뒤 공백을 빼고 200자를 넘으면 길이 오류다', () => {
    const errors = draftErrors(draft({ title: `  ${'가'.repeat(201)}  ` }));

    expect(errors.title).toBe('제목은 200자까지예요');
  });
});

describe('toDirectLetterRequest', () => {
  it('제목·본문의 앞뒤 공백만 떼고 본문 안 줄바꿈은 그대로 보낸다', () => {
    const request = toDirectLetterRequest(
      draft({
        recipients: [person(1290), person(12)],
        title: '  결제 오류 보상 안내 ',
        body: '\n안녕하세요.\n\n감사합니다.\n',
      }),
    );

    expect(request).toEqual({
      userProfileIds: [1290, 12],
      title: '결제 오류 보상 안내',
      bodyText: '안녕하세요.\n\n감사합니다.',
    });
  });
});

describe('recipientSummary', () => {
  it('세 명까지는 모두 적는다', () => {
    const summary = recipientSummary([
      person(1290, '하늘'),
      person(977, '서연'),
      person(12, '도윤'),
    ]);

    expect(summary).toBe('#1290 하늘 · #977 서연 · #12 도윤');
  });

  it('넷 이상이면 앞 세 명 뒤에 나머지 인원을 붙인다', () => {
    const summary = recipientSummary([1, 2, 3, 4, 5].map((id) => person(id)));

    expect(summary).toBe('#1 사용자1 · #2 사용자2 · #3 사용자3 외 2명');
  });
});

describe('EMPTY_DIRECT_LETTER_DRAFT', () => {
  it('빈 초안은 보낼 수 없다', () => {
    expect(canSendDirectLetter(EMPTY_DIRECT_LETTER_DRAFT)).toBe(false);
  });
});
