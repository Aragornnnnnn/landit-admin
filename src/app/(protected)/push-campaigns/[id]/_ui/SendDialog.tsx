'use client';

// 지금 발송 확인 — 몇 명·몇 기기에게 가는지와 내용을 보여 주고 되돌릴 수 없음을 말한다 (Figma 2183:363)
import type {
  PushAudiencePreview,
  PushCampaign,
} from '@/features/push-campaign/api/push-campaign';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';

interface SendDialogProps {
  open: boolean;
  campaign: PushCampaign;
  /** 아직 못 받았을 수 있다 — 그러면 인원 없이 묻는다 */
  preview: PushAudiencePreview | undefined;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const count = (n: number) => n.toLocaleString('ko-KR');

export function SendDialog({
  open,
  campaign,
  preview,
  pending,
  onCancel,
  onConfirm,
}: SendDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent className="w-[calc(100%-4rem)] gap-3.5 rounded-2xl p-6 sm:w-[500px] sm:max-w-[500px]">
        <AlertDialogTitle className="text-[17px] font-bold text-foreground">
          {preview
            ? `지금 ${count(preview.estimatedUserCount)}명에게 보낼까요?`
            : '지금 보낼까요?'}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-muted-foreground">
          {preview
            ? `${count(preview.estimatedTokenCount)}개 기기로 보내요. `
            : ''}
          보낸 푸시는 되돌릴 수 없어요.
        </AlertDialogDescription>

        <dl className="flex flex-col gap-2 rounded-xl bg-background px-4 py-3.5 text-[13px]">
          <Row label="제목">{campaign.title}</Row>
          <Row label="본문">{campaign.body}</Row>
          <Row label="이동">
            <span className="font-mono break-all">{campaign.deepLink}</span>
          </Row>
        </dl>

        <AlertDialogFooter className="mx-0 mb-0 flex-row justify-end gap-2 border-0 bg-transparent p-0 pt-1">
          <AlertDialogCancel className="m-0">취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="m-0"
            onClick={(event) => {
              // 보내는 동안 창을 닫지 않는다 — 결과를 보고 닫는다
              event.preventDefault();
              onConfirm();
            }}
          >
            지금 발송
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <dt className="w-9 shrink-0 text-[12px] font-medium text-subtle">
        {label}
      </dt>
      <dd className="min-w-px flex-1 leading-[1.5] text-strong">{children}</dd>
    </div>
  );
}
