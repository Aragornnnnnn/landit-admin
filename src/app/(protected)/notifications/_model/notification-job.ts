// 발송 작업의 표시·폴링·동일 요청 재시도 규칙을 정의한다.
export type EmailAttempt = { recipient: string; key: string };
export function chooseEmailAttempt(
  previous: EmailAttempt | null,
  recipient: string,
  createKey: () => string,
): EmailAttempt {
  const normalized = recipient.trim();
  return previous?.recipient === normalized
    ? previous
    : { recipient: normalized, key: createKey() };
}
export const validJobId = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
export const shouldPollJob = (status?: string) =>
  status === 'PENDING' || status === 'PROCESSING';
export function jobLabel(status?: string) {
  const labels: Record<string, string> = {
    PENDING: '처리 대기',
    PROCESSING: '처리 중',
    ACCEPTED: '제공자 접수',
    UNKNOWN: '접수 여부 확인 필요',
    REJECTED: '접수 거절',
    FAILED: '처리 실패',
    EXCLUDED: '발송 제외',
    CANCELLED: '취소됨',
  };
  return status ? (labels[status] ?? status) : '확인되지 않음';
}
