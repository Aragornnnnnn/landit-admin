'use client';

// 데스크톱 그룹 표 — 흰 카드 안, 한 줄 걸러 옅은 배경 (Figma 1050:10110).
// 타입·상태는 배경 없는 텍스트다. 행 액션(⋯)은 상태 전환 PR에서 붙는다
import Link from 'next/link';

import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format-time';

import {
  LETTER_STATUS_DOT,
  LETTER_STATUS_LABEL,
  LETTER_TYPE_LABEL,
} from '../_model/letter-label';
import type { LetterItem } from '../_model/useLetterGroupQuery';

// Figma 셀 너비 — 타입 90 / 제목 flex / 상태 100 / 발행일 120 / 수정 120
const CELL = {
  type: 'w-[90px] shrink-0',
  title: 'flex-1 min-w-px',
  status: 'w-[100px] shrink-0',
  publishedAt: 'w-[120px] shrink-0',
  updatedAt: 'w-[120px] shrink-0',
};

const DOT_COLOR = { progress: 'bg-primary', done: 'bg-success' } as const;

export function LetterTable({ items }: { items: LetterItem[] }) {
  return (
    <div className="w-full px-2 pb-2">
      <div
        role="row"
        className="flex w-full items-center gap-4 px-5 pt-2 pb-2 text-xs font-medium text-subtle"
      >
        <span className={CELL.type}>타입</span>
        <span className={CELL.title}>제목</span>
        <span className={CELL.status}>상태</span>
        <span className={CELL.publishedAt}>발행일</span>
        <span className={CELL.updatedAt}>수정</span>
      </div>

      <div className="flex flex-col gap-0.5">
        {items.map((item, index) => {
          const dot = item.publicationStatus
            ? LETTER_STATUS_DOT[item.publicationStatus]
            : undefined;
          return (
            <Link
              key={item.letterId}
              href={`/letters/${item.letterId}`}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl px-5 py-3 transition-colors hover:bg-muted',
                index % 2 === 0 && 'bg-stripe',
              )}
            >
              <span
                className={cn(
                  CELL.type,
                  'text-[13px] font-medium text-chip-foreground',
                )}
              >
                {item.type ? LETTER_TYPE_LABEL[item.type] : ''}
              </span>
              <span
                className={cn(
                  CELL.title,
                  'flex items-center gap-2 truncate text-[13px] text-strong',
                )}
              >
                {item.pinned && (
                  <span className="text-[12px] font-bold text-subtle">
                    고정
                  </span>
                )}
                <span className="truncate">{item.title}</span>
              </span>
              <span className={cn(CELL.status, 'flex items-center gap-[5px]')}>
                {item.publicationStatus && (
                  <>
                    {dot && (
                      <span
                        aria-hidden
                        className={cn('size-1.5 rounded-full', DOT_COLOR[dot])}
                      />
                    )}
                    <span className="text-[13px] text-body">
                      {LETTER_STATUS_LABEL[item.publicationStatus]}
                    </span>
                  </>
                )}
              </span>
              <span className={cn(CELL.publishedAt, 'text-[13px] text-subtle')}>
                {item.publishedAt ? formatDateTime(item.publishedAt) : '–'}
              </span>
              <span className={cn(CELL.updatedAt, 'text-[13px] text-subtle')}>
                {item.updatedAt ? formatDateTime(item.updatedAt) : '–'}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
