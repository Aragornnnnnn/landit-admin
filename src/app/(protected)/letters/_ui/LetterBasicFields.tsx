'use client';

// 기본 정보 카드 — 타입 · 고정 · 제목 · 미리보기 문구 (Figma 1050:10361)
import type { LetterType } from '@/features/letter/api/letter-list';
import { LETTER_TYPE_LABEL } from '@/features/letter/model/letter-label';
import { cn } from '@/shared/lib/cn';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';

import {
  canPinDraft,
  isPreviewTooLong,
  PREVIEW_MAX,
  withType,
  type LetterDraft,
} from '../_model/letter-draft';

interface LetterBasicFieldsProps {
  draft: LetterDraft;
  onChange: (draft: LetterDraft) => void;
}

const TYPES: LetterType[] = ['NOTICE', 'UPDATE'];
const FIELD =
  'h-auto rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] shadow-none placeholder:text-subtle';

export function LetterBasicFields({ draft, onChange }: LetterBasicFieldsProps) {
  const pinnable = canPinDraft(draft);
  const tooLong = isPreviewTooLong(draft.preview);

  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <div className="flex flex-wrap items-end gap-8">
        <Field label="타입">
          <div className="flex gap-1 rounded-xl bg-muted p-1">
            {TYPES.map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={draft.type === type}
                onClick={() => onChange(withType(draft, type))}
                className={cn(
                  'rounded-lg px-4 py-1.5 text-[14px] font-medium text-subtle transition-colors',
                  draft.type === type && 'bg-card text-strong shadow-sm',
                )}
              >
                {LETTER_TYPE_LABEL[type]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="고정">
          <div className="flex h-[38px] items-center gap-2.5">
            <Switch
              checked={draft.pinned}
              disabled={!pinnable}
              onCheckedChange={(pinned) => onChange({ ...draft, pinned })}
              aria-label="리스트 상단 고정"
            />
            <span className="text-[14px] text-body">리스트 상단 고정</span>
            {/* 왜 못 켜는지 자리에서 말해 준다 — 비활성 스위치엔 툴팁이 잘 뜨지 않는다 */}
            {!pinnable && (
              <span className="text-[12px] text-subtle">
                공지만 고정할 수 있어요
              </span>
            )}
          </div>
        </Field>
      </div>

      <Field label="제목">
        <Input
          value={draft.title}
          onChange={(event) =>
            onChange({ ...draft, title: event.target.value })
          }
          aria-label="제목"
          className={FIELD}
        />
      </Field>

      <Field label="미리보기 문구 (목록 한 줄)">
        <Input
          value={draft.preview}
          onChange={(event) =>
            onChange({ ...draft, preview: event.target.value })
          }
          aria-label="미리보기 문구"
          aria-invalid={tooLong}
          className={FIELD}
        />
        <span
          className={cn(
            'self-end text-[12px] text-subtle',
            tooLong && 'text-destructive',
          )}
        >
          {draft.preview.length} / {PREVIEW_MAX}
        </span>
      </Field>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] text-subtle">{label}</span>
      {children}
    </label>
  );
}
