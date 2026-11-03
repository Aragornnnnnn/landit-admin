'use client';

// scope 칩 — 전체 · COMMON · … · IMAGE, 현재 상태 필터 안의 수와 함께 (Figma 4133:855)
import { CONTENT_RULE_SCOPES } from '@/features/content/api/content-rule';
import { cn } from '@/shared/lib/cn';

import type { ScopeChip } from '../_model/rule-filter';

const CHIPS: ScopeChip[] = ['ALL', ...CONTENT_RULE_SCOPES];

interface RuleScopeChipsProps {
  scope: ScopeChip;
  /** 아직 목록을 못 받았으면 없다 — 0으로 보이지 않게 수를 뺀다 */
  counts: Record<ScopeChip, number> | undefined;
  onChange: (scope: ScopeChip) => void;
}

export function RuleScopeChips({
  scope,
  counts,
  onChange,
}: RuleScopeChipsProps) {
  return (
    <div role="tablist" aria-label="scope" className="flex flex-wrap gap-2">
      {CHIPS.map((value) => {
        const selected = value === scope;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(value)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
              selected
                ? 'border-strong bg-strong text-white'
                : 'border-field-border bg-card text-body hover:bg-hairline',
            )}
          >
            {value === 'ALL' ? '전체' : value}
            {counts && ` ${counts[value]}`}
          </button>
        );
      })}
    </div>
  );
}
