// 콘텐츠 제작 배치 API — 경로·좁힌 타입·요청 함수. 목록·배치 상세·Day 상세 세 라우트가 같이 쓴다 (docs/screens/content-batches.md "데이터")
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export const CONTENT_BATCHES_PATH = '/api/v1/admin/content-batches';

export type ContentBatch = Schema<'AdminContentBatchSummary'>;
export type ContentBatchStatus = ContentBatch['status'];
export type ContentBatchPage = Schema<'AdminContentBatchPage'>;
export type ContentBatchDetail = Schema<'AdminContentBatchResponse'>;
export type ContentDaySummary = Schema<'AdminContentDraftSummary'>;
export type ContentDraftStatus = ContentDaySummary['status'];
export type ContentDraft = Schema<'AdminContentDraftDetail'>;
export type ContentReviewComment = Schema<'AdminContentReviewCommentResponse'>;
export type ContentNextDay = Schema<'AdminContentNextDayResponse'>;
export type ReviewVerdict = ContentReviewComment['verdict'];

export const CONTENT_CHARACTERS = ['chloe', 'marco', 'teddy'] as const;
export type ContentCharacter = (typeof CONTENT_CHARACTERS)[number];
export type CharacterRatio = Record<ContentCharacter, number>;

/** 접수 요청 — 스웨거는 전부 optional로 찍지만 BE는 넷 다 받는다(design.md 5절) */
export interface ContentBatchRequest {
  dayCount: number;
  characterRatio: CharacterRatio;
  note: string;
  autoProceed: boolean;
}

/** 라인업 행 저장 — 겹침 경고는 보내지 않는다(AI 제안을 BE가 유지한다). 카테고리는 번호 또는 새 이름 중 하나 */
export type LineupRowRequest = Schema<'AdminContentLineupRowRequest'> & {
  day: number;
};

export interface ReviewCommentRequest {
  targetPath?: string;
  comment: string;
}

export function fetchContentNextDay() {
  return api.get<ContentNextDay>(`${CONTENT_BATCHES_PATH}/next-day`);
}

/** 목록 한 장 — BE는 page·size만 받는다. 상태 필터는 화면이 거른다 */
export function fetchContentBatchPage(page: number, size: number) {
  return api.get<ContentBatchPage>(
    `${CONTENT_BATCHES_PATH}?page=${page}&size=${size}`,
  );
}

export function fetchContentBatch(batchId: number) {
  return api.get<ContentBatchDetail>(`${CONTENT_BATCHES_PATH}/${batchId}`);
}

export function createContentBatch(body: ContentBatchRequest) {
  return api.post<ContentBatchDetail>(CONTENT_BATCHES_PATH, body);
}

/** 예약 Day 전부를 한 번에 — 빠지거나 겹치면 400, LINEUP_READY가 아니면 409 */
export function updateLineup(batchId: number, rows: LineupRowRequest[]) {
  return api.put<ContentBatchDetail>(
    `${CONTENT_BATCHES_PATH}/${batchId}/lineup`,
    { rows },
  );
}

export function regenerateLineup(batchId: number, comment: string) {
  return api.post<ContentBatchDetail>(
    `${CONTENT_BATCHES_PATH}/${batchId}/lineup/regenerate`,
    { comment },
  );
}

export function proceedContentBatch(batchId: number) {
  return api.post<ContentBatchDetail>(
    `${CONTENT_BATCHES_PATH}/${batchId}/proceed`,
  );
}

/** FAILED 또는 heartbeat가 멈춘 GENERATING만 — 아니면 409 */
export function resumeContentBatch(batchId: number) {
  return api.post<ContentBatchDetail>(
    `${CONTENT_BATCHES_PATH}/${batchId}/resume`,
  );
}

export function approveContentBatch(batchId: number) {
  return api.post<ContentBatchDetail>(
    `${CONTENT_BATCHES_PATH}/${batchId}/approve`,
  );
}

export function fetchContentDraft(batchId: number, draftId: number) {
  return api.get<ContentDraft>(
    `${CONTENT_BATCHES_PATH}/${batchId}/drafts/${draftId}`,
  );
}

/** FIX는 코멘트 1개 이상(400). OK는 열린 FIX 코멘트를 해결 처리한다 */
export function reviewContentDraft(
  batchId: number,
  draftId: number,
  verdict: ReviewVerdict,
  comments: ReviewCommentRequest[],
) {
  return api.put<ContentDraft>(
    `${CONTENT_BATCHES_PATH}/${batchId}/drafts/${draftId}/review`,
    { verdict, comments },
  );
}

/** scope 표기는 regeneration-scope.ts가 만든다 */
export function regenerateContentDraft(
  batchId: number,
  draftId: number,
  scope: string,
) {
  return api.post<ContentDraft>(
    `${CONTENT_BATCHES_PATH}/${batchId}/drafts/${draftId}/regenerate`,
    { scope },
  );
}
