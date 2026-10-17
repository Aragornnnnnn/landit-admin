'use client';

// 가입 이후 혜택 고정을 안내하며 새 정책과 지급 보류 상태를 저장한다.
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/shared/api/api-error';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';

import {
  referralsApi,
  type PolicyState,
  type Product,
} from '../_api/referrals';
import {
  normalizeStage,
  stageLabel,
  validatePolicy,
  type PolicyDraft,
} from '../_model/policy-draft';
import { ConfirmChange } from './ConfirmChange';
import { selectClass, StageFields } from './StageFields';

export function PolicyEditor({
  state: incoming,
  reload,
}: {
  state: PolicyState;
  reload: () => void;
}) {
  const [state] = useState(incoming);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<PolicyDraft>({
    ...state.policy,
    reason: '',
  });
  const [operation, setOperation] = useState<'save' | 'processing' | null>(
    null,
  );
  const [reason, setReason] = useState('');
  const [conflict, setConflict] = useState(false);
  const invalid = validatePolicy(draft);
  async function confirm() {
    try {
      if (operation === 'save')
        await referralsApi.save({
          ...draft,
          products: draft.products.map((p) => ({
            ...p,
            appId: p.appId.trim(),
            productId: p.productId.trim(),
            displayName: p.displayName.trim(),
          })),
          signup: normalizeStage(draft.signup),
          purchase: normalizeStage(draft.purchase),
          expectedRevision: state.revision,
        });
      else
        await referralsApi.processing({
          expectedRevision: state.revision,
          paused: !state.paused,
          reason,
        });
      await queryClient.invalidateQueries({ queryKey: ['referrals'] });
      reload();
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) setConflict(true);
      throw e;
    }
  }
  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-card p-5">
        <p className="font-semibold">
          현재 정책 v{state.policy.version} ·{' '}
          {state.paused ? '지급 보류 중' : '정상 처리 중'}
        </p>
        <p className="mt-2 text-sm text-subtle">
          가입 시 두 단계의 혜택이 고정돼요. 정책 변경은 이후 신규 가입자부터
          적용되며, 기존 가입자의 약속된 혜택은 유지돼요.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <StageFields
          title="가입 완료 보상"
          value={draft.signup}
          onChange={(signup) => setDraft({ ...draft, signup })}
        />
        <StageFields
          title="첫 실제 결제 보상"
          value={draft.purchase}
          onChange={(purchase) => setDraft({ ...draft, purchase })}
        />
      </div>
      <label className="block space-y-2 text-sm">
        정책 변경 사유
        <Input
          maxLength={500}
          value={draft.reason}
          onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
        />
      </label>
      {invalid && <p className="text-sm text-subtle">{invalid}</p>}
    </div>
  );
}
