// 목록 필터 줄의 선택지 — 유형·상태·기간·정렬. 문구는 features/feedback의 라벨을 그대로 쓴다
import type { FeedbackType } from '@/features/feedback/api/feedback-list';
import { FEEDBACK_TYPE_LABEL } from '@/features/feedback/model/feedback-label';

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
