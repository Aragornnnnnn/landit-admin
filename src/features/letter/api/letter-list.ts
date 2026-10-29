// 편지(공지·업데이트·답장) 목록 API — 경로·응답 타입·조회 함수. 편지 화면과 대시보드가 같이 쓴다
import { api } from '@/shared/api/client';
import type { components } from '@/shared/api/mailbox-schema';

export type LetterListResponse =
  components['schemas']['AdminMailboxLetterListResponse'];
export type LetterItem = components['schemas']['AdminMailboxLetterResponse'];
export type LetterLocale = NonNullable<LetterItem['locale']>;
export type LetterType = NonNullable<LetterItem['type']>;
export type LetterStatus = NonNullable<LetterItem['publicationStatus']>;

export const LETTERS_PATH = '/api/v1/admin/mailbox/letters';

/** 목록 한 장 — 공개 상태·타입·페이지는 BE 쿼리 파라미터 그대로 넘긴다 */
export function fetchLetterPage(params: URLSearchParams) {
  return api.get<LetterListResponse>(`${LETTERS_PATH}?${params}`);
}
