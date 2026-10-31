'use client';

// Day 초안 상세 조립 — 왼쪽 제목 카드·탭(질문 3열·표현·별점·라인업 행), 오른쪽 검증기·AI 검수·담당자 검수·재생성 (Figma 4131:766).
// 줄 클릭 ↔ 코멘트 참조, 검증기 path → 줄 하이라이트, 코멘트 초안은 sessionStorage에 임시 저장, 열면 로컬 열람 기록.
// payload는 "없음 / 깨짐 / 정상"을 가른다 — 깨진 값이 빈 값처럼 보이지 않게(1차 결정)
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
  type Reading,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/shadcn/tabs';

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

const isNotFound = (error: unknown) =>
  error instanceof ApiError && error.status === 404;

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
  // 새로고침 대비 임시 저장 — 데이터가 오기 전엔 스켈레톤이라 서버 렌더와 어긋나지 않는다. Day가 바뀌면 page가 key로 새로 마운트한다
  const [comment, setComment] = useState<CommentDraft>(() =>
    readCommentDraft(draftId),
  );
  /** at은 같은 줄을 2초 안에 다시 눌러도 스크롤하게 하는 표시 */
  const [highlight, setHighlight] = useState<{
    path: string;
    at: number;
  } | null>(null);
  const [promoting, setPromoting] = useState<ContentRuleRequest | null>(null);
  /** 이번 화면에서 누른 재생성 범위 — 배너 문구. 새로고침하면 모른다 */
  const [regeneratingScope, setRegeneratingScope] = useState<string | null>(
    null,
  );

  // 아직 만드는 중일 때 본 건 새 결과를 본 게 아니다 — 끝난 뒤에만 기록한다
  useEffect(() => {
    if (status && status !== 'GENERATING') markViewed(draftId);
  }, [draftId, status]);

  // 검증기·결함 path에서 찾아온 줄 — 스크롤하고 2초 뒤 하이라이트를 거둔다
  useEffect(() => {
    if (!highlight) return;
    document
      .getElementById(rowElementId(highlight.path))
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const timer = setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlight]);

  const changeComment = (next: CommentDraft) => {
    setComment(next);
    writeCommentDraft(draftId, next);
  };

  if (draft.isPending || batch.isPending)
    return <ListSkeleton rows={5} className="pt-4" />;
  if (draft.isError || batch.isError) {
    // 배치가 없으면 배치 문구, 배치는 있는데 이 Day가 없으면(다른 배치의 draftId) Day 문구
    const message = isNotFound(batch.error)
      ? '배치를 찾을 수 없어요'
      : isNotFound(draft.error)
        ? '이 배치에 없는 Day예요'
        : 'Day 초안을 불러오지 못했어요';
    const notFound = isNotFound(batch.error) || isNotFound(draft.error);
    return (
      <InlineError
        message={message}
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
  // 검수가 잠겼거나 저장 중이면 줄 클릭도 막는다 — 비활성 칸에 참조만 쌓이거나 성공 콜백이 지워 버리지 않게
  const locked = blockedReason !== null || mutation.isPending;

  const toggle = (reference: ReviewReference) => {
    if (locked) return;
    changeComment(toggleReference(comment, reference));
  };
  const locate = (path: string) => {
    const found = locateRow(path, rows);
    if (!found) return;
    setTab(found.tab);
    // at을 올려 같은 줄을 2초 안에 다시 눌러도 effect가 다시 돈다
    setHighlight((current) => ({
      path: found.path,
      at: (current?.at ?? 0) + 1,
    }));
  };
  const save = (verdict: ReviewVerdict) =>
    mutation.mutate(
      { type: 'review', verdict, comments: reviewCommentsOf(comment) },
      { onSuccess: () => changeComment(EMPTY_COMMENT) },
    );

  const tabs: { value: DraftTab; label: string }[] = [
    {
      value: 'questions',
      label: `질문 ${countLabel(scenario, questions.length)}`,
    },
    {
      value: 'expressions',
      label: `표현 ${countLabel(expressions, rows.length)}`,
    },
    { value: 'stars', label: `별점 ${countLabel(stars, starList.length)}` },
    { value: 'lineup', label: '라인업 행' },
  ];
  const shared = {
    locked,
    selectedPath: comment.targetPath,
    highlightPath: highlight?.path ?? null,
    onToggle: toggle,
  };

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
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as DraftTab)}
            className="flex min-w-0 flex-col gap-4"
          >
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
            {/* 기본 variant 위에 알약 모양만 입힌다 — line variant는 활성 배경을 투명으로 강제해 흰 글자가 안 보인다 */}
            <TabsList
              aria-label="콘텐츠 종류"
              className="h-auto gap-2 rounded-none bg-transparent p-0"
            >
              {tabs.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className={cn(
                    'h-auto flex-none rounded-full border border-field-border bg-card px-3.5 py-1.5 text-[13px] font-medium text-body hover:bg-hairline',
                    'data-active:border-strong data-active:bg-strong data-active:text-white data-active:shadow-none',
                  )}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* 다시 만드는 동안 이전 내용은 흐리게 두고 마우스·키보드 모두 막는다. 탭 내용은 forceMount — 탭을 오가도 펼침이 남고, 검증기 path가 가리키는 줄이 늘 DOM에 있다 */}
            <div
              inert={generating}
              aria-busy={generating}
              className={cn('flex flex-col gap-4', generating && 'opacity-50')}
            >
              <TabsContent
                value="questions"
                forceMount
                hidden={tab !== 'questions'}
              >
                {scenario.state === 'broken' ? (
                  <BrokenPayload what="질문" />
                ) : (
                  <QuestionColumns questions={questions} {...shared} />
                )}
              </TabsContent>
              <TabsContent
                value="expressions"
                forceMount
                hidden={tab !== 'expressions'}
              >
                {expressions.state === 'broken' ? (
                  <BrokenPayload what="표현" />
                ) : (
                  <ExpressionList
                    rows={rows}
                    duplicates={countDuplicates(report)}
                    {...shared}
                  />
                )}
              </TabsContent>
              <TabsContent value="stars" forceMount hidden={tab !== 'stars'}>
                {stars.state === 'broken' ? (
                  <BrokenPayload what="별점 문구" />
                ) : (
                  <StarList stars={starList} {...shared} />
                )}
              </TabsContent>
              <TabsContent value="lineup" forceMount hidden={tab !== 'lineup'}>
                <LineupRowView reading={lineup} />
              </TabsContent>
            </div>
          </Tabs>

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

/** 탭 숫자 — 깨진 payload는 0이 아니라 `!`로 보인다 */
function countLabel(reading: Reading<unknown>, count: number) {
  return reading.state === 'broken' ? '!' : String(count);
}

function BrokenPayload({ what }: { what: string }) {
  return (
    <section
      role="alert"
      className="rounded-[20px] bg-card px-6 py-10 text-center text-[13px] text-destructive"
    >
      {what} 데이터를 읽지 못했어요 — 형태가 달라요. 통과로 보지 말고 다시
      만들어 주세요
    </section>
  );
}
