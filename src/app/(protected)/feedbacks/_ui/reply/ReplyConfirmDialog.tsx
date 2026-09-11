'use client';

// 답장 전송 확인 — 되돌릴 수 없는 작업이라 한 번 묻는다 (Figma 1050:9401 · 9970, docs/admin-spec.md "공통 상태")
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';

import { replyConfirmTitle } from '../../_model/reply/reply-draft';

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
      {/* 모바일은 양옆 32px을 남긴 폭(390에서 326), 그 위로는 Figma 400 고정 */}
      <AlertDialogContent className="w-[calc(100%-4rem)] gap-3.5 rounded-2xl p-6 sm:w-[400px]">
        <AlertDialogTitle className="text-[17px] font-bold text-foreground">
          {replyConfirmTitle(nickname)}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-muted-foreground">
          보낸 답장은 되돌릴 수 없어요.
        </AlertDialogDescription>
        {/* 버튼은 가로 반반 — 프레임 기준. shadcn 기본 푸터의 회색 띠·구분선은 프레임에 없어 지운다 */}
        <AlertDialogFooter className="mx-0 mb-0 flex-row gap-2 border-0 bg-transparent p-0 pt-1 sm:justify-stretch">
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
