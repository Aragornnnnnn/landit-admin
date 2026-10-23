// 서버의 서울 시각 만료와 회수 여부로 수동 권한 상태를 표시한다.
import type { Schema } from '@/shared/api/schema-patch';

export function isGrantActive(
  grant: Schema<'AdminSubscriptionGrantResponse'>,
  now = Date.now(),
) {
  if (grant.revokedAt || !grant.expiresAt) return false;
  const endsAt = /Z$|[+-]\d{2}:\d{2}$/.test(grant.expiresAt)
    ? grant.expiresAt
    : `${grant.expiresAt}+09:00`;
  return Date.parse(endsAt) > now;
}
