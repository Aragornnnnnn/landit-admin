'use client';

// 관리자 팝업 목록과 등록·수정 진입점을 표시한다.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Button } from '@/shared/ui/shadcn/button';

import { fetchPopups, POPUPS_KEY, type Popup } from '../_api/popups';
import { toKstInput } from '../_model/popup-draft';
import { PopupEditor } from './PopupEditor';

export function PopupsPage() {
  const popups = useQuery({ queryKey: POPUPS_KEY, queryFn: fetchPopups });
  const [editing, setEditing] = useState<Popup | 'new' | null>(null);
  if (popups.isPending) return <ListSkeleton rows={4} />;
  if (popups.isError && !popups.data)
    return (
      <InlineError
        message="팝업을 불러오지 못했어요."
        onRetry={() => popups.refetch()}
      />
    );
  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm leading-relaxed text-subtle">
          켜진 팝업 중 노출 기간에 해당하는 하나를 보여줘요.
          <br />
          우선순위가 높을수록 먼저, 같으면 나중에 등록한 팝업이 표시돼요.
        </p>
        <Button onClick={() => setEditing('new')}>팝업 등록</Button>
      </div>
      {!popups.data?.length && (
        <EmptyState
          title="등록한 팝업이 없어요."
          description="팝업을 등록하고 노출 기간을 설정해 주세요."
        />
      )}
      <div className="grid gap-3 lg:grid-cols-2">
        {popups.data?.map((popup) => (
          <article
            key={popup.popupId}
            className="space-y-3 rounded-2xl border bg-card p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="min-w-0 truncate font-semibold">{popup.title}</h2>
              <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs">
                {popup.enabled ? '켜짐' : '꺼짐'}
              </span>
            </div>
            <p className="text-sm text-subtle">
              {toKstInput(popup.startsAt).replace('T', ' ')} ~<br />
              {toKstInput(popup.endsAt).replace('T', ' ')} (KST)
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-subtle">
                우선순위 {popup.priority} · #{popup.popupId}
              </span>
              <Button
                variant="outline"
                size="sm"
                aria-label={`${popup.title} 수정`}
                onClick={() => setEditing(popup)}
              >
                수정
              </Button>
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <PopupEditor
          original={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
