'use client';

// 목록 필터 줄 — 검색·유형·상태·기간·정렬, 우측에 건수 (Figma 1050:8193)
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import type { FeedbackFilter } from '../_model/feedback-filter';
import {
  FEEDBACK_DAYS_OPTIONS,
  FEEDBACK_SORT_OPTIONS,
  FEEDBACK_STATUS_OPTIONS,
  FEEDBACK_TYPE_OPTIONS,
} from '../_model/feedback-filter-options';

interface FeedbackFiltersProps {
  filter: FeedbackFilter;
  /** 검색어는 입력 중 값을 그대로 보여주고, 조회는 디바운스된 filter.keyword로 한다 */
  keywordDraft: string;
  /** 우측 건수 문구. 없으면 자리만 비운다 */
  countLabel?: string;
  onChangeKeyword: (keyword: string) => void;
  onChange: (patch: Partial<FeedbackFilter>) => void;
}

// Figma: 흰 배경 + 테두리 + r10 + 13px (톤 문서의 "회색 채움"과 다르지만 프레임이 기준이다)
const FIELD =
  'h-auto rounded-[10px] border-field-border bg-card px-3 py-2.5 text-[13px] text-strong shadow-none focus-visible:ring-1';

export function FeedbackFilters({
  filter,
  keywordDraft,
  countLabel,
  onChangeKeyword,
  onChange,
}: FeedbackFiltersProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <Input
        value={keywordDraft}
        onChange={(event) => onChangeKeyword(event.target.value)}
        placeholder="내용·이메일·닉네임 검색"
        aria-label="피드백 검색"
        className={`${FIELD} w-[280px] placeholder:text-subtle`}
      />

      <FilterSelect
        label="유형"
        value={filter.type ?? 'ALL'}
        options={FEEDBACK_TYPE_OPTIONS}
        width="w-[130px]"
        onValueChange={(value) =>
          onChange({
            type:
              value === 'ALL' ? undefined : (value as FeedbackFilter['type']),
          })
        }
      />
      <FilterSelect
        label="상태"
        value={filter.status ?? 'ALL'}
        options={FEEDBACK_STATUS_OPTIONS}
        width="w-[130px]"
        onValueChange={(value) =>
          onChange({
            status:
              value === 'ALL' ? undefined : (value as FeedbackFilter['status']),
          })
        }
      />
      <FilterSelect
        value={String(filter.days)}
        options={FEEDBACK_DAYS_OPTIONS}
        width="w-[120px]"
        onValueChange={(value) => onChange({ days: Number(value) })}
      />
      <FilterSelect
        value={filter.sort}
        options={FEEDBACK_SORT_OPTIONS}
        width="w-[100px]"
        onValueChange={(value) =>
          onChange({ sort: value as FeedbackFilter['sort'] })
        }
      />

      <span className="ml-auto text-xs text-subtle">{countLabel}</span>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  width,
  onValueChange,
}: {
  /** 있으면 "유형: 전체"처럼 앞에 붙인다 */
  label?: string;
  value: string;
  options: { value: string; label: string }[];
  width: string;
  onValueChange: (value: string) => void;
}) {
  const selected = options.find((option) => option.value === value);
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={label}
        className={`${FIELD} ${width} justify-between [&>svg]:text-subtle`}
      >
        <SelectValue>
          {label ? `${label}: ${selected?.label}` : selected?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
