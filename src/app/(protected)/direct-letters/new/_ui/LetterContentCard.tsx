'use client';

// 내용 카드 — 제목(200자) · 본문. 본문은 피드백 답장과 같은 마크다운 편집기다 — 사용자 앱이 bodyText를 마크다운으로 그린다 (Figma 2593:426)
import { MarkdownEditor } from '@/features/markdown-editor/ui/MarkdownEditor';
import { cn } from '@/shared/lib/cn';
import { Input } from '@/shared/ui/shadcn/input';

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

      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] text-subtle">본문</span>
        <MarkdownEditor
          value={draft.body}
          onChange={(body) => onChange({ ...draft, body })}
          background="card"
          label="편지 본문"
          placeholder="본문 — 이미지는 붙여넣거나 끌어다 놓으세요"
        />
      </div>
    </section>
  );
}
