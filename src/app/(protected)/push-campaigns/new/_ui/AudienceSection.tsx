'use client';

// 대상 카드 — 전체 / 선택 세그먼트, 예상 대상, 선택된 대상 목록, 대상 추가 패널 (Figma 2177:285).
// 네 가지 출처를 한꺼번에 펼치는 대신 목록 + 한 번에 한 방법씩 여는 패널로 뒀다 — 운영자가 어디까지 골랐는지 한눈에 보이게
import { useState } from 'react';

import {
  audienceSources,
  estimateAudienceCount,
  type AudienceDraft,
  type AudienceSourceKind,
} from '@/features/push-campaign/model/audience';
import { cn } from '@/shared/lib/cn';

import { AudienceAddPanel, type AddTab } from './AudienceAddPanel';
import { AudienceSourceList } from './AudienceSourceList';

interface AudienceSectionProps {
  audience: AudienceDraft;
  error?: string;
  onChange: (audience: AudienceDraft) => void;
}

const TYPES = [
  { value: 'ALL', label: '전체 사용자' },
  { value: 'SELECTED', label: '선택한 사용자' },
] as const;

const KIND_TAB: Record<AudienceSourceKind, AddTab> = {
  selected: 'users',
  pasted: 'paste',
  sql: 'sql',
  excluded: 'exclude',
};

export function AudienceSection({
  audience,
  error,
  onChange,
}: AudienceSectionProps) {
  const [tab, setTab] = useState<AddTab>('users');
  const estimate = estimateAudienceCount(audience);

  const remove = (kind: AudienceSourceKind) => {
    if (kind === 'sql') onChange({ ...audience, sql: '', sqlIds: [] });
    if (kind === 'selected') onChange({ ...audience, selectedIds: [] });
    if (kind === 'pasted') onChange({ ...audience, pastedIds: [] });
    if (kind === 'excluded') onChange({ ...audience, excludedIds: [] });
  };

  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">대상</h2>

      <div className="flex w-fit gap-1 rounded-xl bg-muted p-1">
        {TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            aria-pressed={audience.type === type.value}
            onClick={() => onChange({ ...audience, type: type.value })}
            className={cn(
              'rounded-lg px-4 py-1.5 text-[14px] font-medium text-subtle transition-colors',
              audience.type === type.value && 'bg-card text-strong shadow-sm',
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-[14px] bg-primary/10 px-[18px] py-4">
        <span className="flex flex-col gap-0.5">
          <span className="text-[12px] font-medium text-primary">
            예상 대상
          </span>
          <span className="text-[26px] leading-[1.2] font-bold text-strong">
            {estimate === null
              ? '전체'
              : `${estimate.toLocaleString('ko-KR')}명`}
          </span>
        </span>
        <span className="ml-auto text-[12px] text-subtle">
          발송할 때 다시 계산돼요
        </span>
      </div>

      {audience.type === 'SELECTED' && (
        <>
          <AudienceSourceList
            audience={audience}
            sources={audienceSources(audience)}
            onEdit={(kind) => setTab(KIND_TAB[kind])}
            onRemove={remove}
          />
          <AudienceAddPanel
            audience={audience}
            tab={tab}
            onTabChange={setTab}
            onChange={onChange}
          />
        </>
      )}

      {error && <span className="text-[12px] text-destructive">{error}</span>}
    </section>
  );
}
