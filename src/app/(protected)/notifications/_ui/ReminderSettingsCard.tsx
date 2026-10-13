'use client';

// 현재 무료 체험 채널 설정을 읽고 확인 후 두 채널을 함께 저장한다.
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiError } from '@/shared/api/api-error';
import { reportError } from '@/shared/monitoring/report';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Button } from '@/shared/ui/shadcn/button';
import { Switch } from '@/shared/ui/shadcn/switch';

import {
  fetchReminderSettings,
  saveReminderSettings,
  type ReminderSettings,
} from '../_api/notifications';

const KEY = ['trial-reminder-settings'] as const;
export function ReminderSettingsCard() {
  const query = useQuery({ queryKey: KEY, queryFn: fetchReminderSettings });
  return (
    <section className="rounded-[20px] bg-card p-6">
      <h2 className="mb-4 text-lg font-bold">무료 체험 알림</h2>
      {query.isPending ? (
        <ListSkeleton rows={2} />
      ) : query.isError ? (
        <InlineError onRetry={() => query.refetch()} />
      ) : (
        <SettingsForm current={query.data} />
      )}
    </section>
  );
}
function SettingsForm({ current }: { current: ReminderSettings }) {
  const client = useQueryClient();
  const [draft, setDraft] = useState<ReminderSettings | null>(null);
  const [confirming, setConfirming] = useState(false);
  const value = draft ?? current;
  const changed =
    value.pushEnabled !== current.pushEnabled ||
    value.emailEnabled !== current.emailEnabled;
  const save = useMutation({
    mutationFn: saveReminderSettings,
    retry: false,
    onSuccess: (data) => {
      client.setQueryData(KEY, data);
      setDraft(null);
      setConfirming(false);
      toast.success('체험 알림 설정을 저장했어요');
    },
    onError: () => {
      reportError(new Error('체험 알림 설정 저장 실패'));
      setConfirming(false);
    },
  });
  return (
    <div className="space-y-5">
      <p className="text-sm text-subtle">
        무료 체험 종료를 안내할 채널을 선택해 주세요.
      </p>
      {(['pushEnabled', 'emailEnabled'] as const).map((field) => (
        <label
          key={field}
          className="flex items-center justify-between gap-4 rounded-xl bg-muted p-4"
        >
          <span>{field === 'pushEnabled' ? '푸시 알림' : '이메일 알림'}</span>
          <Switch
            aria-label={
              field === 'pushEnabled' ? '체험 푸시 알림' : '체험 이메일 알림'
            }
            checked={value[field]}
            disabled={save.isPending}
            onCheckedChange={(checked) =>
              setDraft({ ...value, [field]: checked })
            }
          />
        </label>
      ))}
      <p className="text-xs leading-relaxed text-subtle">
        변경은 이후 예약·발송에 적용돼요. 이미 접수된 알림은 취소되지 않으며,
        다시 켜도 제외된 알림을 재발송하지 않아요.
      </p>
      {save.isError && (
        <p role="alert" className="text-sm text-destructive">
          {save.error instanceof ApiError
            ? save.error.message
            : '설정을 저장하지 못했어요. 다시 시도해 주세요.'}
        </p>
      )}
      <Button
        disabled={!changed || save.isPending}
        onClick={() => setConfirming(true)}
      >
        설정 저장
      </Button>
      <ActionConfirmDialog
        open={confirming}
        title="체험 알림 설정을 바꿀까요?"
        pending={save.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={() => save.mutate(value)}
      >
        <p>
          푸시 {value.pushEnabled ? 'ON' : 'OFF'} · 이메일{' '}
          {value.emailEnabled ? 'ON' : 'OFF'}
        </p>
        <p>이후 체험 알림의 예약·발송에 적용돼요.</p>
      </ActionConfirmDialog>
    </div>
  );
}
