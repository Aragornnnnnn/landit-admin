// 발송 실패를 화면 갈래로 나눈다 — 받는 사람 문제(404)는 편집기 위 배너로, 나머지는 토스트 문구로 (docs/screens/direct-letters.md "인터랙션")
import { ApiError } from '@/shared/api/api-error';

/** recipients = 없거나 탈퇴한 받는 사람이 있어 BE가 전체를 취소했다(아무에게도 가지 않았다) */
export type SendFailure =
  { kind: 'recipients' } | { kind: 'other'; message: string };

const FALLBACK = '보내지 못했어요. 다시 시도해 주세요';

export function toSendFailure(error: unknown): SendFailure {
  if (!(error instanceof ApiError)) return { kind: 'other', message: FALLBACK };
  if (error.status === 404) return { kind: 'recipients' };
  // BE가 준 메시지까지만 보여 준다 — 스택·내부 URL은 UI에 내지 않는다 (docs/security.md)
  return { kind: 'other', message: error.message || FALLBACK };
}
