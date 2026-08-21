'use client';

// 상태를 바꾸기 전 한 번 묻는 창 — 사용자 편지함이 바로 바뀌는 일이라서다 (Figma 1050:10862)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

import { LETTER_CONFIRM, type LetterAction } from '../_model/letter-actions';

interface LetterActionDialogProps {
  /** 물어볼 행동. 없으면 닫힌 상태 */
  action: LetterAction | null;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LetterActionDialog({
  action,
  pending,
  onCancel,
  onConfirm,
}: LetterActionDialogProps) {
  const copy = action ? LETTER_CONFIRM[action] : undefined;

  return (
    <AlertDialog
      open={Boolean(copy)}
      onOpenChange={(next) => !next && onCancel()}
    >
      <AlertDialogContent className="w-[calc(100%-4rem)] gap-3.5 rounded-2xl p-6 sm:w-[400px]">
        <AlertDialogTitle className="text-[17px] font-bold text-foreground">
          {copy?.title}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-muted-foreground">
          {copy?.description}
        </AlertDialogDescription>
        {/* 프레임은 오른쪽 정렬 + 폭 자동 — 답장 확인 창(반반)과 다르다 */}
        <AlertDialogFooter className="mx-0 mb-0 flex-row justify-end gap-2 border-0 bg-transparent p-0 pt-1">
          <AlertDialogCancel className="m-0">취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            // 숨기기는 사용자에게 보이는 것을 없애는 일이라 옅은 빨강 (프레임)
            variant={action === 'hide' ? 'destructive' : 'default'}
            onClick={(event) => {
              // 보내는 동안 창을 닫지 않는다 — 결과를 보고 닫는다
              event.preventDefault();
              onConfirm();
            }}
            className="m-0"
          >
            {copy?.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
