'use client';

// 이전 수신자 중 현재 활성 사용자만 새 편지 초안으로 가져온다.
import { selectRepeatRecipients } from '@/features/direct-letter/model/read-summary';
import { useDirectLetterQuery } from '@/features/direct-letter/model/useDirectLetterQuery';
import { useAllUsersQuery } from '@/features/user/model/useAllUsersQuery';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import { NewDirectLetterPage } from './NewDirectLetterPage';

export function RepeatLetterPage({ from }: { from: number }) {
  const letter = useDirectLetterQuery(from);
  const users = useAllUsersQuery();
  if (letter.isError || users.isError)
    return (
      <InlineError
        onRetry={() => {
          void letter.refetch();
          void users.refetch();
        }}
      />
    );
  if (letter.isPending || users.isPending || users.isLoadingMore)
    return <ListSkeleton rows={4} />;
  const { recipients, excluded } = selectRepeatRecipients(
    letter.data.recipients.map((recipient) => recipient.userProfileId),
    users.users,
  );
  return (
    <NewDirectLetterPage initialRecipients={recipients} excluded={excluded} />
  );
}
