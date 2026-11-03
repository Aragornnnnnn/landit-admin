'use client';

// 제작 규칙 화면 조립 — scope 칩 · 상태 Select · 규칙 표(은퇴 확인창) · 등록 카드 (Figma 4133:855 · docs/screens/content-batches.md "제작 규칙")
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { ContentRule } from '@/features/content/api/content-rule';
import { useContentRuleMutation } from '@/features/content/model/useContentMutation';
import { useContentRulesQuery } from '@/features/content/model/useContentRuleQuery';
import { DesktopOnly } from '@/features/content/ui/DesktopOnly';
import { ApiError } from '@/shared/api/api-error';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';

import {
  countRulesByScope,
  filterRules,
  readRuleFilter,
  RULE_STATUS_FILTER_LABEL,
  RULE_STATUS_FILTERS,
  ruleEmptyLabel,
  writeRuleFilter,
  type RuleFilter,
  type RuleStatusFilter,
} from '../_model/rule-filter';
import { CreateRuleCard } from './CreateRuleCard';
import { RuleScopeChips } from './RuleScopeChips';
import { RuleTable } from './RuleTable';

export function ContentRulesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = readRuleFilter(searchParams);
  const rules = useContentRulesQuery();
  // 등록과 은퇴를 따로 둔다 — 한 인스턴스에서 mutate를 겹쳐 부르면 앞 호출의 콜백(입력 비우기)이 버려진다
  const create = useContentRuleMutation();
  const retire = useContentRuleMutation();
  // 확인창의 대상과 열림을 나눈다 — 닫히는 애니메이션 동안 제목이 "를 은퇴할까요?"로 비지 않게
  const [target, setTarget] = useState<ContentRule | null>(null);
  const [asking, setAsking] = useState(false);

  const change = (patch: Partial<RuleFilter>) => {
    const query = writeRuleFilter({ ...filter, ...patch });
    router.replace(query ? `?${query}` : '/content-rules', { scroll: false });
  };

  const all = rules.data ?? [];
  const items = filterRules(all, filter);
  const dismiss = () => setAsking(false);
  const ask = (rule: ContentRule) => {
    setTarget(rule);
    setAsking(true);
  };

  return (
    <DesktopOnly>
      <div className="flex flex-col gap-4 pt-1 pb-12">
        <div className="flex flex-wrap items-center gap-3">
          <RuleScopeChips
            scope={filter.scope ?? 'ALL'}
            counts={
              rules.data
                ? countRulesByScope(rules.data, filter.status)
                : undefined
            }
            onChange={(scope) =>
              change({ scope: scope === 'ALL' ? undefined : scope })
            }
          />
          <Select
            value={filter.status}
            onValueChange={(value) =>
              change({ status: value as RuleStatusFilter })
            }
          >
            <SelectTrigger
              aria-label="상태"
              className="h-auto w-[150px] rounded-[10px] border-field-border bg-card px-3 py-2.5 text-[13px] text-strong shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RULE_STATUS_FILTERS.map((status) => (
                <SelectItem key={status} value={status} className="text-[13px]">
                  {RULE_STATUS_FILTER_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {rules.isPending ? (
          <ListSkeleton rows={6} />
        ) : rules.isError ? (
          <InlineError
            message="규칙 목록을 불러오지 못했어요"
            onRetry={() => rules.refetch()}
          />
        ) : items.length === 0 ? (
          <EmptyState
            className="rounded-[20px] bg-card"
            title={ruleEmptyLabel(filter)}
          />
        ) : (
          <RuleTable rules={items} pending={retire.isPending} onRetire={ask} />
        )}

        <CreateRuleCard
          defaultScope={filter.scope ?? 'QUESTION'}
          pending={create.isPending}
          onCreate={(body, done) =>
            create.mutate({ type: 'create', body }, { onSuccess: done })
          }
        />

        {/* 409(이미 은퇴)는 공통 훅이 토스트 + 목록을 다시 읽으니 확인창도 닫는다. 다른 실패는 열어 둬 다시 시도할 수 있게 */}
        <ActionConfirmDialog
          open={asking}
          title={`${target?.ruleCode ?? ''} 규칙을 은퇴할까요?`}
          pending={retire.isPending}
          onCancel={dismiss}
          onConfirm={() => {
            if (!target) return;
            retire.mutate(
              { type: 'retire', ruleId: target.ruleId },
              {
                onSettled: (_, error) => {
                  if (
                    !error ||
                    (error instanceof ApiError && error.status === 409)
                  )
                    dismiss();
                },
              },
            );
          }}
        >
          <p>프롬프트에서 빠지고 목록엔 이력으로 남아요. 되돌릴 수 없어요.</p>
        </ActionConfirmDialog>
      </div>
    </DesktopOnly>
  );
}
