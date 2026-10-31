'use client';

// Day 초안 상세 조립 — 왼쪽 제목 카드·탭(질문 3열·표현·별점·라인업 행), 오른쪽 검증기·AI 검수·담당자 검수·재생성 (Figma 4131:766).
// 줄 클릭 ↔ 코멘트 참조, 검증기 path → 줄 하이라이트, 코멘트 초안은 sessionStorage에 임시 저장, 열면 로컬 열람 기록
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import type { ReviewVerdict } from '@/features/content/api/content-batch';
import type { ContentRuleRequest } from '@/features/content/api/content-rule';
import {
  readExpressions,
  readLineupRow,
  readReviewDefects,
  readScenarioDraft,
  readStarMessages,
  readValidationReport,
} from '@/features/content/api/draft-payload';
import {
  canRegenerateDraft,
  reviewBlockedReason,
} from '@/features/content/model/content-actions';
import { regenerationScopeOf } from '@/features/content/model/regeneration-scope';
import {
  toggleReference,
  type ReviewReference,
} from '@/features/content/model/review-reference';
import { markViewed } from '@/features/content/model/review-visit';
import { useContentDraftMutation } from '@/features/content/model/useContentMutation';
import {
  useContentBatchQuery,
  useContentDraftQuery,
} from '@/features/content/model/useContentQuery';
import { countDuplicates } from '@/features/content/model/validation-summary';
import { DesktopOnly } from '@/features/content/ui/DesktopOnly';
import { ApiError } from '@/shared/api/api-error';
import { cn } from '@/shared/lib/cn';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import {
  EMPTY_COMMENT,
  readCommentDraft,
  reviewCommentsOf,
  writeCommentDraft,
  type CommentDraft,
} from '../_model/comment-draft';
import {
  expressionRows,
  locateRow,
  rowElementId,
  type DraftTab,
} from '../_model/draft-content';
import { AiReviewCard } from './AiReviewCard';
import { DraftTitleCard } from './DraftTitleCard';
import { ExpressionList } from './ExpressionList';
import { LineupRowView } from './LineupRowView';
import { PromoteRuleDialog } from './PromoteRuleDialog';
import { QuestionColumns } from './QuestionColumns';
import { RegenerateCard } from './RegenerateCard';
import { ReviewerCard } from './ReviewerCard';
import { StarList } from './StarList';
import { ValidationCard } from './ValidationCard';

const HIGHLIGHT_MS = 2000;

