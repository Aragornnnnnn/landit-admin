'use client';

// 재생성 카드 — 범위 Select · 어림 시간·비용 · 주황 재생성(AlertDialog 확인). 배치 REVIEW_READY이고 Day가 GENERATING이 아닐 때만
import { useState } from 'react';

import {
  REGENERATION_SCOPES,
  regenerationScopeOf,
} from '@/features/content/model/regeneration-scope';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';

import { Card } from './ValidationCard';

interface RegenerateCardProps {
  plannedDay: number | null;
  enabled: boolean;
  pending: boolean;
  /** done은 성공했을 때 — 확인창을 닫는다 */
  onRegenerate: (scope: string, done: () => void) => void;
}

export function RegenerateCard({
  plannedDay,
  enabled,
  pending,
  onRegenerate,
}: RegenerateCardProps) {
  const [scope, setScope] = useState(REGENERATION_SCOPES[0].value);
  const [asking, setAsking] = useState(false);
  const chosen = regenerationScopeOf(scope);
  return (
    <Card title="재생성">
      <Select value={scope} onValueChange={setScope} disabled={!enabled}>
        <SelectTrigger
          aria-label="재생성 범위"
          className="h-auto w-full rounded-xl border-transparent bg-muted px-4 py-3 text-[13px] shadow-none"
        >
          범위: <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {REGENERATION_SCOPES.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="text-[13px]"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-[12px] leading-[1.5] text-subtle">
        범위 밖 payload는 유지되고, 미해결 FIX 코멘트가 프롬프트에 들어가며 다시
        만든 범위의 코멘트만 해결돼요.
        {!enabled &&
          ' 검수 대기 배치에서 만드는 중이 아닌 Day만 다시 만들 수 있어요.'}
      </p>
      <div className="flex items-center justify-end gap-3">
        <span className="text-[12px] text-subtle">
          약 {chosen.minutes}분 · {chosen.dollars}달러
        </span>
        <Button
          disabled={!enabled || pending}
          onClick={() => setAsking(true)}
          className="h-9 px-4 text-[13px]"
        >
          재생성
        </Button>
      </div>
      <ActionConfirmDialog
        open={asking}
        title={`Day ${plannedDay ?? '?'} · ${chosen.label} — 다시 만들까요?`}
        pending={pending}
        onCancel={() => setAsking(false)}
        onConfirm={() => onRegenerate(scope, () => setAsking(false))}
      >
        <p>
          기존 내용이 교체되고 미해결 FIX 코멘트가 프롬프트에 들어가요. 약{' '}
          {chosen.minutes}분 · {chosen.dollars}달러.
        </p>
      </ActionConfirmDialog>
    </Card>
  );
}
