'use client';

// 관리자 변경 내용을 확인하고 실패 시 대화상자를 유지한다.
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';
import { Button } from '@/shared/ui/shadcn/button';

export function ConfirmChange({
  title,
  children,
  onConfirm,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function run() {
    setPending(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : '처리하지 못했어요. 다시 시도해 주세요.',
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            변경 내용과 사유를 확인해 주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3 text-sm">{children}</div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>취소</AlertDialogCancel>
          <Button disabled={pending} onClick={run}>
            {pending ? '처리 중…' : '확인'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
