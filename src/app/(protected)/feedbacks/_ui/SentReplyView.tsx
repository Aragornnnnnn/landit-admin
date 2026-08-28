'use client';

// 처리완료 피드백 — 답장 폼 대신 이미 보낸 답장을 보여준다 (BE LAN-374의 reply).
// 보낸 답장은 되돌릴 수 없으므로 이 화면엔 읽기만 있다
import { X } from 'lucide-react';

import { formatDateTime } from '@/shared/lib/format-time';
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet';

import { type FeedbackDetail } from '../_model/useFeedbackDetailQuery';
import { FeedbackOriginCard, FeedbackPersonHeader } from './ReplyFields';

interface SentReplyViewProps {
  feedback: FeedbackDetail;
  onClose: () => void;
}

export function SentReplyView({ feedback, onClose }: SentReplyViewProps) {
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-4 rounded-l-[20px] p-7 data-[side=right]:sm:max-w-[520px]"
      >
        <SheetTitle className="sr-only">보낸 답장</SheetTitle>

        <FeedbackPersonHeader
          feedback={feedback}
          trailing={
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="rounded-md p-1 text-subtle hover:text-foreground"
            >
              <X className="size-5" aria-hidden />
            </button>
          }
        />

        <FeedbackOriginCard feedback={feedback} />

        <SentReplyCard reply={feedback.reply} />
      </SheetContent>
    </Sheet>
  );
}

function SentReplyCard({ reply }: { reply: FeedbackDetail['reply'] }) {
  // 답장 연결이 없는 건 — 옛 데이터거나 단건 조회가 없는 BE(운영 구버전) 폴백이다. 조용히 사실만 말한다
  if (!reply)
    return (
      <p className="rounded-[14px] bg-muted px-4 py-3 text-[13px] text-subtle">
        답장 내용을 불러오지 못했어요
      </p>
    );

  return (
    <article className="flex flex-col gap-2 rounded-[14px] bg-muted p-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-body">보낸 답장</span>
        <span className="text-xs text-subtle">
          {reply.sentAt ? formatDateTime(reply.sentAt) : ''}
        </span>
      </div>
      <p className="text-[15px] font-bold text-strong">{reply.title}</p>
      <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-strong">
        {reply.bodyText}
      </p>
    </article>
  );
}
