'use client';

// 답장 화면의 알맹이 — 누구에게 쓰는지 · 무엇에 대한 답인지 · 함께 보낼 건 · 템플릿 · 제목과 본문.
// 데스크톱 시트(1050:8441)와 모바일 전체화면(1050:9368)이 같은 내용을 담고 입력 배경만 다르다
import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format-time';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Checkbox } from '@/shared/ui/checkbox';
import { InlineError } from '@/shared/ui/InlineError';
import { Input } from '@/shared/ui/input';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Textarea } from '@/shared/ui/textarea';

import { FEEDBACK_TYPE_LABEL } from '../_model/feedback-label';
import { REPLY_BODY_MAX, REPLY_TITLE_MAX } from '../_model/reply-draft';
import { templatesFor, type ReplyTemplate } from '../_model/reply-templates';
import type { FeedbackItem } from '../_model/useFeedbackListQuery';
import type { ReplyDraft } from '../_model/useReplyDraft';
import { TemplateManagerDialog } from './TemplateManagerDialog';

interface ReplyFieldsProps {
  feedback: FeedbackItem;
  draft: ReplyDraft;
  /** 시트는 흰 배경 위라 입력이 회색, 전체화면은 회색 배경 위라 입력이 흰색 (Figma 프레임 기준) */
  variant: 'sheet' | 'screen';
  /** 헤더 오른쪽에 붙일 것 — 시트의 닫기 버튼 */
  trailing?: React.ReactNode;
}

/** 누구에게 쓰는지 — 닉네임·이메일·사용자 상세 링크. 답장 폼과 보낸 답장 뷰가 같이 쓴다 */
export function FeedbackPersonHeader({
  feedback,
  trailing,
}: {
  feedback: FeedbackItem;
  trailing?: React.ReactNode;
}) {
  return (
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
  );
}

/** 클릭한 피드백 원문 — 무엇에 대한 답인지 */
export function FeedbackOriginCard({ feedback }: { feedback: FeedbackItem }) {
  return (
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
  );
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
      <FeedbackPersonHeader feedback={feedback} trailing={trailing} />

      <FeedbackOriginCard feedback={feedback} />

      <TogetherSection draft={draft} />

      <TemplateRow draft={draft} feedbackType={feedback.type} />

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

/**
 * 답장 템플릿 칩 줄 — 유형에 맞는 템플릿이 미리 채워져 있고(진한 칩), 다른 칩을 누르면 바꿔 끼운다.
 * 그 유형에 어울리는 템플릿(+직접 만든 것)만 보여줘 고르기 쉽게 한다.
 * 템플릿 그대로면 확인 없이 바꾸고, 직접 고친 글자가 있을 때만 덮어쓰기 전에 묻는다
 */
function TemplateRow({
  draft,
  feedbackType,
}: {
  draft: ReplyDraft;
  feedbackType: FeedbackItem['type'];
}) {
  const store = draft.templatesStore;
  const [confirming, setConfirming] = useState<ReplyTemplate | null>(null);
  const [managing, setManaging] = useState(false);

  const shown = templatesFor(feedbackType, store.templates);

  const apply = (template: ReplyTemplate) => {
    if (draft.isTemplateUntouched) {
      draft.applyTemplate(template);
      return;
    }
    setConfirming(template);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[12px] text-subtle">템플릿</span>
      {shown.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => apply(template)}
          className={cn(
            'rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors',
            template.id === draft.appliedTemplateId
              ? 'bg-foreground text-background'
              : 'bg-chip text-chip-foreground hover:bg-hairline',
          )}
        >
          {template.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setManaging(true)}
        className="px-1 text-[12px] text-subtle underline-offset-2 hover:text-foreground hover:underline"
      >
        관리
      </button>

      {managing && (
        // 열 때마다 새로 마운트한다 — 작업 사본이 항상 현재 저장값에서 시작하게
        <TemplateManagerDialog
          store={store}
          onClose={() => setManaging(false)}
        />
      )}

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
              onClick={() => confirming && draft.applyTemplate(confirming)}
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
