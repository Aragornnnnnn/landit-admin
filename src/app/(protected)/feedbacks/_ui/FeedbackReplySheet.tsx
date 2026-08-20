'use client';

// 상세·답장 시트 — 클릭한 피드백을 읽고 그 사용자에게 답장한다 (Figma 1050:8441 · 9683).
// 프레임 기준: 클릭한 1건이 원문 카드로 크게, 나머지 처리중은 접힌 "함께 답장" 목록.
// 되돌릴 수 없는 작업이라 기본은 1건이고, 함께 처리하려면 펼쳐서 체크해야 한다
import { useState } from 'react';
import { ChevronDown, ExternalLink, X } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format-time';
import { reportError } from '@/shared/monitoring/report';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { InlineError } from '@/shared/ui/InlineError';
import { Input } from '@/shared/ui/input';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/sheet';
import { Textarea } from '@/shared/ui/textarea';

import { FEEDBACK_TYPE_LABEL } from '../_model/feedback-label';
import {
  canSendReply,
  REPLY_BODY_MAX,
  REPLY_TITLE_MAX,
  replyButtonLabel,
  toggleTogetherFeedback,
} from '../_model/reply-draft';
import type { FeedbackItem } from '../_model/useFeedbackListQuery';
import { useSendReplyMutation } from '../_model/useSendReplyMutation';
import { useUserPendingFeedbacksQuery } from '../_model/useUserPendingFeedbacksQuery';
import { ReplyConfirmDialog } from './ReplyConfirmDialog';

interface FeedbackReplySheetProps {
  /** 목록에서 클릭한 피드백 (부모가 feedbackId를 key로 줘서 행이 바뀌면 새로 마운트된다) */
  feedback: FeedbackItem;
  onClose: () => void;
}

