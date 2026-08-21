// 답장 작성 규칙 검증 — 보낼 수 있는 조건, 버튼 문구, 대표 건 보호
import { describe, expect, it } from 'vitest';

import {
  canSendReply,
  REPLY_BODY_MAX,
  REPLY_TITLE_MAX,
  replyButtonLabel,
  replyConfirmTitle,
  toggleTogetherFeedback,
} from './reply-draft';

const draft = (patch: Partial<Parameters<typeof canSendReply>[0]> = {}) => ({
  title: '마이크 문제 확인했어요',
  bodyText: '1.4.3에서 고쳐 배포할 예정이에요.',
  feedbackIds: [1],
  ...patch,
});

describe('canSendReply', () => {
  it('제목·본문이 있고 대상이 1건 이상이면 보낼 수 있다', () => {
    expect(canSendReply(draft())).toBe(true);
  });

  it.each([
    ['제목이 비었으면', { title: '   ' }],
    ['본문이 비었으면', { bodyText: '' }],
    ['대상이 없으면', { feedbackIds: [] }],
    ['제목이 너무 길면', { title: 'ㄱ'.repeat(REPLY_TITLE_MAX + 1) }],
    ['본문이 너무 길면', { bodyText: 'ㄱ'.repeat(REPLY_BODY_MAX + 1) }],
  ])('%s 못 보낸다', (_case, patch) => {
    expect(canSendReply(draft(patch))).toBe(false);
  });
});

describe('replyButtonLabel', () => {
  it('대상이 하나면 건수를 말하지 않는다', () => {
    expect(replyButtonLabel([1])).toBe('답장 보내기');
  });

  it('함께 처리할 게 있으면 몇 건인지 밝힌다 — 되돌릴 수 없어서', () => {
    expect(replyButtonLabel([1, 2, 3])).toBe('답장 보내기 · 2건 함께 처리');
  });
});

describe('replyConfirmTitle', () => {
  it('닉네임을 넣어 묻는다', () => {
    expect(replyConfirmTitle('수진')).toBe('수진님에게 답장을 보낼까요?');
  });

  it('닉네임이 없으면 뭉뚱그린다', () => {
    expect(replyConfirmTitle(undefined)).toBe(
      '이 사용자님에게 답장을 보낼까요?',
    );
  });
});

describe('toggleTogetherFeedback', () => {
  it('체크하면 더하고 다시 누르면 뺀다', () => {
    expect(toggleTogetherFeedback([1], 1, 2)).toEqual([1, 2]);
    expect(toggleTogetherFeedback([1, 2], 1, 2)).toEqual([1]);
  });

  it('클릭해서 연 그 피드백은 끌 수 없다 — 답장하려고 연 대상이다', () => {
    expect(toggleTogetherFeedback([1, 2], 1, 1)).toEqual([1, 2]);
  });
});
