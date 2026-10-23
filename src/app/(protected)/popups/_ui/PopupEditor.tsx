'use client';

// 팝업 입력·이미지 업로드와 노출 설정 저장 확인을 제공한다.
import { useEffect, useState } from 'react';

import {
  SUBSCRIPTION_AUDIENCE_LABELS,
  SubscriptionAudienceFields,
} from '@/features/subscription/ui/SubscriptionAudienceFields';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog';
import { Input } from '@/shared/ui/shadcn/input';
import { Switch } from '@/shared/ui/shadcn/switch';

import type { Popup } from '../_api/popups';
import {
  EMPTY_POPUP,
  hasPopupChanges,
  toPopupDraft,
  validatePopupDraft,
} from '../_model/popup-draft';
import { useSavePopupMutation } from '../_model/useSavePopupMutation';
import { useUploadPopupImage } from '../_model/useUploadPopupImage';
import { PopupExcludedUsers } from './PopupExcludedUsers';

export function PopupEditor({
  original,
  onClose,
}: {
  original?: Popup;
  onClose: () => void;
}) {
  const initial = original ? toPopupDraft(original) : EMPTY_POPUP;
  const [draft, setDraft] = useState(initial);
  const { uploading, uploadImage } = useUploadPopupImage((imageUrl) =>
    setDraft((current) => ({ ...current, imageUrl })),
  );
  const [confirm, setConfirm] = useState<'save' | 'discard' | null>(null);
  const save = useSavePopupMutation(onClose);
  const busy = uploading || save.isPending;
  const dirty = hasPopupChanges(draft, initial);
  const invalid = validatePopupDraft(draft, original);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty || busy) event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, busy]);
  function closeEditor() {
    if (!busy) {
      if (dirty) setConfirm('discard');
      else onClose();
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) closeEditor();
      }}
    >
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto sm:max-w-xl"
        showCloseButton={false}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogTitle>{original ? '팝업 수정' : '팝업 등록'}</DialogTitle>
        <DialogDescription>
          한국 시간(KST) 기준이에요. 저장한 설정은 다음 앱 조회부터 적용돼요.
        </DialogDescription>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy && !invalid && dirty) setConfirm('save');
          }}
        >
          <fieldset disabled={busy || confirm !== null} className="space-y-4">
            <label className="block space-y-2 text-sm">
              제목
              <Input
                required
                maxLength={200}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </label>
            <label className="block space-y-2 text-sm">
              이미지 주소
              <Input
                required
                type="url"
                maxLength={2048}
                placeholder="https://…"
                value={draft.imageUrl}
                onChange={(e) =>
                  setDraft({ ...draft, imageUrl: e.target.value })
                }
              />
            </label>
            <label className="block space-y-2 text-sm">
              이미지 업로드
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) void uploadImage(file);
                }}
              />
              <span className="text-xs text-subtle">
                {uploading ? '업로드 중…' : 'PNG·JPEG·WebP, 최대 10 MiB'}
              </span>
            </label>
            {draft.imageUrl.startsWith('https://') && (
              <div className="rounded-xl bg-muted p-3">
                {/* 등록할 원본의 비율을 확인하는 미리보기이므로 최적화 프록시를 거치지 않는다. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.imageUrl}
                  alt="팝업 이미지 미리보기"
                  referrerPolicy="no-referrer"
                  className="mx-auto max-h-40 max-w-full object-contain"
                />
              </div>
            )}
            <label className="block space-y-2 text-sm">
              연결 링크 (선택)
              <Input
                maxLength={2048}
                placeholder="/learn 또는 https://…"
                value={draft.linkUrl}
                onChange={(e) =>
                  setDraft({ ...draft, linkUrl: e.target.value })
                }
              />
              <span className="text-xs text-subtle">
                비우면 연결 링크가 제거돼요.
              </span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="min-w-0 space-y-2 text-sm">
                시작 시각 (KST)
                <Input
                  required
                  type="datetime-local"
                  value={draft.startsAt}
                  onChange={(e) =>
                    setDraft({ ...draft, startsAt: e.target.value })
                  }
                />
              </label>
              <label className="min-w-0 space-y-2 text-sm">
                종료 시각 (KST)
                <Input
                  required
                  type="datetime-local"
                  value={draft.endsAt}
                  onChange={(e) =>
                    setDraft({ ...draft, endsAt: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="block space-y-2 text-sm">
              우선순위
              <Input
                required
                type="number"
                min={0}
                max={2147483647}
                step={1}
                value={draft.priority}
                onChange={(e) =>
                  setDraft({ ...draft, priority: e.target.value })
                }
              />
            </label>
            <label className="flex items-center justify-between text-sm">
              팝업 켜기
              <Switch
                checked={draft.enabled}
                onCheckedChange={(enabled) => setDraft({ ...draft, enabled })}
              />
            </label>
            <section className="space-y-4 rounded-xl border border-hairline p-4">
              <div>
                <h2 className="text-sm font-semibold">숨길 대상</h2>
                <p className="mt-1 text-xs text-subtle">
                  선택한 유형 또는 사용자에게 이 팝업을 숨겨요. 구독 상태는
                  팝업을 조회할 때 판단해요.
                </p>
              </div>
              <SubscriptionAudienceFields
                selected={draft.excludedAudiences}
                onChange={(excludedAudiences) =>
                  setDraft({ ...draft, excludedAudiences })
                }
              />
            </section>
            <PopupExcludedUsers
              selected={draft.excludedUserIds}
              onChange={(excludedUserIds) =>
                setDraft({ ...draft, excludedUserIds })
              }
            />
            {invalid && <p className="text-xs text-subtle">{invalid}</p>}
          </fieldset>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={closeEditor}
            >
              닫기
            </Button>
            <Button type="submit" disabled={busy || !!invalid || !dirty}>
              저장
            </Button>
          </div>
        </form>
        <ActionConfirmDialog
          open={confirm !== null}
          title={
            confirm === 'save'
              ? '팝업 설정을 저장할까요?'
              : '변경 내용을 버릴까요?'
          }
          pending={busy}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm === 'discard') onClose();
            else if (!busy && !invalid) save.mutate({ draft, original });
          }}
        >
          {confirm === 'save' ? (
            <>
              <p>{draft.title}</p>
              <p>숨길 사용자 · {draft.excludedUserIds.length}명</p>
              <p>
                숨길 구독 유형 ·{' '}
                {draft.excludedAudiences
                  .map((audience) => SUBSCRIPTION_AUDIENCE_LABELS[audience])
                  .join(', ') || '없음'}
              </p>
              <p>
                {draft.startsAt.replace('T', ' ')} ~{' '}
                {draft.endsAt.replace('T', ' ')} (KST)
              </p>
              <p>
                {draft.enabled
                  ? `켜짐 · 우선순위 ${draft.priority}. 기간과 우선순위에 따라 앱에 노출돼요.`
                  : '꺼짐 · 다음 앱 조회부터 노출 대상에서 제외돼요.'}
              </p>
            </>
          ) : (
            <p>저장하지 않은 입력이 사라져요.</p>
          )}
        </ActionConfirmDialog>
      </DialogContent>
    </Dialog>
  );
}
