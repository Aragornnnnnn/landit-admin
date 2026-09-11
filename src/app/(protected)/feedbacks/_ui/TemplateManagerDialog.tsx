'use client';

// 답장 템플릿 편집 — 어드민 안에서 문구를 고치고 추가·삭제한다.
// BE 저장이 없어 이 브라우저(localStorage)에만 유지된다 — 그 한계를 창 안에서 밝힌다
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import type { ReplyTemplate } from '../_model/reply-templates';
import type { ReplyTemplatesStore } from '../_model/useReplyTemplates';

interface TemplateManagerDialogProps {
  store: ReplyTemplatesStore;
  onClose: () => void;
}

export function TemplateManagerDialog({
  store,
  onClose,
}: TemplateManagerDialogProps) {
  // 작업 사본 — 저장을 누르기 전까지 칩에 영향을 주지 않는다
  const [drafts, setDrafts] = useState<ReplyTemplate[]>(store.templates);
  const [at, setAt] = useState(0);

  const current = drafts[at];

  const patch = (change: Partial<ReplyTemplate>) =>
    setDrafts((list) =>
      list.map((one, index) => (index === at ? { ...one, ...change } : one)),
    );

  const add = () => {
    setDrafts((list) => [
      ...list,
      { id: crypto.randomUUID(), label: '새 템플릿', title: '', body: '' },
    ]);
    setAt(drafts.length);
  };

  const remove = () => {
    if (drafts.length <= 1) return;
    setDrafts((list) => list.filter((_, index) => index !== at));
    setAt((index) => Math.max(0, index - 1));
  };

  // 이름·제목·본문이 다 비어 있는 템플릿은 저장하지 않는다 — 빈 칩은 눌러도 하는 일이 없다
  const cleaned = drafts.filter(
    (one) => one.label.trim() && (one.title.trim() || one.body.trim()),
  );

  const save = () => {
    if (cleaned.length === 0) return;
    store.save(cleaned);
    toast.success('템플릿을 저장했어요');
    onClose();
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100%-2rem)] flex-col gap-4 overflow-y-auto rounded-[20px] p-6 sm:max-w-[640px]">
        <DialogTitle className="text-[17px] font-bold text-foreground">
          답장 템플릿 관리
        </DialogTitle>
        <DialogDescription className="text-[13px] text-muted-foreground">
          이 브라우저에만 저장돼요. 팀 전체의 기본 문구를 바꾸려면 개발자에게
          요청해 주세요.
        </DialogDescription>

        <div className="flex flex-wrap items-center gap-1.5">
          {drafts.map((template, index) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setAt(index)}
              className={cn(
                'rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors',
                index === at
                  ? 'bg-foreground text-background'
                  : 'bg-chip text-chip-foreground hover:bg-hairline',
              )}
            >
              {template.label.trim() || '(이름 없음)'}
            </button>
          ))}
          <button
            type="button"
            onClick={add}
            aria-label="템플릿 추가"
            className="flex items-center gap-1 rounded-full border border-dashed border-field-border px-3 py-1.5 text-[12px] text-subtle hover:text-foreground"
          >
            <Plus className="size-3.5" aria-hidden />
            추가
          </button>
        </div>

        {current && (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-subtle">칩 이름</span>
              <Input
                value={current.label}
                onChange={(event) => patch({ label: event.target.value })}
                className="h-auto rounded-xl border-transparent bg-muted px-4 py-2.5 text-[14px] shadow-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-subtle">답장 제목</span>
              <Input
                value={current.title}
                onChange={(event) => patch({ title: event.target.value })}
                className="h-auto rounded-xl border-transparent bg-muted px-4 py-2.5 text-[14px] shadow-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-subtle">
                답장 본문 — {'{닉네임}'}을 쓰면 받는 사람 닉네임으로 바뀌어요
              </span>
              <Textarea
                value={current.body}
                onChange={(event) => patch({ body: event.target.value })}
                className="min-h-[200px] resize-none rounded-xl border-transparent bg-muted px-4 py-2.5 text-[14px] shadow-none"
              />
            </label>
            <button
              type="button"
              onClick={remove}
              disabled={drafts.length <= 1}
              className="flex w-fit items-center gap-1 text-[12px] text-subtle hover:text-destructive disabled:opacity-40"
            >
              <Trash2 className="size-3.5" aria-hidden />이 템플릿 삭제
            </button>
          </div>
        )}

        <footer className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              store.reset();
              toast.success('기본 템플릿으로 되돌렸어요');
              onClose();
            }}
            className="text-[12px] text-subtle underline-offset-2 hover:underline"
          >
            기본값 복원
          </button>
          <span className="ml-auto flex gap-2">
            <Button
              variant="secondary"
              onClick={onClose}
              className="h-10 px-4 text-[14px]"
            >
              취소
            </Button>
            <Button
              onClick={save}
              disabled={cleaned.length === 0}
              className="h-10 px-4 text-[14px]"
            >
              저장
            </Button>
          </span>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
