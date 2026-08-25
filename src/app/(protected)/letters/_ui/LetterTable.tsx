'use client';

// 데스크톱 그룹 표 — 흰 카드 안, 행 구분은 hover만 (Figma 1050:10110에서 운영자 결정으로 변경).
// 타입·상태는 배경 없는 텍스트다. 행 오른쪽 ⋯로 상태를 바꾼다
import Link from 'next/link';

import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format-time';

import type { LetterAction } from '../_model/letter-actions';
import {
  LETTER_STATUS_DOT,
  LETTER_STATUS_LABEL,
  LETTER_TYPE_LABEL,
} from '../_model/letter-label';
import type { LetterItem } from '../_model/useLetterGroupQuery';
import { LetterRowMenu } from './LetterRowMenu';

// Figma 셀 너비 — 타입 90 / 제목 flex / 상태 100 / 발행일 120 / 수정 120
const CELL = {
  type: 'w-[90px] shrink-0',
  title: 'flex-1 min-w-px',
  status: 'w-[100px] shrink-0',
  publishedAt: 'w-[120px] shrink-0',
  updatedAt: 'w-[120px] shrink-0',
  menu: 'w-8 shrink-0',
};

const DOT_COLOR = { progress: 'bg-primary', done: 'bg-success' } as const;

interface LetterTableProps {
  items: LetterItem[];
  onAction: (letterId: number, action: LetterAction) => void;
}

export function LetterTable({ items, onAction }: LetterTableProps) {
  return (
    <div className="w-full overflow-x-auto px-1 pb-1">
      <div className="min-w-[780px]">
        <div
          role="row"
          className="flex w-full items-center gap-4 px-5 pt-2 pb-2 text-xs font-medium text-subtle"
        >
          <span className={CELL.type}>타입</span>
          <span className={CELL.title}>제목</span>
          <span className={CELL.status}>상태</span>
          <span className={CELL.publishedAt}>발행일</span>
          <span className={CELL.updatedAt}>수정</span>
          <span className={CELL.menu} />
        </div>

        <div className="flex flex-col gap-0.5">
          {items.map((item) => {
            const dot = item.publicationStatus
              ? LETTER_STATUS_DOT[item.publicationStatus]
              : undefined;
            return (
              // 링크 안에 버튼을 넣을 수 없어 행 전체가 아니라 내용 부분만 링크다
              <div
                key={item.letterId}
                className="flex w-full items-center gap-4 rounded-lg pr-3 pl-5 transition-colors hover:bg-hairline"
              >
                <Link
                  href={`/letters/${item.letterId}`}
                  className="flex flex-1 items-center gap-4 py-3"
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
                  <span
                    className={cn(CELL.status, 'flex items-center gap-[5px]')}
                  >
                    {item.publicationStatus && (
                      <>
                        {dot && (
                          <span
                            aria-hidden
                            className={cn(
                              'size-1.5 rounded-full',
                              DOT_COLOR[dot],
                            )}
                          />
                        )}
                        <span className="text-[13px] text-body">
                          {LETTER_STATUS_LABEL[item.publicationStatus]}
                        </span>
                      </>
                    )}
                  </span>
                  <span
                    className={cn(CELL.publishedAt, 'text-[13px] text-subtle')}
                  >
                    {item.publishedAt ? formatDateTime(item.publishedAt) : '–'}
                  </span>
                  <span
                    className={cn(CELL.updatedAt, 'text-[13px] text-subtle')}
                  >
                    {item.updatedAt ? formatDateTime(item.updatedAt) : '–'}
                  </span>
                </Link>
                <LetterRowMenu
                  item={item}
                  className={CELL.menu}
                  onSelect={(action) =>
                    item.letterId && onAction(item.letterId, action)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
