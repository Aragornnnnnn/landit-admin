'use client';

// 저장 확인 — 저장하는 순간 앱이 바뀌므로, 무슨 일이 일어나는지 한 문장으로 말한다
// (docs/screens/app-versions.md "저장 확인 창에 영향 문장")
import type { Platform } from '@/features/app-version/api/app-version';
import { PLATFORM_LABEL } from '@/features/app-version/model/platform';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

import {
  saveImpactSentence,
  type AppVersionDraft,
} from '../_model/app-version-draft';

interface SaveVersionDialogProps {
  /** 저장을 물어볼 플랫폼. 없으면 닫힌 상태 */
  platform: Platform | null;
  draft: AppVersionDraft | undefined;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SaveVersionDialog({
  platform,
  draft,
  pending,
  onCancel,
  onConfirm,
}: SaveVersionDialogProps) {
  return (
    <AlertDialog
      open={Boolean(platform && draft)}
      onOpenChange={(next) => !next && onCancel()}
    >
      <AlertDialogContent className="w-[calc(100%-4rem)] gap-3.5 rounded-2xl p-6 sm:w-[420px]">
        <AlertDialogTitle className="text-[17px] font-bold text-foreground">
          {platform ? `${PLATFORM_LABEL[platform]} 정책을 저장할까요?` : ''}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-muted-foreground">
          {draft ? saveImpactSentence(draft) : ''}
        </AlertDialogDescription>
        <AlertDialogFooter className="mx-0 mb-0 flex-row justify-end gap-2 border-0 bg-transparent p-0 pt-1">
          <AlertDialogCancel className="m-0">취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="m-0"
            onClick={(event) => {
              // 저장하는 동안 창을 닫지 않는다 — 결과를 보고 닫는다
              event.preventDefault();
              onConfirm();
            }}
          >
            저장
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
