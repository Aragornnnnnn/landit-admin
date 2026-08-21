'use client';

// 데스크톱 사용자 표 — 흰 카드, 한 줄 걸러 옅은 배경 (Figma 1050:11383).
// 닉네임이 없는 사용자는 "—"다. 빈칸으로 두면 셀이 밀려 보인다
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import type { AdminUserListItem } from '@/shared/api/schema-patch';
import { cn } from '@/shared/lib/cn';
import { formatDateDot } from '@/shared/lib/format-time';

import {
  USER_ROLE_DOT,
  USER_ROLE_LABEL,
  USER_STATUS_DOT,
  USER_STATUS_LABEL,
} from '../_model/user-label';

// Figma 셀 너비 — ID 86 / 이메일 flex / 닉네임 120 / 역할 110 / 상태 110 / 가입 110 / › 16
const CELL = {
  id: 'w-[86px] shrink-0',
  email: 'flex-1 min-w-px',
  nickname: 'w-[120px] shrink-0',
  role: 'w-[110px] shrink-0',
  status: 'w-[110px] shrink-0',
  joinedAt: 'w-[110px] shrink-0',
  chevron: 'w-4 shrink-0',
};

const DOT_COLOR = { progress: 'bg-primary', done: 'bg-success' } as const;

export function UserTable({ users }: { users: AdminUserListItem[] }) {
  return (
    <div className="w-full rounded-[20px] bg-card px-2 pb-2">
      <div
        role="row"
        className="flex w-full items-center gap-4 px-5 pt-3 pb-2 text-xs font-medium text-subtle"
      >
        <span className={CELL.id}>ID</span>
        <span className={CELL.email}>이메일</span>
        <span className={CELL.nickname}>닉네임</span>
        <span className={CELL.role}>역할</span>
        <span className={CELL.status}>상태</span>
        <span className={CELL.joinedAt}>가입</span>
        <span className={CELL.chevron} />
      </div>

      <div className="flex flex-col gap-0.5">
        {users.map((user, index) => (
          <Link
            key={user.userProfileId}
            href={`/users/${user.userProfileId}`}
            className={cn(
              'flex w-full items-center gap-4 rounded-xl px-5 py-3 transition-colors hover:bg-muted',
              index % 2 === 0 && 'bg-stripe',
            )}
          >
            <span className={cn(CELL.id, 'text-[13px] text-subtle')}>
              #{user.userProfileId}
            </span>
            <span
              className={cn(CELL.email, 'truncate text-[13px] text-strong')}
            >
              {user.email}
            </span>
            <span
              className={cn(CELL.nickname, 'truncate text-[13px] text-body')}
            >
              {user.nickname || '—'}
            </span>
            <Cell
              className={CELL.role}
              dot={user.role ? USER_ROLE_DOT[user.role] : undefined}
              label={user.role ? USER_ROLE_LABEL[user.role] : ''}
            />
            <Cell
              className={CELL.status}
              dot={user.status ? USER_STATUS_DOT[user.status] : undefined}
              label={user.status ? USER_STATUS_LABEL[user.status] : ''}
            />
            <span className={cn(CELL.joinedAt, 'text-[13px] text-subtle')}>
              {user.createdAt ? formatDateDot(user.createdAt) : ''}
            </span>
            <ChevronRight
              className={cn(CELL.chevron, 'text-subtle')}
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

function Cell({
  className,
  dot,
  label,
}: {
  className: string;
  dot: 'progress' | 'done' | undefined;
  label: string;
}) {
  return (
    <span className={cn(className, 'flex items-center gap-[5px]')}>
      {dot && (
        <span
          aria-hidden
          className={cn('size-1.5 rounded-full', DOT_COLOR[dot])}
        />
      )}
      <span className="text-[13px] text-body">{label}</span>
    </span>
  );
}
