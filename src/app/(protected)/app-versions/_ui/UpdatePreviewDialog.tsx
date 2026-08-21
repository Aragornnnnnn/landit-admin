'use client';

// 앱 화면 미리보기 — 지금 입력값이면 사용자가 볼 화면 (Figma 1050:12120 · 12325).
// 문구를 저장하기 전에 "그래서 앱에 뭐라고 뜨는데?"를 눈으로 확인하는 자리다
import { X } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { LanditAppIcon } from '@/shared/ui/LanditAppIcon';

import {
  PLATFORM_LABEL,
  type AppVersionDraft,
  type Platform,
} from '../_model/app-version-draft';
import {
  previewRangeLabel,
  previewReason,
  UPDATE_KIND_LABEL,
  type UpdateKind,
} from '../_model/update-preview';

interface UpdatePreviewDialogProps {
  /** 열려 있으면 어떤 플랫폼인지. 닫혀 있으면 null */
  platform: Platform | null;
  draft: AppVersionDraft | undefined;
  /** 한 종류만 볼 때(모바일 프레임) — 없으면 둘 다 */
  only?: UpdateKind;
  onClose: () => void;
}

export function UpdatePreviewDialog({
  platform,
  draft,
  only,
  onClose,
}: UpdatePreviewDialogProps) {
  const kinds: UpdateKind[] = only ? [only] : ['force', 'soft'];

  return (
    <Dialog
      open={Boolean(platform && draft)}
      onOpenChange={(next) => !next && onClose()}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] gap-4 rounded-[20px] p-6 sm:max-w-[720px]"
      >
        <header className="flex items-start gap-3">
          <DialogTitle className="flex-1 text-[17px] font-bold text-foreground">
            {platform
              ? `${PLATFORM_LABEL[platform]} 사용자가 보게 될 화면`
              : ''}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-md p-1 text-subtle hover:text-foreground"
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>

        <div className="flex flex-wrap justify-center gap-4">
          {draft &&
            kinds.map((kind) => (
              <figure key={kind} className="flex flex-col items-center gap-2">
                <figcaption className="text-[12px] text-subtle">
                  {UPDATE_KIND_LABEL[kind]} · {previewRangeLabel(draft, kind)}
                </figcaption>
                <PhoneMockup kind={kind} reason={previewReason(draft, kind)} />
              </figure>
            ))}
        </div>

        <p className="text-center text-[12px] leading-relaxed text-subtle">
          입력한 문구가 그대로 들어가요. 문구를 비우면 앱 기본 문구가 나와요.
        </p>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 폰 목업 — 강제는 가운데 모달, 권유는 하단 바텀시트다.
 * 닫을 수 있느냐(나중에 할래요)가 두 화면의 진짜 차이라서 그 버튼 하나로 성격이 드러난다
 */
function PhoneMockup({ kind, reason }: { kind: UpdateKind; reason: string }) {
  const force = kind === 'force';
  return (
    <div
      className={cn(
        'flex h-[420px] w-[260px] overflow-hidden rounded-[28px] bg-subtle/60 p-3',
        force ? 'items-center' : 'items-end p-0',
      )}
    >
      <div
        className={cn(
          'flex w-full flex-col items-center gap-2 bg-card px-5 py-6',
          force ? 'rounded-[20px]' : 'rounded-t-[24px]',
        )}
      >
        <LanditAppIcon size={72} className="rounded-2xl" />
        <p className="text-[16px] font-bold text-foreground">
          Landit 새 버전 출시!
        </p>
        <p className="text-center text-[13px] leading-relaxed text-body">
          {reason}
        </p>
        <span className="mt-1 w-full rounded-xl bg-primary py-2.5 text-center text-[14px] font-medium text-primary-foreground">
          업데이트하러 가기
        </span>
        {!force && (
          <span className="pt-1 text-[13px] font-medium text-body">
            나중에 할래요
          </span>
        )}
      </div>
    </div>
  );
}
