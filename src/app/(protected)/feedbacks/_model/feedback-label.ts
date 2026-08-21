// 피드백 유형·상태를 사람이 읽는 말로 — 사용자 웹 편지함과 같은 문구를 쓴다 (docs/admin-spec.md "칩").
// 프리미티브(StatusChip)는 이 매핑을 모른다 — 도메인 지식은 화면에 둔다
import type { FeedbackStatus, FeedbackType } from './feedback-filter';

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

export const FEEDBACK_TYPE_OPTIONS = [
  { value: 'ALL', label: '전체' },
  ...(
    ['BUG_REPORT', 'FEATURE_REQUEST', 'QUESTION', 'CHEER'] as FeedbackType[]
  ).map((type) => ({ value: type, label: FEEDBACK_TYPE_LABEL[type] })),
];

export const FEEDBACK_STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '처리중' },
  { value: 'COMPLETED', label: '처리완료' },
];

export const FEEDBACK_DAYS_OPTIONS = [
  { value: '7', label: '최근 7일' },
  { value: '30', label: '최근 30일' },
  { value: '90', label: '최근 90일' },
  { value: '0', label: '전체 기간' },
];

export const FEEDBACK_SORT_OPTIONS = [
  { value: 'NEWEST', label: '최신순' },
  { value: 'OLDEST', label: '오래된순' },
];
