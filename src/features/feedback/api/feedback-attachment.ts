// 피드백 첨부 이미지 경로 모양과 허용 형식 — 프록시 허용 규칙과 화면의 img 주소 검사가 같이 쓴다(함께 바뀌므로 한 자리에)

/** BE 첨부 이미지 경로(앞 `/` 없이) — `api/v1/mailbox/feedbacks/{id}/attachments/{id}` */
export const FEEDBACK_ATTACHMENT_PATH =
  /^api\/v1\/mailbox\/feedbacks\/\d+\/attachments\/\d+$/;

/** BE가 받는 첨부 형식(PNG·JPEG). 이 밖의 형식은 어드민 오리진에서 내려주지 않는다 */
export const FEEDBACK_ATTACHMENT_TYPES = new Set(['image/png', 'image/jpeg']);
