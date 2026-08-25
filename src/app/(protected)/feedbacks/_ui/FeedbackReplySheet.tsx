'use client';

// 데스크톱 답장 — 목록을 덮지 않고 오른쪽에서 열리는 시트 (Figma 1050:8441 · 9683)
import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet';

import type { FeedbackItem } from '../_model/useFeedbackListQuery';
import type { ReplyDraft } from '../_model/useReplyDraft';
import { ReplyConfirmDialog } from './ReplyConfirmDialog';
import { ReplyFields } from './ReplyFields';

interface FeedbackReplySheetProps {
  feedback: FeedbackItem;
  draft: ReplyDraft;
  onClose: () => void;
}

export function FeedbackReplySheet({
  feedback,
  draft,
  onClose,
}: FeedbackReplySheetProps) {
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      {/* shadcn 기본값 sm:max-w-sm(384px)이 폭을 잡아먹어 Figma 520px로 덮는다 */}
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-4 rounded-l-[20px] p-7 data-[side=right]:sm:max-w-[520px]"
      >
        {/* 보이는 제목은 닉네임이지만, 읽어주는 이름은 이 시트가 무엇인지여야 한다 */}
        <SheetTitle className="sr-only">답장하기</SheetTitle>

        <ReplyFields
          feedback={feedback}
          draft={draft}
          variant="sheet"
          trailing={
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="rounded-md p-1 text-subtle hover:text-foreground"
            >
              <X className="size-5" aria-hidden />
            </button>
          }
        />

        {draft.sent ? (
          <p
            role="status"
            className="rounded-xl bg-muted px-4 py-3 text-center text-[14px] font-medium text-strong"
          >
            보냈어요
          </p>
        ) : (
          <Button
            size="lg"
            disabled={!draft.canSend || draft.sending}
            onClick={draft.openConfirm}
            className="h-12 w-full text-[15px]"
          >
            {draft.buttonLabel}
          </Button>
        )}

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
