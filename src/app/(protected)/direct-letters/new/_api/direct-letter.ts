// 개인 편지 발송 API — 경로·요청/응답 타입·발송 함수 (docs/screens/direct-letters.md "데이터")
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export type DirectLetterRequest = Schema<'AdminMailboxDirectLetterRequest'>;
// 스웨거는 응답 필드를 전부 optional로 찍지만 201이면 셋 다 온다 — 실계약으로 좁힌다
export type DirectLetterSent = Required<
  Schema<'AdminMailboxDirectLetterResponse'>
>;

export const DIRECT_LETTERS_PATH = '/api/v1/admin/mailbox/direct-letters';

/**
 * 받는 사람 전원에게 같은 편지를 즉시 발행한다. 푸시는 보내지 않는다.
 * BE에 멱등성 키가 없어 같은 요청을 다시 보내면 새 편지가 생긴다 — 호출부가 중복 클릭을 막는다
 */
export function sendDirectLetter(body: DirectLetterRequest) {
  return api.post<DirectLetterSent>(DIRECT_LETTERS_PATH, body);
}
