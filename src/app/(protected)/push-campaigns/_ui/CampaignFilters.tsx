'use client';

// 목록 상단 줄 — 탭 · 상태 Select · 새 푸시 만들기 (Figma 2176:275)
import Link from 'next/link';

import type { PushCampaignStatus } from '@/features/push-campaign/api/push-campaign';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';

import {
  CAMPAIGN_STATUS_OPTIONS,
  CAMPAIGN_TABS,
  isStatusSelectDisabled,
  type CampaignFilter,
} from '../_model/campaign-filter';

interface CampaignFiltersProps {
  filter: CampaignFilter;
  onChange: (patch: Partial<CampaignFilter>) => void;
}

export function CampaignFilters({ filter, onChange }: CampaignFiltersProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <div
        role="tablist"
        aria-label="캠페인 구분"
        className="flex w-full gap-1 rounded-xl bg-card p-1 md:w-auto"
      >
        {CAMPAIGN_TABS.map((tab) => {
          const selected = tab.value === filter.tab;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange({ tab: tab.value })}
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

      <Select
        value={filter.status ?? 'ALL'}
        disabled={isStatusSelectDisabled(filter.tab)}
        onValueChange={(value) =>
          onChange({
            status: value === 'ALL' ? undefined : (value as PushCampaignStatus),
          })
        }
      >
        <SelectTrigger
          aria-label="상태"
          className="hidden h-auto w-[130px] rounded-[10px] border-field-border bg-card px-3 py-2.5 text-[13px] text-strong shadow-none md:flex"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CAMPAIGN_STATUS_OPTIONS.map((option) => (
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
        <Link href="/push-campaigns/new">새 푸시 만들기</Link>
      </Button>
    </div>
  );
}
