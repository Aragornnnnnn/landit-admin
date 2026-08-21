'use client';

// 그룹 카드 하나 — 제목·건수 + 그 안의 목록. 로딩·오류·빈 상태를 여기서 가른다.
// 폭에 따라 갈리는 건 두 가지다 — 표/카드 목록, 그리고 제목이 카드 안(데스크톱)이냐 밖(모바일)이냐 (Figma 1050:10110 · 10503)
import { useIsMobile } from '@/shared/lib/use-mobile';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import type { LetterGroup } from '../_model/letter-filter';
import { letterGroupCountLabel } from '../_model/letter-label';
import {
  sortLetters,
  type LetterItem,
  type useLetterGroupQuery,
} from '../_model/useLetterGroupQuery';
import { LetterCardList } from './LetterCardList';
import { LetterTable } from './LetterTable';

interface LetterGroupCardProps {
  group: LetterGroup;
  query: ReturnType<typeof useLetterGroupQuery>;
}

export function LetterGroupCard({ group, query }: LetterGroupCardProps) {
  const isMobile = useIsMobile();
  const items = sortLetters(query.data?.items ?? []);

  const header = (
    <header className="flex items-baseline gap-2">
      <h2 className="text-[15px] font-bold text-strong md:text-[16px]">
        {group.title}
      </h2>
      {query.isSuccess && (
        <span className="text-[13px] text-subtle">
          {/* 데스크톱 표는 고정 여부를 행에서 보여주므로 제목 옆엔 건수만 (프레임) */}
          {isMobile
            ? letterGroupCountLabel(items.length, countPinned(items))
            : items.length}
        </span>
      )}
    </header>
  );

  const body = (
    <Body group={group} query={query} items={items} isMobile={isMobile} />
  );

  if (isMobile) {
    return (
      <section className="flex w-full flex-col gap-2">
        <div className="px-1">{header}</div>
        <div className="overflow-hidden rounded-[18px] bg-card">{body}</div>
      </section>
    );
  }

  return (
    <section className="w-full rounded-[20px] bg-card pt-5 pb-2">
      <div className="px-5">{header}</div>
      {body}
    </section>
  );
}

function Body({
  group,
  query,
  items,
  isMobile,
}: LetterGroupCardProps & { items: LetterItem[]; isMobile: boolean }) {
  if (query.isPending) return <ListSkeleton rows={2} className="px-5 py-3" />;
  if (query.isError)
    return (
      <InlineError
        className="mx-5 my-4"
        message="편지를 불러오지 못했어요"
        onRetry={() => query.refetch()}
      />
    );
  if (items.length === 0)
    return <EmptyState className="py-10" title={group.empty} />;

  return isMobile ? (
    <LetterCardList items={items} />
  ) : (
    <LetterTable items={items} />
  );
}

const countPinned = (items: LetterItem[]) =>
  items.filter((item) => item.pinned).length;