export function DraftDetailPage({
  batchId,
  draftId,
}: {
  batchId: number;
  draftId: number;
}) {
  const batch = useContentBatchQuery(batchId);
  const draft = useContentDraftQuery(batchId, draftId);
  const mutation = useContentDraftMutation(batchId, draftId);
  const status = draft.data?.status;

  const [tab, setTab] = useState<DraftTab>('questions');
  const [comment, setComment] = useState<CommentDraft>(EMPTY_COMMENT);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [promoting, setPromoting] = useState<ContentRuleRequest | null>(null);
  /** 이번 화면에서 누른 재생성 범위 — 배너 문구. 새로고침하면 모른다 */
  const [regeneratingScope, setRegeneratingScope] = useState<string | null>(
    null,
  );

  // 아직 만드는 중일 때 본 건 새 결과를 본 게 아니다 — 끝난 뒤에만 기록한다
  useEffect(() => {
    if (status && status !== 'GENERATING') markViewed(draftId);
  }, [draftId, status]);

  // 새로고침 대비 임시 저장 — 마운트 때 읽고, 바뀔 때마다 쓴다
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage는 마운트 뒤에만 읽는다(서버 렌더와 어긋나지 않게)
    setComment(readCommentDraft(draftId));
  }, [draftId]);
  const changeComment = (next: CommentDraft) => {
    setComment(next);
    writeCommentDraft(draftId, next);
  };

  // 검증기·결함 path에서 찾아온 줄 — 스크롤하고 2초 뒤 하이라이트를 거둔다
  useEffect(() => {
    if (!highlight) return;
    document
      .getElementById(rowElementId(highlight))
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const timer = setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlight]);

  if (draft.isPending || batch.isPending)
    return <ListSkeleton rows={5} className="pt-4" />;
  if (draft.isError || batch.isError) {
    const error = draft.error ?? batch.error;
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <InlineError
        message={
          notFound ? '이 배치에 없는 Day예요' : 'Day 초안을 불러오지 못했어요'
        }
        // 배치·초안 중 실패한 쪽만 다시 읽는다
        onRetry={
          notFound
            ? undefined
            : () => {
                if (draft.isError) draft.refetch();
                if (batch.isError) batch.refetch();
              }
        }
      />
    );
  }

  const detail = draft.data;
  const batchStatus = batch.data.batch.status;
  const scenario = readScenarioDraft(detail.scenarioPayload);
  const expressions = readExpressions(detail.expressionPayload);
  const stars = readStarMessages(detail.starMessagePayload);
  const lineup = readLineupRow(detail.lineupRow);
  const validation = readValidationReport(detail.validationResult);
  const review = readReviewDefects(detail.reviewResult);
  const report = validation.state === 'ok' ? validation.value : null;
  const questions = scenario.state === 'ok' ? scenario.value.questions : [];
  const rows = expressionRows(
    expressions.state === 'ok' ? expressions.value : [],
    report,
  );
  const starList = stars.state === 'ok' ? stars.value : [];
  const generating = detail.status === 'GENERATING';
  const blockedReason = reviewBlockedReason(batchStatus, detail.status);

  const toggle = (reference: ReviewReference) =>
    changeComment(toggleReference(comment, reference));
  const locate = (path: string) => {
    const found = locateRow(path, rows);
    if (!found) return;
    setTab(found.tab);
    setHighlight(found.path);
  };
  const save = (verdict: ReviewVerdict) =>
    mutation.mutate(
      { type: 'review', verdict, comments: reviewCommentsOf(comment) },
      { onSuccess: () => changeComment(EMPTY_COMMENT) },
    );

  const tabs: { value: DraftTab; label: string }[] = [
    { value: 'questions', label: `질문 ${questions.length}` },
    { value: 'expressions', label: `표현 ${rows.length}` },
    { value: 'stars', label: `별점 ${starList.length}` },
    { value: 'lineup', label: '라인업 행' },
  ];

  return (
    <DesktopOnly>
      <div className="flex flex-col gap-4 pt-1 pb-12">
        <Link
          href={`/content-batches/${batchId}`}
          className="flex items-center gap-1.5 text-[13px] text-body hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Day 목록
        </Link>
        <div className="grid grid-cols-[minmax(0,1fr)_400px] items-start gap-4">
          <div className="flex min-w-0 flex-col gap-4">
            <DraftTitleCard
              draft={detail}
              scenario={scenario.state === 'ok' ? scenario.value : null}
              lineup={lineup.state === 'ok' ? lineup.value : null}
            />
            {generating && (
              <p
                role="status"
                className="rounded-xl bg-primary/10 px-4 py-3 text-[13px] text-primary"
              >
                다시 만들고 있어요
                {regeneratingScope &&
                  ` · ${regenerationScopeOf(regeneratingScope).label}`}
              </p>
            )}
            <div role="tablist" aria-label="콘텐츠 종류" className="flex gap-2">
              {tabs.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.value}
                  onClick={() => setTab(item.value)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                    tab === item.value
                      ? 'border-strong bg-strong text-white'
                      : 'border-field-border bg-card text-body hover:bg-hairline',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {/* 다시 만드는 동안 이전 내용은 흐리게 두고 누르지 못하게 */}
            <div
              className={cn(
                'flex flex-col gap-4',
                generating && 'pointer-events-none opacity-50',
              )}
              aria-busy={generating}
            >
              {tab === 'questions' && (
                <QuestionColumns
                  questions={questions}
                  selectedPath={comment.targetPath}
                  highlightPath={highlight}
                  onToggle={toggle}
                />
              )}
              {tab === 'expressions' && (
                <ExpressionList
                  rows={rows}
                  duplicates={countDuplicates(report)}
                  selectedPath={comment.targetPath}
                  highlightPath={highlight}
                  onToggle={toggle}
                />
              )}
              {tab === 'stars' && (
                <StarList
                  stars={starList}
                  selectedPath={comment.targetPath}
                  highlightPath={highlight}
                  onToggle={toggle}
                />
              )}
              {tab === 'lineup' && (
                <LineupRowView
                  lineup={lineup.state === 'ok' ? lineup.value : null}
                />
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <ValidationCard validation={validation} onLocate={locate} />
            <AiReviewCard
              review={review}
              onLocate={locate}
              onPromote={setPromoting}
            />
            <ReviewerCard
              comments={detail.comments}
              draft={comment}
              onChange={changeComment}
              blockedReason={blockedReason}
              pending={mutation.isPending}
              onSave={save}
              onPromote={setPromoting}
            />
            <RegenerateCard
              plannedDay={detail.plannedDay}
              enabled={canRegenerateDraft(batchStatus, detail.status)}
              pending={mutation.isPending}
              onRegenerate={(scope, done) =>
                mutation.mutate(
                  { type: 'regenerate', scope },
                  {
                    onSuccess: () => {
                      setRegeneratingScope(scope);
                      done();
                    },
                  },
                )
              }
            />
          </aside>
        </div>
        <PromoteRuleDialog
          target={promoting}
          onClose={() => setPromoting(null)}
        />
      </div>
    </DesktopOnly>
  );
}
