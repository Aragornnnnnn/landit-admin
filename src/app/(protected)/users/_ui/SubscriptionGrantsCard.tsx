'use client';

// 사용자 상세에서 상품 무료 이용 권한을 부여하거나 특정 부여 건을 회수한다.
import { useState } from 'react';
import { toast } from 'sonner';

import { InlineError } from '@/shared/ui/InlineError';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';

import type { Grant, GrantRequest } from '../_api/subscription-grant';
import { isGrantActive } from '../_model/subscription-grant';
import { formatDateTimeDot } from '../_model/user-detail';
import { useSubscriptionGrantsQuery } from '../_model/useSubscriptionGrantsQuery';

export function SubscriptionGrantsCard({
  userId,
  active,
}: {
  userId: number;
  active: boolean;
}) {
  const { products, history, grant, revoke } =
    useSubscriptionGrantsQuery(userId);
  const [product, setProduct] = useState<GrantRequest['product']>('MONTHLY');
  const [reason, setReason] = useState('');
  const [asked, setAsked] = useState<GrantRequest | null>(null);
  const [revoking, setRevoking] = useState<Grant | null>(null);
  const pending = grant.isPending || revoke.isPending;
  const options = products.data ?? [];
  const selected = options.find((item) => item.product === product);
  const hasActive = (history.data ?? []).some((item) => isGrantActive(item));
  const close = () => {
    if (!pending) {
      setAsked(null);
      setRevoking(null);
      grant.reset();
      revoke.reset();
    }
  };
  const submit = () => {
    if (asked)
      grant.mutate(asked, {
        onSuccess: () => {
          setAsked(null);
          setReason('');
          toast.success('상품 이용 권한을 부여했어요.');
        },
      });
    else if (revoking?.grantId != null)
      revoke.mutate(revoking.grantId, {
        onSuccess: () => {
          setRevoking(null);
          toast.success('수동 이용 권한을 회수했어요.');
        },
      });
  };
  return (
    <section className="flex flex-col gap-4 rounded-[20px] border border-hairline bg-card p-5 sm:p-6">
      <div>
        <h2 className="font-semibold">상품 이용 권한</h2>
        <p className="mt-1 text-sm text-subtle">
          선택한 상품의 기간만큼 무료로 제공해요. 기존 유료 결제는 유지되며,
          자동 갱신과 환급 권리는 생기지 않아요.
        </p>
      </div>
      {products.isError ? (
        <InlineError
          message="상품을 불러오지 못했어요."
          onRetry={() => products.refetch()}
        />
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-2 text-sm">
            상품
            <select
              value={product}
              onChange={(event) =>
                setProduct(event.target.value as GrantRequest['product'])
              }
              disabled={pending || !active || products.isPending}
              className="h-10 rounded-lg border border-input bg-card px-3"
            >
              {options.map(
                (item) =>
                  item.product && (
                    <option key={item.product} value={item.product}>
                      {item.label} · {item.durationLabel}
                    </option>
                  ),
              )}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-2 text-sm">
            부여 사유
            <Input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={500}
              disabled={pending || !active}
              placeholder="예: 고객 지원 보상"
            />
          </label>
          <Button
            disabled={
              pending ||
              !active ||
              !selected ||
              !reason.trim() ||
              hasActive ||
              history.isPending ||
              history.isError
            }
            onClick={() => {
              grant.reset();
              setAsked({
                product,
                reason: reason.trim(),
                requestId: crypto.randomUUID(),
              });
            }}
          >
            무료 부여
          </Button>
        </div>
      )}
      {!active && (
        <p className="text-sm text-subtle">
          활성 사용자에게만 권한을 부여하거나 회수할 수 있어요.
        </p>
      )}
      {hasActive && (
        <p className="text-sm text-subtle">
          유효한 수동 권한이 있어요. 상품을 변경하려면 해당 권한을 먼저 회수해
          주세요.
        </p>
      )}
      {history.isError ? (
        <InlineError
          message="부여 이력을 불러오지 못했어요."
          onRetry={() => history.refetch()}
        />
      ) : history.isPending ? (
        <p className="text-sm text-subtle">이력을 불러오는 중이에요.</p>
      ) : (
        <ul className="divide-y divide-hairline">
          {(history.data ?? []).length === 0 && (
            <li className="py-3 text-sm text-subtle">
              수동으로 부여한 이용 권한이 없어요.
            </li>
          )}
          {(history.data ?? []).map((item) => (
            <li
              key={item.grantId}
              className="flex flex-wrap items-start justify-between gap-3 py-3"
            >
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium">
                  {options.find((option) => option.product === item.product)
                    ?.label ?? item.product}{' '}
                  ·{' '}
                  {item.revokedAt
                    ? '회수됨'
                    : isGrantActive(item)
                      ? '이용 가능'
                      : '만료'}
                </span>
                <span className="text-xs text-subtle">
                  {item.startsAt ? formatDateTimeDot(item.startsAt) : '—'} ~{' '}
                  {item.expiresAt ? formatDateTimeDot(item.expiresAt) : '—'}{' '}
                  (한국 시간)
                </span>
                <span className="text-xs text-subtle">
                  {item.reason} · 관리자 #{item.grantedBy}
                </span>
                {item.revokedAt && (
                  <span className="text-xs text-subtle">
                    회수 {formatDateTimeDot(item.revokedAt)}
                  </span>
                )}
              </div>
              {isGrantActive(item) && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!active || pending || item.grantId == null}
                  onClick={() => {
                    revoke.reset();
                    setRevoking(item);
                  }}
                >
                  회수
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
      <AlertDialog
        open={asked !== null || revoking !== null}
        onOpenChange={(open) => !open && close()}
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            {asked
              ? '상품 이용 권한을 부여할까요?'
              : '수동 이용 권한을 회수할까요?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {asked
              ? `사용자 #${userId}에게 ${selected?.label}을 지금부터 ${selected?.durationLabel} 동안 무료로 제공해요. 결제와 환급 권리는 생성되지 않아요.`
              : `사용자 #${userId}의 수동 부여 건(#${revoking?.grantId})을 회수해요. 기존 유료 구독은 유지돼요.`}
          </AlertDialogDescription>
          {(grant.isError || revoke.isError) && (
            <p role="alert" className="text-sm text-destructive">
              {(grant.error ?? revoke.error)?.message ??
                '처리하지 못했어요. 다시 시도해 주세요.'}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending} onClick={close}>
              취소
            </AlertDialogCancel>
            <Button
              variant={asked ? 'default' : 'destructive'}
              disabled={pending}
              onClick={submit}
            >
              {pending ? '처리 중' : asked ? '무료 부여' : '회수'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
