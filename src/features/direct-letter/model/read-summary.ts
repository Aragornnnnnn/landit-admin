// 수신자 읽음 현황과 현재 활성 사용자에 대한 재작성 대상을 계산한다.
import type { DirectLetterRecipient } from '@/shared/api/schema-patch';

export function summarizeReads(recipients: DirectLetterRecipient[]) {
  const total = recipients.length;
  const read = recipients.filter(
    (recipient) => recipient.readAt != null,
  ).length;
  return {
    total,
    read,
    unread: total - read,
    percent: total ? (read / total) * 100 : 0,
  };
}

export function selectRepeatRecipients(
  ids: number[],
  users: { userProfileId?: number; nickname?: string; status?: string }[],
) {
  const unique = [...new Set(ids)];
  const recipients = unique.flatMap((id) => {
    const user = users.find(
      (candidate) =>
        candidate.userProfileId === id && candidate.status === 'ACTIVE',
    );
    return user
      ? [{ userProfileId: id, nickname: user.nickname ?? `사용자 ${id}` }]
      : [];
  });
  return { recipients, excluded: unique.length - recipients.length };
}
