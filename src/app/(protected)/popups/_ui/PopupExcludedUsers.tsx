'use client';

// 팝업을 숨길 활성 사용자를 서버에서 검색하고 선택을 유지한다.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUserPage } from '@/features/user/api/user-list';
import { InlineError } from '@/shared/ui/InlineError';
import { Button } from '@/shared/ui/shadcn/button';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';
import { Input } from '@/shared/ui/shadcn/input';

export function PopupExcludedUsers({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const params = new URLSearchParams({
    keyword: keyword.trim(),
    status: 'ACTIVE',
    page: String(page),
    size: '20',
  });
  const query = useQuery({
    queryKey: ['popup-excluded-users', params.toString()],
    queryFn: () => fetchUserPage(params),
    staleTime: 0,
  });
  const toggleUser = (id: number, checked: boolean) =>
    onChange(
      checked
        ? [...new Set([...selected, id])]
        : selected.filter((value) => value !== id),
    );
  return (
    <section className="space-y-3 rounded-xl border border-hairline p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">
          숨길 사용자 · {selected.length}명
        </h2>
        {selected.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
          >
            전체 선택 해제
          </Button>
        )}
      </div>
      <p className="text-xs text-subtle">
        선택한 사용자에게 이 팝업을 숨겨요. 최대 1000명까지 선택할 수 있어요.
      </p>
      {selected.length > 0 && (
        <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto">
          {selected.map((id) => (
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
        maxLength={100}
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
          setPage(0);
        }}
      />
      {query.isError ? (
        <InlineError
          message="사용자 목록을 불러오지 못했어요."
          onRetry={() => query.refetch()}
        />
      ) : (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-hairline p-2">
          {query.isPending && (
            <p className="p-2 text-xs text-subtle">
              사용자를 불러오는 중이에요.
            </p>
          )}
          {!query.isPending && !query.data?.items?.length && (
            <p className="p-2 text-xs text-subtle">검색 결과가 없어요.</p>
          )}
          {query.data?.items?.map((user) =>
            user.userProfileId == null ? null : (
              <label
                key={user.userProfileId}
                className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-muted"
              >
                <Checkbox
                  checked={selected.includes(user.userProfileId)}
                  disabled={
                    selected.length >= 1000 &&
                    !selected.includes(user.userProfileId)
                  }
                  onCheckedChange={(checked) =>
                    user.userProfileId != null &&
                    toggleUser(user.userProfileId, checked === true)
                  }
                />
                <span className="min-w-0">
                  <span>
                    #{user.userProfileId} {user.nickname}
                  </span>
                  <span className="block truncate text-xs text-subtle">
                    {user.email}
                  </span>
                </span>
              </label>
            ),
          )}
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={page === 0 || query.isFetching}
          onClick={() => setPage(page - 1)}
        >
          이전
        </Button>
        <span className="text-xs text-subtle">{page + 1}페이지</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={!query.data?.hasNext || query.isFetching || query.isError}
          onClick={() => setPage(page + 1)}
        >
          다음
        </Button>
      </div>
    </section>
  );
}
