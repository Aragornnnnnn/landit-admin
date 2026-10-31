'use client';

// 별점 탭 — `★ {starRating}` · 문구. 참조 [S n], 경로 starMessages[n-1]
import type { StarMessage } from '@/features/content/api/draft-payload';
import {
  referenceOf,
  type ReviewReference,
} from '@/features/content/model/review-reference';

import { ReferenceRow } from './ReferenceRow';

interface StarListProps {
  stars: StarMessage[];
  selectedPath: string;
  highlightPath: string | null;
  onToggle: (reference: ReviewReference) => void;
}

export function StarList({
  stars,
  selectedPath,
  highlightPath,
  onToggle,
}: StarListProps) {
  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-card px-6 py-5">
      <h3 className="text-[15px] font-bold text-strong">
        별점 문구 {stars.length}개
      </h3>
      <div className="flex flex-col gap-1">
        {stars.map((star, index) => {
          const reference = referenceOf({ kind: 'star', index });
          return (
            <ReferenceRow
              key={reference.path}
              path={reference.path}
              label={`S ${index + 1}`}
              selected={selectedPath === reference.path}
              highlighted={highlightPath === reference.path}
              onToggle={() => onToggle(reference)}
            >
              <span className="flex items-baseline gap-3">
                <span className="w-[60px] shrink-0 text-[14px] font-bold text-primary">
                  ★ {star.starRating}
                </span>
                <span className="text-[14px] leading-[1.5] text-strong">
                  {star.message}
                </span>
              </span>
            </ReferenceRow>
          );
        })}
        {stars.length === 0 && (
          <p className="py-4 text-center text-[13px] text-subtle">
            아직 별점 문구가 없어요
          </p>
        )}
      </div>
    </section>
  );
}
