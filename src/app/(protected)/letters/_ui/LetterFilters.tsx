'use client';

// 목록 상단 줄 — 탭(공개 상태) · 타입 Select · 새 편지 쓰기 (Figma 1050:10110)
import Link from 'next/link';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import {
  LETTER_TABS,
  type LetterFilter,
  type LetterTab,
  type LetterType,
} from '../_model/letter-filter';
import { LETTER_TYPE_OPTIONS } from '../_model/letter-label';

interface LetterFiltersProps {
  filter: LetterFilter;
  onChange: (patch: Partial<LetterFilter>) => void;
}

export function LetterFilters({ filter, onChange }: LetterFiltersProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <LetterTabs value={filter.tab} onChange={(tab) => onChange({ tab })} />

      <Select
        value={filter.type ?? 'ALL'}
        onValueChange={(value) =>
          onChange({
            type: value === 'ALL' ? undefined : (value as LetterType),
          })
        }
      >
        <SelectTrigger
          aria-label="타입"
          className="hidden h-auto w-[130px] rounded-[10px] border-field-border bg-card px-3 py-2.5 text-[13px] text-strong shadow-none md:flex"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LETTER_TYPE_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-[13px]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button asChild className="ml-auto hidden h-10 px-4 text-[14px] md:flex">
        <Link href="/letters/new">새 편지 쓰기</Link>
      </Button>
    </div>
  );
}

/** 세그먼트 탭 — 모바일에선 폭을 꽉 채운다(프레임) */
function LetterTabs({
  value,
  onChange,
}: {
  value: LetterTab;
  onChange: (tab: LetterTab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="공개 상태"
      className="flex w-full gap-1 rounded-xl bg-card p-1 md:w-auto"
    >
      {LETTER_TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={cn(
              'flex-1 rounded-lg px-4 py-2 text-[14px] font-medium text-subtle transition-colors md:flex-none',
              selected && 'bg-muted text-strong',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
