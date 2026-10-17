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
export function ReferralRecords() {
  const [kind, setKind] = useState<Kind>('rewards');
  return (
    <section className="mt-8 space-y-4 border-t pt-6">
      <h2 className="text-lg font-semibold">처리 내역</h2>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ['rewards', '지급 내역'],
            ['billing-events', '결제 수신'],
            ['history', '정책 이력'],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            variant={kind === value ? 'default' : 'outline'}
            onClick={() => setKind(value)}
            aria-pressed={kind === value}
          >
            {label}
          </Button>
        ))}
      </div>
      <Records key={kind} kind={kind} />
    </section>
  );
}
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
  const options =
    kind === 'rewards'
      ? ['PENDING', 'CREDITED', 'REVERSED', 'REVIEW_REQUIRED']
      : ['PENDING', 'PROCESSED', 'IGNORED', 'REVIEW_REQUIRED'];
  return (
    <div className="space-y-3">
      {kind !== 'history' && (
        <label className="block max-w-xs text-sm">
          처리 상태
          <select
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">전체</option>
            {options.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </label>
      )}
      <p className="text-sm text-subtle">
        보상은 기존 적립금에 더해져 본인의 100일 챌린지 만기 때 함께 환급돼요.
        학습 보상 상한과 무관하게 추가되며, 적립 완료는 송금 완료가 아니에요.
        재처리는 저장된 근거를 다시 확인해요.
      </p>
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
      <div className="space-y-3">
        {result.data?.pages
          .flatMap((p) => p.items)
          .map((row) => (
            <article
              key={'version' in row ? row.version : row.id}
              className="space-y-2 rounded-xl border bg-card p-4 text-sm"
            >
              {'version' in row ? (
                <>
                  <h3 className="font-semibold">정책 v{row.version}</h3>
                  <p>가입: {stageLabel(row.signup)}</p>
                  <p>결제: {stageLabel(row.purchase)}</p>
                  <p>
                    관리자 {row.createdBy ?? '시스템'} ·{' '}
                    {formatDateTime(row.createdAt)}
                  </p>
                  <p>{row.reason}</p>
                  <details>
                    <summary>대상 상품 {row.products.length}개</summary>
                    {row.products.map((p) => (
                      <p
                        className="break-all"
                        key={`${p.appId}/${p.store}/${p.productId}`}
                      >
                        {p.appId} · {p.store} · {p.productId} · {p.purchaseType}
                      </p>
                    ))}
                  </details>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">
                      #{row.id} · {statusLabels[row.status] ?? row.status}
                    </h3>
                    {row.status !== 'IGNORED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReason('');
                          setRetry(row.id);
                        }}
                      >
                        재처리
                      </Button>
                    )}
                  </div>
                  {'amountWon' in row ? (
                    <>
                      <p>
                        {row.stage === 'SIGNUP' ? '가입' : '첫 결제'} ·{' '}
                        {row.recipientRole === 'INVITER'
                          ? '초대인'
                          : '피초대인'}{' '}
                        #{row.recipientId}
                      </p>
                      <p>
                        확정 {row.amountWon.toLocaleString()}원 / 현재 적립{' '}
                        {row.creditedWon.toLocaleString()}원
                      </p>
                      <p className="text-subtle">
                        관계 #{row.referralId} · 정책 v{row.policyVersion} ·{' '}
                        {formatDateTime(row.createdAt)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="break-all">
                        {row.type} · {row.eventId}
                      </p>
                      <p className="text-subtle">
                        처리 시도 {row.attempts}회 ·{' '}
                        {formatDateTime(row.receivedAt)}
                      </p>
                    </>
                  )}
                  {row.reason && (
                    <p className="break-all text-subtle">
                      검토 사유: {row.reason}
                    </p>
                  )}
                </>
              )}
            </article>
          ))}
      </div>
      {result.hasNextPage && (
        <Button
          variant="outline"
          disabled={result.isFetchingNextPage}
          onClick={() => result.fetchNextPage()}
        >
          더 보기
        </Button>
      )}
      {retry !== null && (
        <ConfirmChange
          title={`#${retry} 내역을 재처리할까요?`}
          onClose={() => setRetry(null)}
          onConfirm={async () => {
            if (!reason.trim()) throw new Error('재처리 사유를 입력해 주세요.');
            if (kind !== 'history')
              await referralsApi.retry(kind, retry, reason);
            await client.invalidateQueries({ queryKey: ['referrals'] });
          }}
        >
          <label>
            재처리 사유
            <Input
              maxLength={500}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
        </ConfirmChange>
      )}
    </div>
  );
}
