'use client';

// 질문 탭 — LEVEL_1 / LEVEL_2_TO_3 / LEVEL_4_TO_5 세 열. 열 위 속마음 타일(Q1), 줄 = `L1 Q1` · 영어 · 해석 · 필수 응답 요소 (Figma 4131:766)
import {
  CONTENT_LEVELS,
  questionsOfLevel,
  type DraftQuestion,
} from '@/features/content/api/draft-payload';
import { LEVEL_SHORT } from '@/features/content/model/content-label';
import {
  referenceOf,
  type ReviewReference,
} from '@/features/content/model/review-reference';

import { ReferenceRow } from './ReferenceRow';

interface QuestionColumnsProps {
  questions: DraftQuestion[];
  locked: boolean;
  selectedPath: string;
  highlightPath: string | null;
  onToggle: (reference: ReviewReference) => void;
}

export function QuestionColumns({
  questions,
  locked,
  selectedPath,
  highlightPath,
  onToggle,
}: QuestionColumnsProps) {
  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-card px-6 py-5">
      <h3 className="flex flex-wrap items-baseline gap-2 text-[15px] font-bold text-strong">
        질문 {questions.length}개 · 레벨 3열
        <span className="text-[12px] font-normal text-subtle">
          질문 줄을 클릭하면 코멘트 칸에 [L1 Q2]처럼 참조가 들어가요
        </span>
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {CONTENT_LEVELS.map((level) => {
          const column = questionsOfLevel(questions, level);
          const thought = column[0];
          return (
            <div
              key={level}
              className="flex flex-col gap-2 rounded-xl border border-field-border p-3"
            >
              <p className="text-[12px] font-bold text-success">{level}</p>
              {thought?.innerThought && (
                <p className="rounded-lg bg-muted px-3 py-2 text-[12px] leading-[1.5] text-body">
                  속마음({thought.innerThoughtType}): {thought.innerThought}
                </p>
              )}
              {column.map((question, index) => {
                const reference = referenceOf({
                  kind: 'question',
                  level,
                  index,
                });
                return (
                  <ReferenceRow
                    key={reference.path}
                    path={reference.path}
                    label={`${LEVEL_SHORT[level]} Q${index + 1}`}
                    disabled={locked}
                    selected={selectedPath === reference.path}
                    highlighted={highlightPath === reference.path}
                    onToggle={() => onToggle(reference)}
                  >
                    <span className="block text-[12px] text-subtle">
                      {LEVEL_SHORT[level]} Q{index + 1}
                    </span>
                    <span className="block text-[14px] leading-[1.4] font-bold text-strong">
                      {question.questionText}
                    </span>
                    <span className="block text-[12px] leading-[1.5] text-body">
                      {question.questionTranslation}
                    </span>
                    {question.requiredResponseElement && (
                      <span className="block text-[11px] leading-[1.5] text-subtle">
                        {question.requiredResponseElement}
                      </span>
                    )}
                  </ReferenceRow>
                );
              })}
              {column.length === 0 && (
                <p className="text-[12px] text-subtle">—</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
