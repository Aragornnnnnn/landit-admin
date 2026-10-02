'use client';

// 내용 카드 — 제목(200자) · 본문(일반 텍스트). 공지와 달리 마크다운을 쓰지 않는다 — BE가 bodyText를 그대로 보여 준다 (Figma 2593:426)
import { cn } from '@/shared/lib/cn';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import {
  TITLE_MAX,
  type DirectLetterDraft,
} from '../_model/direct-letter-draft';

const FIELD =
  'h-auto rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] shadow-none placeholder:text-subtle';

interface LetterContentCardProps {
  draft: DirectLetterDraft;
  onChange: (draft: DirectLetterDraft) => void;
}

export function LetterContentCard({ draft, onChange }: LetterContentCardProps) {
  const titleOver = draft.title.trim().length > TITLE_MAX;
  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">내용</h2>

      <label className="flex flex-col gap-1.5">
        <span className="flex items-center text-[13px] text-subtle">
          제목
          <span
            className={cn(
              'ml-auto text-[12px]',
              titleOver && 'text-destructive',
            )}
          >
            {draft.title.trim().length} / {TITLE_MAX}
          </span>
        </span>
        <Input
          value={draft.title}
          onChange={(event) =>
            onChange({ ...draft, title: event.target.value })
          }
          aria-label="제목"
          aria-invalid={titleOver}
          className={FIELD}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] text-subtle">본문</span>
        <Textarea
          value={draft.body}
          onChange={(event) => onChange({ ...draft, body: event.target.value })}
          aria-label="본문"
          rows={8}
          className={cn(FIELD, 'min-h-[196px] leading-[1.6]')}
        />
        <span className="text-[11px] text-subtle">
          일반 텍스트로 보내요 · 줄바꿈은 그대로 보여요
        </span>
      </label>
    </section>
  );
}
