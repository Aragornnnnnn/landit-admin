'use client';

// 답장 전송 확인 — 되돌릴 수 없는 작업이라 한 번 묻는다 (Figma 1050:9401, docs/admin-spec.md "공통 상태")
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

import { replyConfirmTitle } from '../_model/reply-draft';

interface ReplyConfirmDialogProps {
  open: boolean;
  nickname: string | undefined;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ReplyConfirmDialog({
  open,
  nickname,
  pending,
  onCancel,
  onConfirm,
}: ReplyConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent className="w-[400px] gap-3.5 rounded-2xl p-6">
        <AlertDialogTitle className="text-[17px] font-bold text-foreground">
          {replyConfirmTitle(nickname)}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-muted-foreground">
          보낸 답장은 되돌릴 수 없어요.
        </AlertDialogDescription>
        {/* 버튼은 가로 반반 — 프레임 기준 */}
        <AlertDialogFooter className="flex-row gap-2 sm:justify-stretch">
          <AlertDialogCancel className="m-0 flex-1">취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={(event) => {
              // 보내는 동안 창을 닫지 않는다 — 결과를 시트에서 보여줘야 한다
              event.preventDefault();
              onConfirm();
            }}
            className="m-0 flex-1"
          >
            보내기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
