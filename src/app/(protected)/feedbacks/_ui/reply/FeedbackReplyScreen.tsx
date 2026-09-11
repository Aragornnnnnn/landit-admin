'use client';

// 모바일 답장 — 좁은 화면에선 시트가 아니라 화면 하나를 통째로 쓴다 (Figma 1050:9368).
// 셸까지 덮으므로 뒤로가기와 서버 표시를 이 화면이 직접 그리고, 보내기는 하단 고정 바에 둔다.
// 시트와 같은 Radix Dialog 위에 얹는다 — 포커스 가둠·Esc·바깥 스크롤 잠금을 직접 만들지 않으려고
import { ChevronLeft } from 'lucide-react';

import type { FeedbackItem } from '@/features/feedback/api/feedback-list';
import { Button } from '@/shared/ui/shadcn/button';
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/shadcn/sheet';

import type { ReplyDraft } from '../../_model/reply/useReplyDraft';
import { ServerBadge } from '../../../_ui/ServerBadge';
import { ReplyConfirmDialog } from './ReplyConfirmDialog';
import { ReplyFields } from './ReplyFields';

interface FeedbackReplyScreenProps {
  feedback: FeedbackItem;
  draft: ReplyDraft;
  onClose: () => void;
}

export function FeedbackReplyScreen({
  feedback,
  draft,
  onClose,
}: FeedbackReplyScreenProps) {
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        // 열자마자 뒤로가기에 포커스 링이 씌워지는 걸 막는다 — 화면 자체에 포커스를 둬 가둠은 그대로 유지한다
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement | null)?.focus();
        }}
        className="w-full gap-0 rounded-none border-0 bg-background p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-none"
      >
        <header className="flex h-14 shrink-0 items-center px-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="뒤로"
            className="-ml-2 rounded-md p-2 text-strong"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <ServerBadge className="ml-auto" />
        </header>

        {/* 하단 고정 바에 가리지 않게 콘텐츠 아래를 비워둔다 */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-[110px]">
          <SheetTitle className="text-[28px] leading-tight font-bold text-foreground">
            답장하기
          </SheetTitle>
          <ReplyFields feedback={feedback} draft={draft} variant="screen" />
        </div>

        <footer className="absolute inset-x-0 bottom-0 bg-card px-5 pt-4 pb-[30px] shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
          {draft.sent ? (
            <p
              role="status"
              className="rounded-xl bg-muted px-4 py-3 text-center text-[15px] font-medium text-strong"
            >
              보냈어요
            </p>
          ) : (
            <Button
              size="lg"
              disabled={!draft.canSend || draft.sending}
              onClick={draft.openConfirm}
              className="h-14 w-full text-[16px]"
            >
              {draft.buttonLabel}
            </Button>
          )}
        </footer>

        <ReplyConfirmDialog
          open={draft.confirming}
          nickname={feedback.nickname}
          pending={draft.sending}
          onCancel={draft.closeConfirm}
          onConfirm={draft.send}
        />
      </SheetContent>
    </Sheet>
  );
}
