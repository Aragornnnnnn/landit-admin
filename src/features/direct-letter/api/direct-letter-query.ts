// 개인 편지 목록·상세의 백엔드 계약을 연결한다.
import { api } from '@/shared/api/client';
import type { DirectLetterRecipient, Schema } from '@/shared/api/schema-patch';

export const DIRECT_LETTER_KEY = ['direct-letters'] as const;
const PATH = '/api/v1/admin/mailbox/direct-letters';
export type LetterSummary = Required<Schema<'AdminMailboxDirectLetterSummary'>>;
export type LetterPage = Omit<
  Required<Schema<'AdminMailboxDirectLetterListResponse'>>,
  'items'
> & { items: LetterSummary[] };
export type LetterDetail = Omit<
  Required<Schema<'AdminMailboxDirectLetterDetailResponse'>>,
  'recipients'
> & { recipients: DirectLetterRecipient[] };

export function fetchDirectLetters(page: number) {
  return api.get<LetterPage>(
    `${PATH}?${new URLSearchParams({ page: String(page), size: '20' })}`,
  );
}
export function fetchDirectLetter(id: number) {
  return api.get<LetterDetail>(`${PATH}/${id}`);
}
