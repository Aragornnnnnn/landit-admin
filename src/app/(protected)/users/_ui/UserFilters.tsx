'use client';

// 필터 줄 — 검색 · 역할 · 상태, 오른쪽에 로드 진행 (Figma 1050:11383).
// 검색은 지금까지 불러온 범위에서만 되므로, 그 사실을 진행 표시가 계속 말해 준다
import { useEffect, useState } from 'react';

import { Input } from '@/shared/ui/shadcn/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';

import type { UserFilter, UserRole, UserStatus } from '../_model/user-filter';
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  usersProgressLabel,
} from '../_model/user-label';

interface UserFiltersProps {
  filter: UserFilter;
  loaded: number;
  loading: boolean;
  onChange: (patch: Partial<UserFilter>) => void;
}

const FIELD =
  'h-auto rounded-[10px] border-field-border bg-card px-3 py-2.5 text-[13px] text-strong shadow-none focus-visible:ring-1';

export function UserFilters({
  filter,
  loaded,
  loading,
  onChange,
}: UserFiltersProps) {
  // 입력은 즉시 보여 주고 조회는 300ms 뒤에 — 한 글자마다 목록을 다시 그리면 눈이 아프다
  const [draft, setDraft] = useState(filter.keyword);
  useEffect(() => {
    if (draft === filter.keyword) return;
    const timer = setTimeout(() => onChange({ keyword: draft }), 300);
    return () => clearTimeout(timer);
  }, [draft, filter.keyword, onChange]);

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="이메일·닉네임 검색"
        aria-label="사용자 검색"
        className={`${FIELD} w-full placeholder:text-subtle md:w-[280px]`}
      />

      <FilterSelect
        label="역할"
        value={filter.role ?? 'ALL'}
        options={USER_ROLE_OPTIONS}
        onValueChange={(value) =>
          onChange({ role: value === 'ALL' ? undefined : (value as UserRole) })
        }
      />
      <FilterSelect
        label="상태"
        value={filter.status ?? 'ALL'}
        options={USER_STATUS_OPTIONS}
        onValueChange={(value) =>
          onChange({
            status: value === 'ALL' ? undefined : (value as UserStatus),
          })
        }
      />

      <span className="ml-auto flex items-center gap-2.5">
        {/* BE가 전체 수를 주지 않아 진행률을 %로 그릴 수 없다 — 도는 막대로 "아직 받는 중"만 알린다 */}
        {loading && (
          <span
            aria-hidden
            className="h-1 w-24 overflow-hidden rounded-full bg-muted"
          >
            <span className="block h-full w-1/3 animate-pulse rounded-full bg-primary" />
          </span>
        )}
        <span className="text-[13px] text-subtle">
          {usersProgressLabel(loaded, loading)}
        </span>
      </span>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={label} className={`${FIELD} w-[130px]`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
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
  );
}
