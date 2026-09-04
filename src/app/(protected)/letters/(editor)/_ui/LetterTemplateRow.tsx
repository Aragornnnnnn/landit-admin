'use client';

// 공지·업데이트 템플릿 칩 줄 — 누르면 유형·제목·미리보기·본문이 공식 문구로 채워진다.
// 이미 쓰던 내용이 있으면 덮어쓰기 전에 한 번 묻는다 — 쓰던 편지가 소리 없이 날아가면 안 된다
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';

import {
  EMPTY_LETTER_DRAFT,
  isSameDraft,
  type LetterDraft,
} from '../_model/letter-draft';
import {
  applyLetterTemplate,
  LETTER_TEMPLATES,
  type LetterTemplate,
} from '../_model/letter-templates';

interface LetterTemplateRowProps {
  draft: LetterDraft;
  onChange: (draft: LetterDraft) => void;
}

export function LetterTemplateRow({ draft, onChange }: LetterTemplateRowProps) {
  const [confirming, setConfirming] = useState<LetterTemplate | null>(null);

  const apply = (template: LetterTemplate) => {
    if (!isSameDraft(draft, EMPTY_LETTER_DRAFT)) {
      setConfirming(template);
      return;
    }
    onChange(applyLetterTemplate(draft, template));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[12px] text-subtle">템플릿</span>
      {LETTER_TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => apply(template)}
          className="rounded-full bg-chip px-3 py-1.5 text-[12px] font-medium text-chip-foreground transition-colors hover:bg-hairline"
        >
          {template.label}
        </button>
      ))}

      <AlertDialog
        open={confirming !== null}
        onOpenChange={(next) => !next && setConfirming(null)}
      >
        <AlertDialogContent className="w-[calc(100%-4rem)] gap-3.5 rounded-2xl p-6 sm:w-[400px]">
          <AlertDialogTitle className="text-[17px] font-bold text-foreground">
            쓰던 내용을 지우고 템플릿을 적용할까요?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[14px] text-muted-foreground">
            지금 입력한 제목과 본문이 템플릿 내용으로 바뀌어요.
          </AlertDialogDescription>
          <AlertDialogFooter className="mx-0 mb-0 flex-row gap-2 border-0 bg-transparent p-0 pt-1 sm:justify-stretch">
            <AlertDialogCancel className="m-0 flex-1">취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                confirming && onChange(applyLetterTemplate(draft, confirming))
              }
              className="m-0 flex-1"
            >
              적용
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
