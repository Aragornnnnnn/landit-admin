'use client';

// 사용자 목록 탭 — 전체 사용자를 받아 둔 목록에서 활성 사용자만 검색해 체크한다. BE에 검색이 없어 받아 둔 전체에서 거른다
import { useState } from 'react';

import { useAllUsersQuery } from '@/features/user/model/useAllUsersQuery';
import { formatCount } from '@/shared/lib/format-count';
import { InlineError } from '@/shared/ui/InlineError';
import { Button } from '@/shared/ui/shadcn/button';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';
import { Input } from '@/shared/ui/shadcn/input';

import type { Recipient } from '../_model/direct-letter-draft';
import { searchActiveUsers, toRecipient } from '../_model/recipient-pick';

/** 한 번에 펼치는 행 수 — 더 보기를 누를 때마다 이만큼 늘린다 */
const PAGE_ROWS = 20;

interface RecipientPickTabProps {
  /** 이미 받는 사람인 ID — 체크된 채 잠근다 */
  chosen: Set<number>;
  onAdd: (recipients: Recipient[]) => void;
}

export function RecipientPickTab({ chosen, onAdd }: RecipientPickTabProps) {
  const all = useAllUsersQuery();
  const [keyword, setKeyword] = useState('');
  const [shown, setShown] = useState(PAGE_ROWS);
  const [pending, setPending] = useState<Recipient[]>([]);

  const found = searchActiveUsers(all.users, keyword);
  const rows = found.slice(0, shown);
  const pendingIds = new Set(pending.map((r) => r.userProfileId));

  const toggle = (recipient: Recipient, checked: boolean) =>
    setPending((list) =>
      checked
        ? [...list, recipient]
        : list.filter((r) => r.userProfileId !== recipient.userProfileId),
    );

  if (all.isError)
    return (
      <InlineError
        message="사용자를 불러오지 못했어요"
        onRetry={() => all.refetch()}
        className="py-8"
      />
    );

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value);
            setShown(PAGE_ROWS);
          }}
          placeholder="이메일 · 닉네임 · ID"
          aria-label="사용자 검색"
          className="h-auto flex-1 rounded-[10px] border-hairline bg-card px-3.5 py-2 text-[13px] shadow-none placeholder:text-subtle"
        />
        {/* 탈퇴·정지에게는 보낼 수 없어 끌 수 없는 조건이다 — 버튼이 아니라 표시만 */}
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-body">
          활성 사용자만
        </span>
      </div>

      <ul className="flex flex-col rounded-[10px] border border-hairline bg-card p-1">
        {all.isPending ? (
          <li className="px-3 py-6 text-center text-[13px] text-subtle">
            불러오는 중
          </li>
        ) : rows.length === 0 ? (
          <li className="px-3 py-6 text-center text-[13px] text-subtle">
            조건에 맞는 사용자가 없어요
          </li>
        ) : (
          rows.map((user) => {
            const already = chosen.has(user.userProfileId);
            return (
              <li key={user.userProfileId}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-hairline">
                  <Checkbox
                    checked={already || pendingIds.has(user.userProfileId)}
                    disabled={already}
                    onCheckedChange={(value) =>
                      toggle(toRecipient(user), value === true)
                    }
                  />
                  <span className="text-[12px] text-subtle">
                    #{user.userProfileId}
                  </span>
                  <span className="text-[13px] font-medium text-strong">
                    {user.nickname || '—'}
                  </span>
                  <span className="truncate text-[12px] text-subtle">
                    {user.email}
                  </span>
                </label>
              </li>
            );
          })
        )}
      </ul>

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-subtle">
          {found.length > 0 &&
            `1–${rows.length} / ${formatCount(found.length)}${all.isLoadingMore ? ' · 불러오는 중' : ''}`}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          {rows.length < found.length && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShown((n) => n + PAGE_ROWS)}
            >
              더 보기
            </Button>
          )}
          <Button
            size="sm"
            disabled={pending.length === 0}
            onClick={() => {
              onAdd(pending);
              setPending([]);
            }}
          >
            {pending.length}명 추가
          </Button>
        </span>
      </div>
    </>
  );
}
