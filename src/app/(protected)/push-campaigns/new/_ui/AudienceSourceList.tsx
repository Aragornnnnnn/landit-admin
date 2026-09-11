'use client';

// 선택된 대상 목록 — 출처마다 한 줄: 이름 · 수 · 요약 · 수정 · ✕. 제외는 빨강으로 구분한다 (Figma 2177:285)
import { X } from 'lucide-react';

import type {
  AudienceDraft,
  AudienceSourceKind,
} from '@/features/push-campaign/model/audience';
import {
  AUDIENCE_SOURCE_LABEL,
  audienceSourceSummary,
} from '@/features/push-campaign/model/audience-source-label';
import { cn } from '@/shared/lib/cn';
import { formatCount } from '@/shared/lib/format-count';

interface AudienceSourceListProps {
  audience: AudienceDraft;
  sources: { kind: AudienceSourceKind; count: number }[];
  onEdit: (kind: AudienceSourceKind) => void;
  onRemove: (kind: AudienceSourceKind) => void;
}

export function AudienceSourceList({
  audience,
  sources,
  onEdit,
  onRemove,
}: AudienceSourceListProps) {
  if (sources.length === 0) return null;
  return (
    <ul className="flex flex-col gap-0.5">
      {sources.map(({ kind, count }) => {
        const exclude = kind === 'excluded';
        return (
          <li
            key={kind}
            className="flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 transition-colors hover:bg-hairline"
          >
            <span className="w-[72px] shrink-0 text-[13px] font-medium text-strong">
              {AUDIENCE_SOURCE_LABEL[kind]}
            </span>
            <span
              className={cn(
                'w-14 shrink-0 text-[13px] font-medium',
                exclude ? 'text-destructive' : 'text-primary',
              )}
            >
              {formatCount(count)}명
            </span>
            <span
              className={cn(
                'min-w-px flex-1 truncate text-[12px] text-subtle',
                kind === 'sql' && 'font-mono',
              )}
            >
              {audienceSourceSummary(audience, kind)}
            </span>
            <button
              type="button"
              onClick={() => onEdit(kind)}
              className="shrink-0 text-[12px] font-medium text-body hover:text-foreground"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => onRemove(kind)}
              aria-label={`${AUDIENCE_SOURCE_LABEL[kind]} 제거`}
              className="shrink-0 rounded-md p-0.5 text-subtle hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
