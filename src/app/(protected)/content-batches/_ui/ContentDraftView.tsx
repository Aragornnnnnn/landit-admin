'use client';

// 저장된 질문·표현·별점과 검수 근거를 난이도별로 표시한다.
import { useState } from 'react';
import { BookOpen, ClipboardCheck, MessageSquare } from 'lucide-react';

import type { Schema } from '@/shared/api/schema-patch';
import { StatusChip } from '@/shared/ui/StatusChip';

import {
  inspectContent,
  LEVEL_LABELS,
  LEVELS,
  readObject,
  readReview,
  readRows,
  readText,
  STATUS_LABELS,
  type ContentRow,
} from '../_model/content-view';

export function ContentDraftView({
  draft,
  note,
}: {
  draft: Schema<'AdminContentDraftDetail'>;
  note: string | null | undefined;
}) {
  const [level, setLevel] = useState(0);
  const [tab, setTab] = useState<'questions' | 'expressions' | 'stars'>(
    'questions',
  );
  const content = inspectContent(
    draft.scenarioPayload,
    draft.expressionPayload,
    draft.starMessagePayload,
  );
  const review = readReview(draft.reviewResult);
  const validation = readObject(draft.validationResult);
  const checks = readRows(validation.findings);
  const questions = content.questions.filter(
    (q) => q.questionLevelGroup === LEVELS[level],
  );
  const expressions = content.expressions.filter(
    (e) => e.levelGroup === LEVELS[level],
  );
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
      <header className="space-y-3 border-b border-border px-6 py-5">
        <div className="flex items-center gap-2 text-xs text-subtle">
          <span>Day {draft.plannedDay}</span>
          <span>·</span>
          <span>{readText(content.core.characterId)}</span>
          <StatusChip dot="progress">
            {STATUS_LABELS[draft.status] ?? draft.status}
          </StatusChip>
        </div>
        <h2 className="text-[22px] leading-snug font-bold">
          {readText(content.language.title)}
        </h2>
        {note && <p className="text-xs leading-5 text-subtle">{note}</p>}
        <div className="flex flex-wrap gap-5 text-sm text-body">
          <span>
            질문 <b>{content.questions.length}개</b>
          </span>
          <span>
            학습 표현 <b>{content.expressions.length}개</b>
          </span>
          <span>
            별점 문구 <b>{content.stars.length}개</b>
          </span>
        </div>
      </header>
      <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_255px] 2xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0 p-6">
          <div className="mb-5 space-y-3 text-sm leading-6">
            <p className="font-bold">상황과 목표</p>
            <p className="text-body">{readText(content.language.briefing)}</p>
            <p className="border-l-2 border-primary pl-3 text-body">
              {readText(content.language.conversationGoal)}
            </p>
          </div>
          <div
            role="tablist"
            aria-label="콘텐츠 종류"
            className="mb-4 flex gap-5 border-b border-border"
          >
            {(['questions', 'expressions', 'stars'] as const).map(
              (item, index) => (
                <button
                  role="tab"
                  aria-selected={tab === item}
                  key={item}
                  onClick={() => setTab(item)}
                  className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold ${tab === item ? 'border-primary text-primary' : 'border-transparent text-subtle'}`}
                >
                  {index === 0 ? (
                    <MessageSquare className="size-4" />
                  ) : (
                    <BookOpen className="size-4" />
                  )}
                  {['대화 질문', '학습 표현', '별점 문구'][index]}
                </button>
              ),
            )}
          </div>
          <div aria-label="난이도 선택" className="mb-5 flex flex-wrap gap-2">
            {LEVEL_LABELS.map((label, i) => (
              <button
                key={label}
                aria-pressed={level === i}
                onClick={() => setLevel(i)}
                className={`rounded-full px-4 py-2 text-xs font-bold ${level === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-body'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="space-y-5">
            {tab === 'questions'
              ? questions.map((q, i) => <Question key={i} row={q} index={i} />)
              : (tab === 'stars' ? content.stars : expressions).map(
                  (row, i) => (
                    <article
                      key={i}
                      className="border-b border-border pb-4 last:border-0"
                    >
                      <h3 className="text-base font-bold">
                        {tab === 'stars'
                          ? `★ ${readText(row.starRating)}`
                          : readText(row.targetExpressionText)}{' '}
                        <span className="ml-2 text-sm font-normal text-subtle">
                          {readText(row.baseExpressionMeaningText)}
                        </span>
                      </h3>
                      <p className="mt-2 text-sm leading-6">
                        {tab === 'stars'
                          ? readText(row.message)
                          : readText(row.representativeSentenceText)}
                      </p>
                      <p className="text-xs leading-6 text-subtle">
                        {readText(row.representativeSentenceTranslation)}
                      </p>
                    </article>
                  ),
                )}
          </div>
        </div>
        <aside className="space-y-6 border-t border-border bg-muted/40 p-5 xl:border-t-0 xl:border-l">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
              <ClipboardCheck className="size-4" />
              검수 확인
            </h3>
            <p className="mb-3 text-xs font-bold text-subtle">콘텐츠 구성</p>
            <dl className="space-y-2 text-xs text-body">
              {LEVEL_LABELS.map((label, i) => (
                <div key={label} className="flex justify-between">
                  <dt>{label}</dt>
                  <dd>
                    질문{' '}
                    {
                      content.questions.filter(
                        (q) => q.questionLevelGroup === LEVELS[i],
                      ).length
                    }{' '}
                    · 표현{' '}
                    {
                      content.expressions.filter(
                        (e) => e.levelGroup === LEVELS[i],
                      ).length
                    }
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold">자동 규칙 검사</h4>
            {checks.length ? (
              checks.map((check, i) => (
                <p className="text-xs leading-6" key={i}>
                  {readText(check.ruleId)} · {readText(check.level)}
                </p>
              ))
            ) : (
              <p className="text-xs leading-6 text-subtle">
                저장된 검사 기록이 없어요.
              </p>
            )}
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold">독립 AI 검수</h4>
            <p className="text-xs leading-6 text-subtle">
              {review.recorded
                ? review.items.length
                  ? `지적 ${review.items.length}건`
                  : '저장된 지적 사항 없음'
                : '저장된 검수 기록이 없어요.'}
            </p>
            {review.items.map((row, i) => (
              <p className="mt-2 text-xs leading-6" key={i}>
                {readText(row.comment) ||
                  readText(row.reason) ||
                  readText(row.message)}
              </p>
            ))}
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold">담당자 검수 의견</h4>
            {draft.comments.length ? (
              draft.comments.map((comment) => (
                <p key={comment.commentId} className="text-xs leading-6">
                  {comment.comment}
                </p>
              ))
            ) : (
              <p className="text-xs leading-6 text-subtle">
                아직 등록된 의견이 없어요.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function Question({ row, index }: { row: ContentRow; index: number }) {
  return (
    <article className="border-b border-border pb-4 last:border-0">
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-xs font-bold text-primary">질문 {index + 1}</span>
        <span className="text-[11px] text-subtle">
          {readText(row.responseDemand)}
        </span>
      </div>
      <p className="text-[15px] leading-6 font-semibold">
        {readText(row.questionText)}
      </p>
      <p className="mt-1 text-xs leading-5 text-subtle">
        {readText(row.questionTranslation)}
      </p>
      <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs leading-5 whitespace-pre-line">
        <span className="mb-1 block font-bold">필수 응답 요소</span>
        {readText(row.requiredResponseElement)}
      </p>
    </article>
  );
}
