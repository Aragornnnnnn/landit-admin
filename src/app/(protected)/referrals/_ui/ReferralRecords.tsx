'use client';

// 정책 이력과 보상·결제 수신 내역을 페이지로 조회하고 근거 재처리를 요청한다.
import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { formatDateTime } from '@/shared/lib/format-time';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';

import {
  referralsApi,
  type Billing,
  type Page,
  type Policy,
  type Reward,
} from '../_api/referrals';
import { stageLabel } from '../_model/policy-draft';
import { ConfirmChange } from './ConfirmChange';
import { selectClass } from './StageFields';

type Kind = 'history' | 'rewards' | 'billing-events';
const statusLabels: Record<string, string> = {
  PENDING: '확인 중',
  CREDITED: '적립 완료',
  REVERSED: '취소',
  REVIEW_REQUIRED: '검토 필요',
  PROCESSED: '처리 완료',
  IGNORED: '대상 제외',
};
function Records({ kind }: { kind: Kind }) {
  const client = useQueryClient();
  const [status, setStatus] = useState('');
  const [retry, setRetry] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const result = useInfiniteQuery({
    queryKey: ['referrals', kind, status],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }): Promise<Page<Policy | Reward | Billing>> =>
      kind === 'history'
        ? referralsApi.history(pageParam)
        : kind === 'rewards'
          ? referralsApi.rewards(status, pageParam)
          : referralsApi.billing(status, pageParam),
    getNextPageParam: (page) => {
      const last = page.items.at(-1);
      return page.hasNext && last
        ? 'version' in last
          ? last.version
          : last.id
        : undefined;
    },
  });
  return (
    <div className="space-y-3">
      {result.isPending && <p role="status">내역을 불러오는 중이에요.</p>}
      {result.isError && (
        <div role="alert">
          <p>내역을 불러오지 못했어요.</p>
          <Button variant="outline" onClick={() => result.refetch()}>
            다시 시도
          </Button>
        </div>
      )}
      {result.data?.pages[0].items.length === 0 && (
        <p className="rounded-xl border p-6 text-sm text-subtle">
          해당 내역이 없어요.
        </p>
      )}
      {result.hasNextPage && (
        <Button
          variant="outline"
          disabled={result.isFetchingNextPage}
          onClick={() => result.fetchNextPage()}
        >
          더 보기
        </Button>
      )}
    </div>
  );
}
