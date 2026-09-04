'use client';

// 저장 안 한 채 나갈 때 — 쓰던 편지를 잃는 건 되돌릴 수 없다 (docs/screens/letters.md "이탈 다이얼로그")
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';
import { Button } from '@/shared/ui/shadcn/button';

interface LeaveEditorDialogProps {
  open: boolean;
  pending: boolean;
  onCancel: () => void;
  onLeave: () => void;
  onSave: () => void;
}

export function LeaveEditorDialog({
  open,
  pending,
  onCancel,
  onLeave,
  onSave,
}: LeaveEditorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent className="w-[calc(100%-4rem)] gap-3.5 rounded-2xl p-6 sm:w-[400px]">
        <AlertDialogTitle className="text-[17px] font-bold text-foreground">
          저장하지 않고 나갈까요?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-muted-foreground">
          쓰던 내용이 사라져요.
        </AlertDialogDescription>
        <AlertDialogFooter className="mx-0 mb-0 flex-row justify-end gap-2 border-0 bg-transparent p-0 pt-1">
          <AlertDialogCancel className="m-0">계속 쓰기</AlertDialogCancel>
          {/* 나가기 전에 저장할 길을 함께 준다 — 실수로 잃는 쪽이 훨씬 비싸다 */}
          <Button variant="secondary" disabled={pending} onClick={onSave}>
            저장하고 나가기
          </Button>
          <AlertDialogAction
            variant="destructive"
            className="m-0"
            onClick={(event) => {
              event.preventDefault();
              onLeave();
            }}
          >
            그냥 나가기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
