'use client';

// 공지를 숨길 구독 유형과 개별 사용자를 복수 선택한다.
import { useState } from 'react';

import { SubscriptionAudienceFields } from '@/features/subscription/ui/SubscriptionAudienceFields';
import { useAllUsersQuery } from '@/features/user/model/useAllUsersQuery';
import { InlineError } from '@/shared/ui/InlineError';
import { Button } from '@/shared/ui/shadcn/button';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';
import { Input } from '@/shared/ui/shadcn/input';

import type { LetterDraft } from '../_model/letter-draft';

export function LetterAudienceFields({
  draft,
  onChange,
}: {
  draft: LetterDraft;
  onChange: (draft: LetterDraft) => void;
}) {
  const all = useAllUsersQuery();
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(20);
  const needle = keyword.trim().toLowerCase();
  const found = all.users.filter(
    (user) =>
      user.status === 'ACTIVE' &&
      user.userProfileId != null &&
      `${user.userProfileId} ${user.email ?? ''} ${user.nickname ?? ''}`
        .toLowerCase()
        .includes(needle),
  );
  const toggleUser = (id: number, checked: boolean) =>
    onChange({
      ...draft,
      excludedUserIds: checked
        ? [...draft.excludedUserIds, id]
        : draft.excludedUserIds.filter((value) => value !== id),
    });
  return (
    <section className="flex flex-col gap-4 rounded-[20px] border border-hairline bg-card p-5 sm:p-6">
      <div>
        <h2 className="font-semibold text-foreground">숨길 대상</h2>
        <p className="mt-1 text-sm text-subtle">
          선택한 유형 또는 사용자에게 이 공지를 숨겨요. 구독 상태는 공지를
          조회할 때 판단해요.
        </p>
      </div>
      <SubscriptionAudienceFields
        selected={draft.excludedAudiences}
        onChange={(excludedAudiences) =>
          onChange({ ...draft, excludedAudiences })
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">
          개별 사용자 · {draft.excludedUserIds.length}명
        </span>
        {draft.excludedUserIds.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ ...draft, excludedUserIds: [] })}
          >
            선택 해제
          </Button>
        )}
      </div>
      {draft.excludedUserIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {draft.excludedUserIds.map((id) => (
            <button
              type="button"
              key={id}
              className="rounded-full bg-muted px-3 py-1 text-xs"
              onClick={() => toggleUser(id, false)}
              aria-label={`사용자 ${id} 숨김 해제`}
            >
              #{id} ×
            </button>
          ))}
        </div>
      )}
      <Input
        aria-label="숨길 사용자 검색"
        placeholder="이메일 · 닉네임 · ID 검색"
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
          setLimit(20);
        }}
      />
      {all.isError ? (
        <InlineError
          message="사용자 목록을 불러오지 못했어요."
          onRetry={() => all.refetch()}
        />
      ) : (
        <div className="max-h-64 overflow-y-auto rounded-xl border border-hairline p-2">
          {all.isPending && (
            <p className="p-3 text-sm text-subtle">
              사용자를 불러오는 중이에요.
            </p>
          )}
          {!all.isPending && found.length === 0 && (
            <p className="p-3 text-sm text-subtle">검색 결과가 없어요.</p>
          )}
          {found.slice(0, limit).map((user) =>
            user.userProfileId == null ? null : (
              <label
                key={user.userProfileId}
                className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-muted"
              >
                <Checkbox
                  checked={draft.excludedUserIds.includes(user.userProfileId)}
                  disabled={
                    draft.excludedUserIds.length >= 1000 &&
                    !draft.excludedUserIds.includes(user.userProfileId)
                  }
                  onCheckedChange={(checked) =>
                    user.userProfileId != null &&
                    toggleUser(user.userProfileId, checked === true)
                  }
                />
                <span>
                  #{user.userProfileId} {user.nickname}
                </span>
                <span className="truncate text-subtle">{user.email}</span>
              </label>
            ),
          )}
          {limit < found.length && (
            <Button variant="ghost" onClick={() => setLimit(limit + 20)}>
              더 보기
            </Button>
          )}
        </div>
      )}
      <p className="text-xs text-subtle">
        {all.isLoadingMore ? '불러온 사용자 안에서 검색 중이에요. ' : ''}
        선택하지 않으면 작성된 언어를 사용하는 모든 사용자에게 보여요. 게시된
        공지는 저장 즉시 반영돼요.
      </p>
    </section>
  );
}
