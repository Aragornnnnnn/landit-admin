'use client';

// ID 붙여넣기 탭 (Figma 2594:883) — 붙여넣은 ID를 전체 사용자 목록에 비춰, 활성인 사람만 추가하고 없거나 탈퇴한 ID는 빨갛게 센다.
// BE는 틀린 ID가 하나라도 있으면 전체를 취소하므로, 목록을 끝까지 받기 전엔 판정하지 않는다
import { useState } from 'react';

import { useAllUsersQuery } from '@/features/user/model/useAllUsersQuery';
import { parseIdList } from '@/shared/lib/parse-id-list';
import { InlineError } from '@/shared/ui/InlineError';
import { Button } from '@/shared/ui/shadcn/button';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import type { Recipient } from '../_model/direct-letter-draft';
import { checkPastedIds } from '../_model/recipient-pick';

export function RecipientPasteTab({
  onAdd,
}: {
  onAdd: (recipients: Recipient[]) => void;
}) {
  const all = useAllUsersQuery();
  const [text, setText] = useState('');
  const parsed = parseIdList(text);
  const loaded = !all.isPending && !all.isLoadingMore;
  const check = loaded ? checkPastedIds(parsed.ids, all.users) : undefined;

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
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="1284, 1283 1279&#10;1201"
        aria-label="붙여넣을 ID"
        rows={5}
        className="min-h-0 rounded-[10px] border-hairline bg-card px-3.5 py-2.5 font-mono text-[13px] shadow-none placeholder:font-sans placeholder:text-subtle"
      />
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-subtle">
          {parsed.recognized}개 인식
          {parsed.duplicates > 0 && ` · 중복 ${parsed.duplicates}개 제거`}
          {parsed.invalid > 0 && ` · 잘못된 값 ${parsed.invalid}개`}
          {check && check.unavailable.length > 0 && (
            <span className="text-destructive">
              {` · 없거나 탈퇴 ${check.unavailable.length}개 (${check.unavailable.map((id) => `#${id}`).join(' ')})`}
            </span>
          )}
          {!loaded && parsed.recognized > 0 && ' · 사용자 확인 중'}
        </span>
        <Button
          size="sm"
          className="ml-auto"
          disabled={!check || check.ready.length === 0}
          onClick={() => {
            if (!check) return;
            onAdd(check.ready);
            setText('');
          }}
        >
          {check?.ready.length ?? 0}명 추가
        </Button>
      </div>
    </>
  );
}
