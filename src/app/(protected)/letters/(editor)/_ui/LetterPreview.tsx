'use client';

// 사용자 편지함 미리보기 — 쓰는 대로 사용자가 볼 화면을 그린다 (Figma 1050:10361 우측).
// 발행하면 되돌릴 수 없으니, 보내기 전에 사용자 눈으로 한 번 보는 자리다
import { LETTER_TYPE_LABEL } from '@/features/letter/model/letter-label';
import { MarkdownPreview } from '@/features/markdown-editor/ui/MarkdownPreview';
import { StatusChip } from '@/shared/ui/StatusChip';

import type { LetterDraft } from '../_model/letter-draft';

export function LetterPreview({
  draft,
  date,
}: {
  draft: LetterDraft;
  /** 사용자 화면에 찍힐 날짜 — "8월 18일" */
  date: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-center text-[13px] text-subtle">
        사용자 편지함 미리보기
      </p>
      <div className="flex h-[560px] w-[300px] flex-col gap-3 overflow-y-auto rounded-[28px] bg-card p-5">
        <span className="text-[13px] text-subtle">‹ 편지함</span>
        <span className="flex items-center gap-2">
          <StatusChip>{LETTER_TYPE_LABEL[draft.type]}</StatusChip>
          <span className="text-[12px] text-subtle">{date}</span>
        </span>
        <h3 className="text-[17px] leading-snug font-bold text-foreground">
          {draft.title}
        </h3>

        {/* 사용자 앱과 같은 렌더 조합 — 여기서 보이는 그대로 편지함에 보인다 */}
        <MarkdownPreview text={draft.body} className="text-[14px]" />
      </div>
    </div>
  );
}
