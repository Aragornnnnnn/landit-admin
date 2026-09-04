// 피드백 유형·상태를 사람이 읽는 말로 — 사용자 웹 편지함과 같은 문구를 쓴다 (docs/admin-spec.md "칩").
// 프리미티브(StatusChip)는 이 매핑을 모른다. 피드백 화면·대시보드·사용자 상세가 같이 쓴다
import type { FeedbackStatus, FeedbackType } from '../api/feedback-list';

export const FEEDBACK_TYPE_LABEL: Record<FeedbackType, string> = {
  BUG_REPORT: '문제 신고',
  FEATURE_REQUEST: '기능 요청',
  QUESTION: '문의',
  CHEER: '응원',
};

export const FEEDBACK_STATUS_LABEL: Record<FeedbackStatus, string> = {
  PENDING: '처리중',
  COMPLETED: '처리완료',
};

/** 상태 점 색 — 처리중은 오렌지(할 일), 처리완료는 초록(끝난 일) */
export const FEEDBACK_STATUS_DOT: Record<FeedbackStatus, 'progress' | 'done'> =
  {
    PENDING: 'progress',
    COMPLETED: 'done',
  };
