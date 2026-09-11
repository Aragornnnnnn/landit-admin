// 피드백 목록 API — 경로·응답 타입·조회 함수. 피드백 화면·대시보드·사용자 상세·사이드바 배지가 같이 쓴다
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export type FeedbackListResponse = Schema<'AdminMailboxFeedbackListResponse'>;
export type FeedbackItem = Schema<'AdminMailboxFeedbackResponse'>;
export type FeedbackType = NonNullable<FeedbackItem['type']>;
export type FeedbackStatus = NonNullable<FeedbackItem['status']>;

export const FEEDBACKS_PATH = '/api/v1/admin/mailbox/feedbacks';

/** 목록 한 장 — 필터·정렬·페이지는 BE 쿼리 파라미터 그대로 넘긴다 */
export function fetchFeedbackPage(params: URLSearchParams) {
  return api.get<FeedbackListResponse>(`${FEEDBACKS_PATH}?${params}`);
}
