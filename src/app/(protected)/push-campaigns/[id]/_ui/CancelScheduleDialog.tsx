'use client';

// 예약 취소 확인 — 발송이 시작되기 전까지만 되돌릴 수 있다. 시작됐으면 BE가 409로 막고 그 메시지를 토스트로 본다
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';

interface CancelScheduleDialogProps {
  open: boolean;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CancelScheduleDialog({
  open,
  pending,
  onCancel,
  onConfirm,
}: CancelScheduleDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent className="w-[calc(100%-4rem)] gap-3.5 rounded-2xl p-6 sm:w-[400px]">
        <AlertDialogTitle className="text-[17px] font-bold text-foreground">
          예약을 취소할까요?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-muted-foreground">
          발송이 시작되기 전까지만 취소할 수 있어요. 시각을 바꾸려면 취소하고 새
          푸시를 만들어요.
        </AlertDialogDescription>
        <AlertDialogFooter className="mx-0 mb-0 flex-row justify-end gap-2 border-0 bg-transparent p-0 pt-1">
          <AlertDialogCancel className="m-0">닫기</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            className="m-0"
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            예약 취소
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
