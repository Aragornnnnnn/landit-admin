'use client';

// 생성·승인 대상과 비용을 확인하고 서버 성공 전까지 입력과 확인창을 유지한다.
import { useState, type ReactNode } from 'react';
import { useIsMutating } from '@tanstack/react-query';

import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { Button } from '@/shared/ui/shadcn/button';

import type { ContentCommand, runContentCommand } from '../_api/content-api';
import { useContentCommandMutation } from '../_model/useContentQuery';

export function ContentAction({
  label,
  command,
  children,
  disabled = false,
  onComplete,
}: {
  label: string;
  command: ContentCommand;
  children: ReactNode;
  disabled?: boolean;
  onComplete?: (result: Awaited<ReturnType<typeof runContentCommand>>) => void;
}) {
  const [open, setOpen] = useState(false);
  const mutation = useContentCommandMutation();
  const busy = useIsMutating({ mutationKey: ['content'] }) > 0;
  return (
    <>
      <Button
        disabled={disabled || busy}
        onClick={() => {
          mutation.reset();
          setOpen(true);
        }}
      >
        {label}
      </Button>
      <ActionConfirmDialog
        open={open}
        title={label}
        pending={mutation.isPending}
        onCancel={() => setOpen(false)}
        onConfirm={() =>
          mutation.mutate(command, {
            onSuccess: (result) => {
              setOpen(false);
              onComplete?.(result);
            },
          })
        }
      >
        {children}
        {mutation.error && (
          <p role="alert" className="text-destructive">
            {mutation.error.message}
          </p>
        )}
      </ActionConfirmDialog>
    </>
  );
}
