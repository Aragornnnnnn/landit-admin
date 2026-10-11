'use client';

// 받는 사람 카드 — 고른 사람 칩 · 인원 카운터 · 추가 패널(사용자 목록 / ID 붙여넣기) (Figma 2593:426 · 2594:883)
import { useState } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

import { RECIPIENT_MAX, type Recipient } from '../_model/direct-letter-draft';
import { RecipientPasteTab } from './RecipientPasteTab';
import { RecipientPickTab } from './RecipientPickTab';

type AddTab = 'users' | 'paste';

const TABS: { value: AddTab; label: string }[] = [
  { value: 'users', label: '사용자 목록' },
  { value: 'paste', label: 'ID 붙여넣기' },
];

interface RecipientCardProps {
  recipients: Recipient[];
  onAdd: (recipients: Recipient[]) => void;
  onRemove: (userProfileId: number) => void;
}

export function RecipientCard({
  recipients,
  onAdd,
  onRemove,
}: RecipientCardProps) {
  const [tab, setTab] = useState<AddTab>('users');
  const over = recipients.length > RECIPIENT_MAX;
  const chosen = new Set(recipients.map((r) => r.userProfileId));

  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <div className="flex items-center">
        <h2 className="text-[16px] font-bold text-strong">받는 사람</h2>
        <span
          className={cn(
            'ml-auto text-[12px] text-subtle',
            over && 'text-destructive',
          )}
        >
          {recipients.length} / {RECIPIENT_MAX}
        </span>
      </div>

      {recipients.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="받는 사람">
          {recipients.map((r) => (
            <li
              key={r.userProfileId}
              className="flex items-center gap-1.5 rounded-full bg-muted py-1 pr-2 pl-2.5"
            >
              <span className="text-[12px] text-subtle">
                #{r.userProfileId}
              </span>
              <span className="text-[13px] font-medium text-strong">
                {r.nickname || '—'}
              </span>
              <button
                type="button"
                onClick={() => onRemove(r.userProfileId)}
                aria-label={`${r.nickname || r.userProfileId} 빼기`}
                className="text-subtle hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      {over && (
        <span className="text-[12px] text-destructive">
          한 번에 {RECIPIENT_MAX}명까지 보낼 수 있어요
        </span>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-background p-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[13px] font-medium text-strong">추가</span>
          <div
            role="tablist"
            className="flex gap-1 rounded-[10px] bg-hairline p-1"
          >
            {TABS.map((entry) => (
              <button
                key={entry.value}
                type="button"
                role="tab"
                aria-selected={tab === entry.value}
                onClick={() => setTab(entry.value)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-[12px] font-medium text-subtle transition-colors',
                  tab === entry.value && 'bg-card text-strong shadow-sm',
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
        {tab === 'users' ? (
          <RecipientPickTab chosen={chosen} onAdd={onAdd} />
        ) : (
          <RecipientPasteTab onAdd={onAdd} />
        )}
      </div>
    </section>
  );
}
