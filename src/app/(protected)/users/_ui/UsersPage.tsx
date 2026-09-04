'use client';

// 사용자 목록 화면 조립 — 필터 줄(진행 표시 포함) · 표 · 로컬 페이징 (docs/screens/users.md)
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import type { UserListItem } from '@/features/user/api/user-list';
import { cn } from '@/shared/lib/cn';
import { formatDateDot } from '@/shared/lib/format-time';
import { useIsMobile } from '@/shared/lib/use-mobile';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Button } from '@/shared/ui/shadcn/button';
import { StatusChip } from '@/shared/ui/StatusChip';

import { useAllUsersQuery } from '../_model/useAllUsersQuery';
import {
  changeUserFilter,
  filterUsers,
  hasActiveUserFilter,
  pageOfUsers,
  readUserFilter,
  USERS_PAGE_SIZE,
  writeUserFilter,
  type UserFilter,
} from '../_model/user-filter';
import {
  USER_ROLE_LABEL,
  USER_STATUS_DOT,
  USER_STATUS_LABEL,
  usersRangeLabel,
} from '../_model/user-label';
import { UserFilters } from './UserFilters';
import { UserTable } from './UserTable';

export function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const filter = readUserFilter(searchParams);
  const { users, isPending, isError, refetch, isLoadingMore } =
    useAllUsersQuery();

  const matched = filterUsers(users, filter);
  const shown = pageOfUsers(matched, filter.page);
  const lastPage = Math.max(0, Math.ceil(matched.length / USERS_PAGE_SIZE) - 1);

  const change = (patch: Partial<UserFilter>) => {
    const query = writeUserFilter(changeUserFilter(filter, patch));
    router.replace(query ? `?${query}` : '/users', { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <UserFilters
        filter={filter}
        loaded={users.length}
        loading={isLoadingMore}
        onChange={change}
      />

      {isPending ? (
        <ListSkeleton rows={6} />
      ) : isError ? (
        <InlineError
          message="사용자를 불러오지 못했어요"
          onRetry={() => refetch()}
        />
      ) : shown.length === 0 ? (
        <EmptyState
          className="rounded-[20px] bg-card"
          title={
            hasActiveUserFilter(filter)
              ? '조건에 맞는 사용자가 없어요'
              : '아직 사용자가 없어요'
          }
          description={
            isLoadingMore
              ? '아직 다 불러오지 못했어요. 잠시 뒤 다시 보여요'
              : undefined
          }
        />
      ) : isMobile ? (
        <UserCardList users={shown} />
      ) : (
        <UserTable users={shown} />
      )}

      {shown.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-subtle">
            {usersRangeLabel(filter.page, USERS_PAGE_SIZE, matched.length)}
          </span>
          <span className="ml-auto flex gap-2">
            <Button
              variant="outline"
              disabled={filter.page === 0}
              onClick={() => change({ page: filter.page - 1 })}
              className="h-9 px-3.5 text-[13px]"
            >
              이전
            </Button>
            <Button
              variant="outline"
              disabled={filter.page >= lastPage}
              onClick={() => change({ page: filter.page + 1 })}
              className="h-9 px-3.5 text-[13px]"
            >
              다음
            </Button>
          </span>
        </div>
      )}
    </div>
  );
}

// 모바일 프레임은 없다 — 다른 화면의 카드 목록과 같은 규칙으로 둔다 (docs/screens/users.md "상태")
function UserCardList({ users }: { users: UserListItem[] }) {
  return (
    <ul className="flex flex-col overflow-hidden rounded-[18px] bg-card">
      {users.map((user) => (
        <li
          key={user.userProfileId}
          className="border-t border-hairline first:border-t-0"
        >
          <Link
            href={`/users/${user.userProfileId}`}
            className="flex flex-col gap-1.5 px-4 py-3"
          >
            <span className="flex items-center gap-1.5">
              {user.role && (
                <StatusChip>{USER_ROLE_LABEL[user.role]}</StatusChip>
              )}
              {user.status && (
                <StatusChip dot={USER_STATUS_DOT[user.status]}>
                  {USER_STATUS_LABEL[user.status]}
                </StatusChip>
              )}
              <span className="ml-auto text-[13px] text-subtle">
                {user.createdAt ? formatDateDot(user.createdAt) : ''}
              </span>
              <ChevronRight className="size-4 text-subtle" aria-hidden />
            </span>
            <span className={cn('text-[15px] font-medium text-strong')}>
              {user.nickname || '—'}
            </span>
            <span className="truncate text-[13px] text-subtle">
              #{user.userProfileId} · {user.email}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
