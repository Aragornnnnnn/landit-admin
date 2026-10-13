'use client';

// 수신 주소를 확인하고 같은 요청의 재시도에는 멱등성 키를 재사용한다.
import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiError } from '@/shared/api/api-error';
import { reportError } from '@/shared/monitoring/report';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';

import { sendTestEmail, type NotificationJob } from '../_api/notifications';
import {
  chooseEmailAttempt,
  type EmailAttempt,
} from '../_model/notification-job';

export function EmailTestCard({
  onAccepted,
}: {
  onAccepted: (job: NotificationJob) => void;
}) {
  const [recipient, setRecipient] = useState('');
  const [confirming, setConfirming] = useState(false);
  const attempt = useRef<EmailAttempt | null>(null);
  const send = useMutation({
    mutationFn: (request: EmailAttempt) =>
      sendTestEmail(request.recipient, request.key),
    retry: false,
    onSuccess: (job) => {
      attempt.current = null;
      setConfirming(false);
      onAccepted(job);
      toast.success('테스트 메일 발송을 접수했어요');
    },
    onError: () => {
      setConfirming(false);
      reportError(new Error('테스트 이메일 접수 실패'));
    },
  });
  const confirmSend = () => {
    attempt.current = chooseEmailAttempt(attempt.current, recipient, () =>
      crypto.randomUUID(),
    );
    send.mutate(attempt.current);
  };
  return (
    <section className="space-y-4 rounded-[20px] bg-card p-6">
      <h2 className="text-lg font-bold">테스트 이메일</h2>
      <p className="text-sm text-subtle">
        체험 알림 설정과 무관하게 고정된 테스트 문구를 보내요.
      </p>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setConfirming(true);
        }}
      >
        <label className="block text-sm">
          수신 이메일
          <Input
            type="email"
            required
            maxLength={255}
            autoComplete="off"
            className="mt-2"
            value={recipient}
            disabled={send.isPending}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="name@example.com"
          />
        </label>
        {send.isError && (
          <p role="alert" className="text-sm text-destructive">
            {send.error instanceof ApiError
              ? send.error.message
              : '접수 결과를 확인하지 못했어요. 같은 주소로 재시도하면 중복 접수를 방지해요.'}
          </p>
        )}
        <Button type="submit" disabled={send.isPending || !recipient.trim()}>
          테스트 메일 보내기
        </Button>
      </form>
      <ActionConfirmDialog
        open={confirming}
        title="테스트 메일을 보낼까요?"
        pending={send.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmSend}
      >
        <p>{recipient.trim()}</p>
        <p>
          이 주소로 테스트 메일 1건을 발송해요. 실제 수신 여부는 메일함에서
          확인해 주세요.
        </p>
      </ActionConfirmDialog>
    </section>
  );
}
