// 답장 작성 규칙 — 무엇을 보낼 수 있고 버튼에 뭐라고 쓸지. 화면과 떼어 테스트로 고정한다 (docs/screens/feedbacks.md "규칙")

/** BE·사용자 편지함이 감당하는 길이. 넘으면 보내기 전에 막는다 */
export const REPLY_TITLE_MAX = 50;
export const REPLY_BODY_MAX = 1_000;

export interface ReplyDraft {
  title: string;
  bodyText: string;
  /** 함께 처리할 피드백 — 클릭한 1건은 항상 포함되고, 접힌 목록에서 체크한 것이 더해진다 */
  feedbackIds: number[];
}

/** 보낼 수 있나 — 제목·본문이 길이 안에 있고 대상이 1건 이상 */
export function canSendReply(draft: ReplyDraft): boolean {
  const title = draft.title.trim();
  const body = draft.bodyText.trim();
  return (
    title.length > 0 &&
    title.length <= REPLY_TITLE_MAX &&
    body.length > 0 &&
    body.length <= REPLY_BODY_MAX &&
    draft.feedbackIds.length > 0
  );
}

/**
 * 버튼 라벨 — 함께 처리할 게 있으면 몇 건인지 밝힌다.
 * 되돌릴 수 없는 작업이라 누르기 전에 몇 건이 처리되는지 보여야 한다 (Figma 1050:9683)
 */
export function replyButtonLabel(feedbackIds: number[]): string {
  const together = feedbackIds.length - 1;
  return together > 0 ? `답장 보내기 · ${together}건 함께 처리` : '답장 보내기';
}

/** 확인창 제목 — 프레임 카피는 건수를 넣지 않는다 (1050:9401) */
export function replyConfirmTitle(nickname: string | undefined): string {
  return `${nickname ?? '이 사용자'}님에게 답장을 보낼까요?`;
}

/** 함께 처리 목록에서 체크를 켜고 끈다. 클릭한 건(대표)은 끌 수 없다 — 그걸 답장하려고 연 시트다 */
export function toggleTogetherFeedback(
  feedbackIds: number[],
  primaryId: number,
  targetId: number,
): number[] {
  if (targetId === primaryId) return feedbackIds;
  return feedbackIds.includes(targetId)
    ? feedbackIds.filter((id) => id !== targetId)
    : [...feedbackIds, targetId];
}
