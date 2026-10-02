// 피드백 첨부 이미지 → 화면에 걸 주소. BE 상대 경로를 프록시 경로로 바꾼다 (프록시가 GET으로 열어 둔 모양만)
import { FEEDBACK_ATTACHMENT_PATH } from '@/features/feedback/api/feedback-attachment';
import type { Schema } from '@/shared/api/schema-patch';

export interface AttachmentImage {
  id: number;
  /** 같은 오리진 프록시 경로 — 세션 쿠키가 자동으로 붙어 img로 바로 불러온다 */
  src: string;
}

const PROXY_PREFIX = '/api/proxy';

export function toAttachmentImages(
  attachments: Schema<'MailboxFeedbackAttachmentResponse'>[] | null | undefined,
): AttachmentImage[] {
  return (attachments ?? []).flatMap(({ attachmentId, downloadUrl }) =>
    attachmentId !== undefined && isAttachmentPath(downloadUrl)
      ? [{ id: attachmentId, src: `${PROXY_PREFIX}${downloadUrl}` }]
      : [],
  );
}

// 프록시가 GET으로 열어 둔 모양만 — 절대·프로토콜 상대 주소나 다른 경로는 img에 걸지 않는다
function isAttachmentPath(downloadUrl: string | undefined): boolean {
  return (
    downloadUrl?.startsWith('/') === true &&
    FEEDBACK_ATTACHMENT_PATH.test(downloadUrl.slice(1))
  );
}
