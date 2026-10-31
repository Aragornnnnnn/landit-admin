'use client';

// 담당자 검수 카드 — 대상 경로 · 코멘트 입력 · [FIX 저장 · OK] · 코멘트 목록(승격 포함). 잠긴 이유는 helper로 (docs/screens/content-batches.md "담당자 검수")
import type {
  ContentReviewComment,
  ReviewVerdict,
} from '@/features/content/api/content-batch';
import type { ContentRuleRequest } from '@/features/content/api/content-rule';
import { ruleScopeForPath } from '@/features/content/model/review-reference';
import { formatDateTime } from '@/shared/lib/format-time';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import {
  canSaveReview,
  COMMENT_MAX,
  type CommentDraft,
} from '../_model/comment-draft';
import { Card } from './ValidationCard';

interface ReviewerCardProps {
  comments: ContentReviewComment[];
  draft: CommentDraft;
  onChange: (draft: CommentDraft) => void;
  /** null이면 검수할 수 있다 */
  blockedReason: string | null;
  pending: boolean;
  onSave: (verdict: ReviewVerdict) => void;
  onPromote: (rule: ContentRuleRequest) => void;
}

const FIELD =
  'h-auto rounded-xl border-transparent bg-muted px-4 py-3 text-[13px] shadow-none';

export function ReviewerCard({
  comments,
  draft,
  onChange,
  blockedReason,
  pending,
  onSave,
  onPromote,
}: ReviewerCardProps) {
  const locked = blockedReason !== null || pending;
  return (
    <Card title="담당자 검수">
      <Input
        aria-label="대상 경로 (선택)"
        placeholder="대상 경로 (선택) · 줄을 클릭하면 채워져요"
        value={draft.targetPath}
        disabled={locked}
        onChange={(event) =>
          onChange({ ...draft, targetPath: event.target.value })
        }
        className={FIELD}
      />
      <Textarea
        aria-label="검수 코멘트"
        value={draft.text}
        maxLength={COMMENT_MAX}
        rows={4}
        disabled={locked}
        placeholder="질문·표현 줄을 클릭하면 [L1 Q2]처럼 참조가 들어가요"
        onChange={(event) => onChange({ ...draft, text: event.target.value })}
        className="min-h-0 rounded-xl border-transparent bg-muted px-4 py-3 text-[13px] shadow-none"
      />
      <div className="flex items-center justify-end gap-2">
        <span className="mr-auto text-[11px] text-subtle">
          {draft.text.length.toLocaleString()} / {COMMENT_MAX.toLocaleString()}
        </span>
        <Button
          variant="outline"
          disabled={locked || !canSaveReview('FIX', draft)}
          onClick={() => onSave('FIX')}
          className="h-9 px-4 text-[13px]"
        >
          FIX 저장
        </Button>
        <Button
          disabled={locked}
          onClick={() => onSave('OK')}
          className="h-9 bg-success px-4 text-[13px] text-white hover:bg-success/90"
        >
          OK
        </Button>
      </div>
      <p className="text-[12px] leading-[1.5] text-subtle">
        {blockedReason ??
          'FIX는 코멘트 1개 이상 필수. 질문·표현 줄을 클릭하면 [L1 Q2]·[E 1] 참조가 들어가고 targetPath로 저장돼요. OK면 열린 FIX 코멘트를 해결 처리해요.'}
      </p>

      {comments.length > 0 && (
        <ul className="flex flex-col gap-2 border-t border-field-border pt-3">
          {comments.map((comment) => (
            <li
              key={comment.commentId}
              className="flex flex-col gap-1 text-[12px] leading-[1.5]"
            >
              <span className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    comment.verdict === 'FIX'
                      ? 'rounded-full bg-primary/10 px-2 py-px text-[11px] font-bold text-primary'
                      : 'rounded-full bg-success/15 px-2 py-px text-[11px] font-bold text-success'
                  }
                >
                  {comment.verdict}
                </span>
                {comment.targetPath && (
                  <span className="font-mono text-[11px] text-subtle">
                    {comment.targetPath}
                  </span>
                )}
                {comment.createdAt && (
                  <span className="text-[11px] text-subtle">
                    {formatDateTime(comment.createdAt)}
                  </span>
                )}
                {comment.resolvedAt && (
                  <span className="text-[11px] text-subtle">해결됨</span>
                )}
                {comment.verdict === 'FIX' && (
                  <button
                    type="button"
                    onClick={() =>
                      onPromote({
                        scope: ruleScopeForPath(comment.targetPath),
                        ruleText: comment.comment ?? '',
                        sourceCommentId: comment.commentId,
                      })
                    }
                    className="ml-auto text-[11px] font-medium text-primary underline-offset-2 hover:underline"
                  >
                    규칙으로 승격
                  </button>
                )}
              </span>
              <span
                className={
                  comment.resolvedAt ? 'text-subtle line-through' : 'text-body'
                }
              >
                {comment.comment}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
