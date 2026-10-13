'use client';

// 발송 작업을 조회하고 대기·처리 중일 때만 자동으로 새로고침한다.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { StatusChip } from '@/shared/ui/StatusChip';

import {
  fetchNotificationJob,
  type NotificationJob,
} from '../_api/notifications';
import {
  jobLabel,
  shouldPollJob,
  validJobId,
} from '../_model/notification-job';

export function NotificationJobCard({
  accepted,
}: {
  accepted: NotificationJob | null;
}) {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState('');
  const id = selected || accepted?.id || '';
  const query = useQuery({
    queryKey: ['notification-job', id],
    queryFn: () => fetchNotificationJob(id),
    enabled: validJobId(id),
    retry: false,
    refetchInterval: (query) =>
      query.state.error
        ? false
        : shouldPollJob(query.state.data?.status)
          ? 3000
          : false,
  });
  const job = query.data ?? (accepted?.id === id ? accepted : null);
  return (
    <section className="space-y-4 rounded-[20px] bg-card p-6">
      <h2 className="text-lg font-bold">발송 작업 조회</h2>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (validJobId(input.trim())) {
            if (id === input.trim()) void query.refetch();
            setSelected(input.trim());
          }
        }}
      >
        <label className="min-w-0 flex-1 text-sm">
          작업 ID
          <Input
            className="mt-2"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="UUID"
          />
        </label>
        <Button
          type="submit"
          className="self-end"
          disabled={!validJobId(input.trim())}
        >
          조회
        </Button>
      </form>
      {id && (
        <>
          <p className="text-xs break-all text-subtle">작업 ID: {id}</p>
          {query.isError ? (
            <InlineError
              message="작업 상태를 조회하지 못했어요"
              onRetry={() => query.refetch()}
            />
          ) : query.isPending && !job ? (
            <ListSkeleton rows={2} />
          ) : (
            job && (
              <div className="space-y-3">
                <StatusChip
                  dot={
                    job.status === 'ACCEPTED'
                      ? 'done'
                      : shouldPollJob(job.status)
                        ? 'progress'
                        : undefined
                  }
                >
                  {jobLabel(job.status)}
                </StatusChip>
                <p className="text-sm text-subtle">
                  {job.status === 'UNKNOWN'
                    ? '접수 여부가 불확실해요. 재발송 전에 결과를 확인해 주세요.'
                    : '제공자 접수는 메일함 도착을 의미하지 않아요.'}
                </p>
                {job.resultCode && (
                  <p className="text-xs break-all text-subtle">
                    결과 코드: {job.resultCode}
                  </p>
                )}
              </div>
            )
          )}
          <Button
            variant="outline"
            disabled={query.isFetching}
            onClick={() => query.refetch()}
          >
            상태 새로고침
          </Button>
        </>
      )}
    </section>
  );
}
