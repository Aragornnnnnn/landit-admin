'use client';

// 표현 탭 — 12줄, 레벨 · Q · 타입 라벨 · `표현 = 뜻` · 중복 배지. 줄을 누르면 참조가 들어가고 펼쳐진다(usageSummary · 대표 문장 · 연습 예문)
import { useState } from 'react';

import type { ReviewReference } from '@/features/content/model/review-reference';
import { cn } from '@/shared/lib/cn';

import type { ExpressionRow } from '../_model/draft-content';
import { ReferenceRow } from './ReferenceRow';

interface ExpressionListProps {
  rows: ExpressionRow[];
  duplicates: { surface: number; semantic: number };
  selectedPath: string;
  highlightPath: string | null;
  onToggle: (reference: ReviewReference) => void;
}

export function ExpressionList({
  rows,
  duplicates,
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
            <ReferenceRow
              key={reference.path}
              path={reference.path}
              label={`E ${row.ordinal}`}
              selected={selectedPath === reference.path}
              highlighted={highlightPath === reference.path}
              onToggle={() => {
                onToggle(reference);
                toggleExpanded(reference.path);
              }}
              className="bg-muted/40"
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
                {row.duplicates.map((badge) => (
                  <span
                    key={badge.label}
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold',
                      badge.kind === 'surface'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-primary/10 text-primary',
                    )}
                  >
                    {badge.label}
                  </span>
                ))}
              </span>
              {open && (
                <span className="mt-2 block border-t border-field-border pt-2 text-[12px] leading-[1.6] text-body">
                  <span className="block">{expression.usageSummary}</span>
                  <span className="mt-1 block font-medium text-strong">
                    {expression.representativeSentenceText}
                  </span>
                  <span className="block text-subtle">
                    {expression.representativeSentenceTranslation}
                  </span>
                  {expression.practiceExamples.map((example, index) => (
                    <span key={index} className="mt-1 block">
                      {example.sentenceText}
                      <span className="text-subtle">
                        {' '}
                        — {example.sentenceTranslation}
                      </span>
                    </span>
                  ))}
                </span>
              )}
            </ReferenceRow>
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
