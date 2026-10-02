'use client';

// 보내기 확인 (Figma 2594:522) — 누구에게 무엇이 가는지 보여 주고, 고치거나 회수할 수 없음을 말한다
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';

import {
  recipientSummary,
  type DirectLetterDraft,
} from '../_model/direct-letter-draft';

interface SendLetterDialogProps {
  open: boolean;
  draft: DirectLetterDraft;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SendLetterDialog({
  open,
  draft,
  pending,
  onCancel,
  onConfirm,
}: SendLetterDialogProps) {
  return (
    <AlertDialog
      open={open}
      // 보내는 동안엔 닫지 않는다 — 결과를 보고 닫는다
      onOpenChange={(next) => !next && !pending && onCancel()}
    >
      <AlertDialogContent className="w-[calc(100%-4rem)] gap-3.5 rounded-2xl p-6 sm:w-[500px] sm:max-w-[500px]">
        <AlertDialogTitle className="text-[17px] font-bold text-foreground">
          {draft.recipients.length}명에게 보낼까요?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-muted-foreground">
          보낸 편지는 고치거나 회수할 수 없어요. 받는 사람끼리는 서로 보이지
          않아요.
        </AlertDialogDescription>

        <dl className="flex flex-col gap-2 rounded-xl bg-background px-4 py-3.5 text-[13px]">
          <Row label="받는 사람">{recipientSummary(draft.recipients)}</Row>
          <Row label="제목">{draft.title.trim()}</Row>
          <Row label="본문">
            <span className="line-clamp-2 whitespace-pre-wrap">
              {draft.body.trim()}
            </span>
          </Row>
        </dl>

        <AlertDialogFooter className="mx-0 mb-0 flex-row justify-end gap-2 border-0 bg-transparent p-0 pt-1">
          <AlertDialogCancel className="m-0" disabled={pending}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="m-0"
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            보내기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <dt className="w-14 shrink-0 text-[12px] font-medium text-subtle">
        {label}
      </dt>
      <dd className="min-w-px flex-1 leading-[1.5] break-words text-strong">
        {children}
      </dd>
    </div>
  );
}
