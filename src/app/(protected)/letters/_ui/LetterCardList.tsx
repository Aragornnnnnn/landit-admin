'use client';

// 모바일 그룹 카드 — 한 행이 두 줄이다. 칩·날짜·› 위에 제목 (Figma 1050:10503).
// 좁은 화면에선 상태·발행일·수정을 다 보여줄 자리가 없어 프레임이 칩과 날짜만 남겼다
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import type { LetterItem } from '@/features/letter/api/letter-list';
import { LETTER_TYPE_LABEL } from '@/features/letter/model/letter-label';
import { formatShortDate } from '@/shared/lib/format-time';
import { StatusChip } from '@/shared/ui/StatusChip';

import { letterEventAt } from '../_model/useLetterGroupQuery';

export function LetterCardList({ items }: { items: LetterItem[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li
          key={item.letterId}
          className="border-t border-hairline first:border-t-0"
        >
          <Link
            href={`/letters/${item.letterId}`}
            className="flex flex-col gap-1.5 px-4 py-3"
          >
            <span className="flex items-center gap-1.5">
              {item.type && (
                <StatusChip>{LETTER_TYPE_LABEL[item.type]}</StatusChip>
              )}
              {item.pinned && <StatusChip>고정</StatusChip>}
              <span className="ml-auto text-[13px] text-subtle">
                {letterDate(item)}
              </span>
              <ChevronRight className="size-4 text-subtle" aria-hidden />
            </span>
            <span className="text-[15px] font-medium text-strong">
              {item.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function letterDate(item: LetterItem): string {
  const iso = letterEventAt(item);
  return iso ? formatShortDate(iso) : '';
}
