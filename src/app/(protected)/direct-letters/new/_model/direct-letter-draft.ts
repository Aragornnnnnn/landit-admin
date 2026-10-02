// 개인 편지 초안의 규칙 — 누구에게 무엇을 담고, 언제 보낼 수 있고, 서버 본문으로 어떻게 바뀌는지 (docs/screens/direct-letters.md "검증").
// 화면은 이 함수들을 부르기만 한다
import type { DirectLetterRequest } from '../_api/direct-letter';

export const TITLE_MAX = 200;
/** BE가 한 번에 받는 받는 사람 수 — 넘으면 400이라 화면에서 먼저 막는다 */
export const RECIPIENT_MAX = 100;
/** 확인창·요약에 이름을 적는 인원 — 나머지는 "외 n명" */
const SUMMARY_NAMES = 3;

export interface Recipient {
  userProfileId: number;
  nickname: string;
}

export interface DirectLetterDraft {
  recipients: Recipient[];
  title: string;
  body: string;
}

export const EMPTY_DIRECT_LETTER_DRAFT: DirectLetterDraft = {
  recipients: [],
  title: '',
  body: '',
};

/** 고른 사람을 뒤에 붙인다 — 이미 받는 사람이면 건너뛴다(BE는 중복 ID를 400으로 거절한다) */
export function addRecipients(
  draft: DirectLetterDraft,
  more: Recipient[],
): DirectLetterDraft {
  const seen = new Set(draft.recipients.map((r) => r.userProfileId));
  const fresh = more.filter((r) => {
    if (seen.has(r.userProfileId)) return false;
    seen.add(r.userProfileId);
    return true;
  });
  return { ...draft, recipients: [...draft.recipients, ...fresh] };
}

export function removeRecipient(
  draft: DirectLetterDraft,
  userProfileId: number,
): DirectLetterDraft {
  return {
    ...draft,
    recipients: draft.recipients.filter(
      (r) => r.userProfileId !== userProfileId,
    ),
  };
}

export interface DraftErrors {
  recipients?: string;
  title?: string;
  body?: string;
}

export function draftErrors(draft: DirectLetterDraft): DraftErrors {
  const errors: DraftErrors = {};
  const count = draft.recipients.length;
  const title = draft.title.trim();
  if (count === 0) errors.recipients = '받는 사람을 한 명 이상 추가해 주세요';
  else if (count > RECIPIENT_MAX)
    errors.recipients = `한 번에 ${RECIPIENT_MAX}명까지 보낼 수 있어요`;
  if (!title) errors.title = '제목을 입력해 주세요';
  else if (title.length > TITLE_MAX)
    errors.title = `제목은 ${TITLE_MAX}자까지예요`;
  if (!draft.body.trim()) errors.body = '본문을 입력해 주세요';
  return errors;
}

export const canSendDirectLetter = (draft: DirectLetterDraft) =>
  Object.keys(draftErrors(draft)).length === 0;

/** 본문은 앞뒤 공백만 뗀다 — 안쪽 줄바꿈은 사용자 편지함에 그대로 보인다 */
export function toDirectLetterRequest(
  draft: DirectLetterDraft,
): DirectLetterRequest {
  return {
    userProfileIds: draft.recipients.map((r) => r.userProfileId),
    title: draft.title.trim(),
    bodyText: draft.body.trim(),
  };
}

/** "#1290 하늘 · #977 서연 · #12 도윤 외 2명" — 보내기 전에 누구에게 가는지 한 줄로 */
export function recipientSummary(recipients: Recipient[]): string {
  const names = recipients
    .slice(0, SUMMARY_NAMES)
    .map((r) => `#${r.userProfileId} ${r.nickname}`)
    .join(' · ');
  const rest = recipients.length - SUMMARY_NAMES;
  return rest > 0 ? `${names} 외 ${rest}명` : names;
}
