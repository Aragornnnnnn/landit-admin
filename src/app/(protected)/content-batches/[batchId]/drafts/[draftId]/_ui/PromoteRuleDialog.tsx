'use client';

// "규칙으로 승격" — AI 결함(reason)이나 FIX 코멘트(본문·sourceCommentId)를 제작 규칙으로 등록하는 Dialog. 폼은 규칙 화면과 같은 ContentRuleForm
import type { ContentRuleRequest } from '@/features/content/api/content-rule';
import { useContentRuleMutation } from '@/features/content/model/useContentMutation';
import { ContentRuleForm } from '@/features/content/ui/ContentRuleForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog';

interface PromoteRuleDialogProps {
  /** 없으면 닫힘 */
  target: ContentRuleRequest | null;
  onClose: () => void;
}

export function PromoteRuleDialog({ target, onClose }: PromoteRuleDialogProps) {
  const mutation = useContentRuleMutation();
  return (
    <Dialog
      open={target !== null}
      // 요청 중엔 닫지 않는다 — 닫힌 뒤 도착한 성공 콜백이 그사이 새로 연 Dialog를 닫을 수 있다
      onOpenChange={(next) => !next && !mutation.isPending && onClose()}
    >
      <DialogContent
        className="w-[calc(100%-4rem)] gap-5 rounded-2xl p-6 sm:max-w-[560px]"
        showCloseButton={false}
        onInteractOutside={(event) =>
          mutation.isPending && event.preventDefault()
        }
        onEscapeKeyDown={(event) =>
          mutation.isPending && event.preventDefault()
        }
      >
        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-[20px] font-bold text-foreground">
            규칙으로 승격
          </DialogTitle>
          <DialogDescription className="text-[13px] text-body">
            같은 지적이 반복되지 않게 제작 규칙으로 올려요. 은퇴하기 전까지 다음
            AI 호출의 프롬프트에 들어가요.
          </DialogDescription>
        </div>
        {target && (
          <ContentRuleForm
            key={`${target.scope}:${target.sourceCommentId ?? ''}:${target.ruleText}`}
            initial={target}
            pending={mutation.isPending}
            submitLabel="규칙 등록"
            onCancel={onClose}
            onSubmit={(body) =>
              mutation.mutate({ type: 'create', body }, { onSuccess: onClose })
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
