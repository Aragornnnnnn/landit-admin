'use client';

// AI 검수 카드 — 결함 `{type}` 칩 · path(클릭 이동) · reason · ruleCode. 처음 4건, 나머지는 더 보기. 결함마다 "규칙으로 승격"
import { useState } from 'react';

import type { ContentRuleRequest } from '@/features/content/api/content-rule';
import type {
  Reading,
  ReviewDefect,
} from '@/features/content/api/draft-payload';
import { ruleScopeForPath } from '@/features/content/model/review-reference';

import { Card, PathButton } from './ValidationCard';

const FIRST_SHOWN = 4;

interface AiReviewCardProps {
  review: Reading<ReviewDefect[]>;
  onLocate: (path: string) => void;
  onPromote: (rule: ContentRuleRequest) => void;
}

export function AiReviewCard({
  review,
  onLocate,
  onPromote,
}: AiReviewCardProps) {
  const [showAll, setShowAll] = useState(false);
  if (review.state !== 'ok') {
    return (
      <Card title="AI 검수">
        <p className="text-[13px] text-subtle">
          {review.state === 'missing'
            ? '아직 검수 전이에요'
            : '검수 결과를 읽지 못했어요'}
        </p>
      </Card>
    );
  }
  const defects = review.value;
  const visible = showAll ? defects : defects.slice(0, FIRST_SHOWN);
  return (
    <Card title={`AI 검수 · 결함 ${defects.length}건`}>
      {defects.length === 0 && (
        <p className="text-[13px] text-subtle">결함 없음</p>
      )}
      <ul className="flex flex-col gap-2">
        {visible.map((defect, index) => (
          <li
            key={index}
            className="flex flex-col gap-1 rounded-xl bg-muted/60 px-3 py-2.5 text-[12px] leading-[1.5]"
          >
            <span className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-px text-[11px] font-bold text-primary">
                {defect.type}
              </span>
              {defect.path && (
                <PathButton path={defect.path} onLocate={onLocate} />
              )}
              {defect.ruleCode && (
                <span className="text-[11px] text-subtle">
                  {defect.ruleCode}
                </span>
              )}
              <button
                type="button"
                onClick={() =>
                  onPromote({
                    scope: ruleScopeForPath(defect.path),
                    ruleText: defect.reason,
                  })
                }
                className="ml-auto text-[11px] font-medium text-primary underline-offset-2 hover:underline"
              >
                규칙으로 승격
              </button>
            </span>
            <span className="text-body">{defect.reason}</span>
          </li>
        ))}
      </ul>
      {!showAll && defects.length > FIRST_SHOWN && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="self-start text-[12px] text-subtle hover:text-primary"
        >
          … {defects.length - FIRST_SHOWN}건 더 보기
        </button>
      )}
    </Card>
  );
}
