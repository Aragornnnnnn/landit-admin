'use client';

// 답장 화면의 알맹이 — 누구에게 쓰는지 · 무엇에 대한 답인지 · 함께 보낼 건 · 제목과 본문.
// 데스크톱 시트(1050:8441)와 모바일 전체화면(1050:9368)이 같은 내용을 담고 입력 배경만 다르다
import { ChevronDown, ExternalLink } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format-time';
import { Checkbox } from '@/shared/ui/checkbox';
import { InlineError } from '@/shared/ui/InlineError';
import { Input } from '@/shared/ui/input';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Textarea } from '@/shared/ui/textarea';

import { FEEDBACK_TYPE_LABEL } from '../_model/feedback-label';
import { REPLY_BODY_MAX, REPLY_TITLE_MAX } from '../_model/reply-draft';
import type { FeedbackItem } from '../_model/useFeedbackListQuery';
import type { ReplyDraft } from '../_model/useReplyDraft';

interface ReplyFieldsProps {
  feedback: FeedbackItem;
  draft: ReplyDraft;
  /** 시트는 흰 배경 위라 입력이 회색, 전체화면은 회색 배경 위라 입력이 흰색 (Figma 프레임 기준) */
  variant: 'sheet' | 'screen';
  /** 헤더 오른쪽에 붙일 것 — 시트의 닫기 버튼 */
  trailing?: React.ReactNode;
}

export function ReplyFields({
  feedback,
  draft,
  variant,
  trailing,
}: ReplyFieldsProps) {
  const fieldClassName = cn(
    'rounded-xl px-4 py-3 text-[14px] shadow-none placeholder:text-subtle',
    'border-transparent',
    variant === 'sheet' ? 'bg-muted' : 'bg-card',
  );

  return (
    <>
      <header className="flex items-start gap-3">
        <div className="flex flex-1 flex-col gap-0.5">
          <h2 className="text-[22px] leading-tight font-bold text-foreground">
            {feedback.nickname}
          </h2>
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
        {trailing}
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

      <TogetherSection draft={draft} />

      <Input
        value={draft.title}
        maxLength={REPLY_TITLE_MAX}
        onChange={(event) => draft.setTitle(event.target.value)}
        placeholder="제목"
        aria-label="답장 제목"
        className={cn('h-auto', fieldClassName)}
      />
      <Textarea
        value={draft.bodyText}
        maxLength={REPLY_BODY_MAX}
        onChange={(event) => draft.setBodyText(event.target.value)}
        placeholder="본문"
        aria-label="답장 본문"
        className={cn(
          'resize-none',
          variant === 'sheet' ? 'min-h-[220px] flex-1' : 'min-h-[180px]',
          fieldClassName,
        )}
      />
    </>
  );
}

function TogetherSection({ draft }: { draft: ReplyDraft }) {
  const { candidates, others } = draft;

  if (others.isPending) return <ListSkeleton rows={1} />;
  if (others.isError)
    return (
      <InlineError
        message="다른 피드백을 불러오지 못했어요"
        onRetry={() => others.refetch()}
      />
    );
  // 다른 처리중 건이 없으면 줄 자체를 그리지 않는다 — 빈 접힘은 정보가 아니다
  if (candidates.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={draft.toggleExpanded}
        aria-expanded={draft.expanded}
        className="flex items-center gap-2 text-[13px] text-body"
      >
        <span>이 사용자의 다른 피드백 {candidates.length}건</span>
        <span className="text-subtle">함께 답장</span>
        <ChevronDown
          aria-hidden
          className={cn(
            'ml-auto size-4 text-subtle transition-transform',
            draft.expanded && 'rotate-180',
          )}
        />
      </button>

      {draft.expanded && (
        <ul className="flex flex-col gap-1">
          {candidates.map((item) => (
            <li key={item.feedbackId}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-2">
                <Checkbox
                  checked={
                    item.feedbackId !== undefined &&
                    draft.selectedIds.includes(item.feedbackId)
                  }
                  onCheckedChange={() =>
                    item.feedbackId && draft.toggleFeedback(item.feedbackId)
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
