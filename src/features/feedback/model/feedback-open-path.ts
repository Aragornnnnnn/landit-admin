// 다른 화면(대시보드·사용자 상세)에서 피드백 상세를 여는 주소.
// 상세는 단건 조회(BE LAN-374)로 열리므로 목록 필터와 무관하다 — open만 싣는다
import type { FeedbackStatus } from '../api/feedback-list';

export function feedbackOpenPath(feedback: {
  feedbackId?: number;
  status?: FeedbackStatus;
}): string {
  return `/feedbacks?open=${feedback.feedbackId}`;
}
