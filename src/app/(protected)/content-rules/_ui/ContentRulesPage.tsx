'use client';

// 제작 규칙 화면 조립 — scope 칩 · 상태 Select · 규칙 표(은퇴 확인창) · 등록 카드 (Figma 4133:855 · docs/screens/content-batches.md "제작 규칙")
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { ContentRule } from '@/features/content/api/content-rule';
import { useContentRuleMutation } from '@/features/content/model/useContentMutation';
import { useContentRulesQuery } from '@/features/content/model/useContentRuleQuery';
import { DesktopOnly } from '@/features/content/ui/DesktopOnly';
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
  const mutation = useContentRuleMutation();
  const [retiring, setRetiring] = useState<ContentRule | null>(null);

  const change = (patch: Partial<RuleFilter>) => {
    const query = writeRuleFilter({ ...filter, ...patch });
    router.replace(query ? `?${query}` : '/content-rules', { scroll: false });
  };

  const all = rules.data ?? [];
  const items = filterRules(all, filter);
  const dismiss = () => setRetiring(null);

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
          <RuleTable
            rules={items}
            pending={mutation.isPending}
            onRetire={setRetiring}
          />
        )}

        <CreateRuleCard
          defaultScope={filter.scope ?? 'QUESTION'}
          pending={mutation.isPending && mutation.variables?.type === 'create'}
          onCreate={(body, done) =>
            mutation.mutate({ type: 'create', body }, { onSuccess: done })
          }
        />

        {/* 대상이 바뀌어도 닫히는 애니메이션 동안 제목이 비지 않게 마지막 대상을 그대로 둔다 */}
        <ActionConfirmDialog
          open={retiring !== null}
          title={`${retiring?.ruleCode ?? ''}를 은퇴할까요?`}
          pending={mutation.isPending && mutation.variables?.type === 'retire'}
          onCancel={dismiss}
          onConfirm={() => {
            if (!retiring) return;
            mutation.mutate(
              { type: 'retire', ruleId: retiring.ruleId },
              { onSuccess: dismiss },
            );
          }}
        >
          <p>프롬프트에서 빠지고 목록엔 이력으로 남아요. 되돌릴 수 없어요.</p>
        </ActionConfirmDialog>
      </div>
    </DesktopOnly>
  );
}
