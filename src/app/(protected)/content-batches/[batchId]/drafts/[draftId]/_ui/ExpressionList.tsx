'use client';

// 표현 탭 — 12줄, 레벨 · Q · 타입 라벨 · `표현 = 뜻` · 중복 배지. 줄을 누르면 참조, 오른쪽 ▸를 누르면 펼쳐진다(usageSummary · 대표 문장 · 연습 예문).
// 펼침을 줄 클릭과 떼어 둔다 — 예문만 보려다 코멘트에 참조가 들어가지 않게
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import type { ReviewReference } from '@/features/content/model/review-reference';

import type { ExpressionRow } from '../_model/draft-content';
import { ReferenceRow } from './ReferenceRow';

interface ExpressionListProps {
  rows: ExpressionRow[];
  duplicates: { surface: number; semantic: number };
  locked: boolean;
  selectedPath: string;
  highlightPath: string | null;
  onToggle: (reference: ReviewReference) => void;
}

export function ExpressionList({
  rows,
  duplicates,
  locked,
  selectedPath,
  highlightPath,
  onToggle,
}: ExpressionListProps) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const toggleExpanded = (path: string) =>
    setExpanded((current) =>
      current.includes(path)
        ? current.filter((item) => item !== path)
        : [...current, path],
    );

  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-card px-6 py-5">
      <h3 className="text-[15px] font-bold text-strong">
        표현 {rows.length}개 (레벨별 4개) · 표면 중복 {duplicates.surface} · 뜻
        중복 {duplicates.semantic}
      </h3>
      <div className="flex flex-col gap-1">
        {rows.map((row) => {
          const { expression, reference } = row;
          const open = expanded.includes(reference.path);
          return (
            <div key={reference.path} className="rounded-lg bg-muted/40">
              <div className="flex items-stretch">
                <ReferenceRow
                  path={reference.path}
                  label={`E ${row.ordinal}`}
                  selected={selectedPath === reference.path}
                  highlighted={highlightPath === reference.path}
                  disabled={locked}
                  onToggle={() => onToggle(reference)}
                  className="min-w-0 flex-1"
                >
                  <span className="flex flex-wrap items-center gap-3">
                    <span className="w-[180px] shrink-0 text-[12px] text-subtle">
                      {row.level} · Q{expression.answerToQuestionDisplayOrder} ·{' '}
                      {expression.expressionType}
                    </span>
                    <span className="min-w-0 flex-1 text-[14px] font-medium text-strong">
                      {expression.targetExpressionText} ={' '}
                      {expression.baseExpressionMeaningText}
                    </span>
                    {row.duplicates.map((badge, index) => (
                      <span
                        key={index}
                        className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-bold text-destructive"
                      >
                        {badge.label}
                      </span>
                    ))}
                  </span>
                </ReferenceRow>
                <button
                  type="button"
                  aria-label={`E ${row.ordinal} ${open ? '접기' : '펼치기'}`}
                  aria-expanded={open}
                  onClick={() => toggleExpanded(reference.path)}
                  className="shrink-0 px-2 text-subtle hover:text-strong"
                >
                  {open ? (
                    <ChevronDown className="size-4" aria-hidden />
                  ) : (
                    <ChevronRight className="size-4" aria-hidden />
                  )}
                </button>
              </div>
              {open && (
                <div className="border-t border-field-border px-3 py-2 text-[12px] leading-[1.6] text-body">
                  <p>{expression.usageSummary}</p>
                  <p className="mt-1 font-medium text-strong">
                    {expression.representativeSentenceText}
                  </p>
                  <p className="text-subtle">
                    {expression.representativeSentenceTranslation}
                  </p>
                  {expression.practiceExamples.map((example, index) => (
                    <p key={index} className="mt-1">
                      {example.sentenceText}
                      <span className="text-subtle">
                        {' '}
                        — {example.sentenceTranslation}
                      </span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {rows.length === 0 && (
          <p className="py-4 text-center text-[13px] text-subtle">
            아직 표현이 없어요
          </p>
        )}
      </div>
    </section>
  );
}