export function FeedbackReplySheet({
  feedback,
  onClose,
}: FeedbackReplySheetProps) {
  const primaryId = feedback.feedbackId!;
  const others = useUserPendingFeedbacksQuery(feedback.email);
  const sendReply = useSendReplyMutation();

  // 초기값으로만 잡는다 — 다른 행을 열면 부모의 key가 바뀌어 이 컴포넌트가 통째로 새로 마운트되므로
  // 남의 피드백에 쓰던 답장이 섞일 일이 없다 (초기화 이펙트가 필요 없는 이유)
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([primaryId]);
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const togetherCandidates = (others.data?.items ?? []).filter(
    (item) => item.feedbackId !== primaryId,
  );
  const draft = { title, bodyText, feedbackIds: selectedIds };
  const sent = sendReply.isSuccess;

  const send = () => {
    sendReply.mutate(
      {
        title: title.trim(),
        bodyText: bodyText.trim(),
        feedbackIds: selectedIds,
      },
      {
        onSettled: () => setConfirming(false),
        onError: (error) => reportError(error),
      },
    );
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      {/* shadcn 기본값 sm:max-w-sm(384px)이 폭을 잡아먹어 Figma 520px로 덮는다 */}
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-4 rounded-l-[20px] p-7 data-[side=right]:sm:max-w-[520px]"
      >
        <header className="flex items-start gap-3">
          <div className="flex flex-1 flex-col gap-0.5">
            <SheetTitle className="text-[22px] leading-tight font-bold text-foreground">
              {feedback.nickname}
            </SheetTitle>
            <p className="flex items-center gap-1 text-[13px] text-subtle">
              {feedback.email}
              {feedback.userProfileId && (
                <>
                  <span aria-hidden>·</span>
                  <a
                    href={`/users/${feedback.userProfileId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 hover:text-foreground"
                  >
                    사용자 상세
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-md p-1 text-subtle hover:text-foreground"
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>

        {/* 클릭한 피드백 원문 — 답장하려고 연 그 건이다 */}
        <article className="flex flex-col gap-2 rounded-[14px] bg-background p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-chip-foreground">
              {feedback.type ? FEEDBACK_TYPE_LABEL[feedback.type] : ''}
            </span>
            <span className="text-xs text-subtle">
              {feedback.createdAt ? formatDateTime(feedback.createdAt) : ''}
            </span>
          </div>
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-strong">
            {feedback.content}
          </p>
        </article>

        <TogetherSection
          loading={others.isPending}
          error={others.isError}
          onRetry={() => others.refetch()}
          candidates={togetherCandidates}
          selectedIds={selectedIds}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((value) => !value)}
          onToggleFeedback={(id) =>
            setSelectedIds((ids) => toggleTogetherFeedback(ids, primaryId, id))
          }
        />

        <Input
          value={title}
          maxLength={REPLY_TITLE_MAX}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="제목"
          aria-label="답장 제목"
          className="h-auto rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] shadow-none placeholder:text-subtle"
        />
        <Textarea
          value={bodyText}
          maxLength={REPLY_BODY_MAX}
          onChange={(event) => setBodyText(event.target.value)}
          placeholder="본문"
          aria-label="답장 본문"
          className="min-h-[220px] flex-1 resize-none rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] shadow-none placeholder:text-subtle"
        />

        {sent ? (
          <p
            role="status"
            className="rounded-xl bg-muted px-4 py-3 text-center text-[14px] font-medium text-strong"
          >
            보냈어요
          </p>
        ) : (
          <Button
            size="lg"
            disabled={!canSendReply(draft) || sendReply.isPending}
            onClick={() => setConfirming(true)}
            className="h-12 w-full text-[15px]"
          >
            {replyButtonLabel(selectedIds)}
          </Button>
        )}

        <ReplyConfirmDialog
          open={confirming}
          nickname={feedback.nickname}
          pending={sendReply.isPending}
          onCancel={() => setConfirming(false)}
          onConfirm={send}
        />
      </SheetContent>
    </Sheet>
  );
}

function TogetherSection({
  loading,
  error,
  onRetry,
  candidates,
  selectedIds,
  expanded,
  onToggleExpanded,
  onToggleFeedback,
}: {
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  candidates: FeedbackItem[];
  selectedIds: number[];
  expanded: boolean;
  onToggleExpanded: () => void;
  onToggleFeedback: (feedbackId: number) => void;
}) {
  if (loading) return <ListSkeleton rows={1} />;
  if (error)
    return (
      <InlineError
        message="다른 피드백을 불러오지 못했어요"
        onRetry={onRetry}
      />
    );
  // 다른 처리중 건이 없으면 줄 자체를 그리지 않는다 — 빈 접힘은 정보가 아니다
  if (candidates.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onToggleExpanded}
        aria-expanded={expanded}
        className="flex items-center gap-2 text-[13px] text-body"
      >
        <span>이 사용자의 다른 피드백 {candidates.length}건</span>
        <span className="text-subtle">함께 답장</span>
        <ChevronDown
          aria-hidden
          className={cn(
            'ml-auto size-4 text-subtle transition-transform',
            expanded && 'rotate-180',
          )}
        />
      </button>

      {expanded && (
        <ul className="flex flex-col gap-1">
          {candidates.map((item) => (
            <li key={item.feedbackId}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-2">
                <Checkbox
                  checked={
                    item.feedbackId !== undefined &&
                    selectedIds.includes(item.feedbackId)
                  }
                  onCheckedChange={() =>
                    item.feedbackId && onToggleFeedback(item.feedbackId)
                  }
                />
                <span className="text-[13px] font-medium text-chip-foreground">
                  {item.type ? FEEDBACK_TYPE_LABEL[item.type] : ''}
                </span>
                <span className="flex-1 truncate text-[13px] text-strong">
                  {item.content}
                </span>
                <span className="text-xs text-subtle">
                  {item.createdAt
                    ? formatDateTime(item.createdAt).slice(0, 5)
                    : ''}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
