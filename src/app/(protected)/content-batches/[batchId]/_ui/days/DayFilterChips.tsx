'use client';

// 검수 필터 칩 — 다시 볼 것 · 전체 · 미검토 · 수정 · OK, 각 수와 함께 (Figma 4130:753)
import { cn } from '@/shared/lib/cn';

import {
  REVIEW_FILTER_LABEL,
  type ReviewFilter,
} from '../../_model/review-filter';

interface DayFilterChipsProps {
  filter: ReviewFilter;
  counts: Record<ReviewFilter, number>;
  onChange: (filter: ReviewFilter) => void;
}

export function DayFilterChips({
  filter,
  counts,
  onChange,
}: DayFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div role="tablist" aria-label="검수 필터" className="flex gap-2">
        {(Object.keys(REVIEW_FILTER_LABEL) as ReviewFilter[]).map((value) => {
          const selected = value === filter;
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
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-field-border bg-card text-body hover:bg-hairline',
              )}
            >
              {REVIEW_FILTER_LABEL[value]} {counts[value]}
            </button>
          );
        })}
      </div>
      <span className="text-[12px] text-subtle">
        다시 볼 것 = 재생성 뒤 아직 안 본 Day · 행 클릭 → Day 초안 상세
      </span>
    </div>
  );
}
