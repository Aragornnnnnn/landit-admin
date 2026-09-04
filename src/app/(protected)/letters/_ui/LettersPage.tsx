'use client';

// 공지·업데이트 목록 화면 조립 — 요약 줄 · 탭/타입 필터 · 그룹 카드들 (docs/screens/letters.md)
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/shared/ui/shadcn/button';

import {
  LETTER_GROUPS,
  readLetterFilter,
  visibleLetterGroups,
  writeLetterFilter,
  type LetterFilter,
} from '../_model/letter-filter';
import { letterSummaryLabel } from '../_model/letter-label';
import { useLetterActions } from '../_model/useLetterActions';
import { useLetterGroupQuery } from '../_model/useLetterGroupQuery';
import { LetterActionDialog } from './LetterActionDialog';
import { LetterFilters } from './LetterFilters';
import { LetterGroupCard } from './LetterGroupCard';

export function LettersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = readLetterFilter(searchParams);
  const visible = visibleLetterGroups(filter.tab);

  // 훅은 조건부로 부를 수 없으므로 세 그룹을 늘 선언하고, 지금 보이지 않는 그룹만 조회를 끈다
  const queries = {
    PUBLISHED: useLetterGroupQuery(
      'PUBLISHED',
      filter,
      isVisible(filter, 'PUBLISHED'),
    ),
    DRAFT: useLetterGroupQuery('DRAFT', filter, isVisible(filter, 'DRAFT')),
    UNPUBLISHED: useLetterGroupQuery(
      'UNPUBLISHED',
      filter,
      isVisible(filter, 'UNPUBLISHED'),
    ),
  };

  const summary = letterSummaryLabel(
    visible.map((group) => ({
      status: group.status,
      count: queries[group.status].data?.items?.length,
    })),
  );

  const actions = useLetterActions();

  const change = (patch: Partial<LetterFilter>) => {
    const query = writeLetterFilter({ ...filter, ...patch });
    router.replace(query ? `?${query}` : '/letters', { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      {/* 모바일은 상단바에 제목만 있어 요약과 새 편지를 콘텐츠 첫 줄에 둔다 (프레임) */}
      <div className="flex items-center gap-3 md:hidden">
        <p className="text-[13px] text-subtle">{summary}</p>
        <Button asChild className="ml-auto h-9 px-3.5 text-[14px]">
          <Link href="/letters/new">새 편지</Link>
        </Button>
      </div>

      <LetterFilters filter={filter} onChange={change} />

      {visible.map((group) => (
        <LetterGroupCard
          key={group.status}
          group={group}
          query={queries[group.status]}
          onAction={actions.request}
        />
      ))}

      <LetterActionDialog
        action={actions.asked}
        pending={actions.pending}
        onCancel={actions.cancel}
        onConfirm={actions.confirm}
      />
    </div>
  );
}

const isVisible = (
  filter: LetterFilter,
  status: (typeof LETTER_GROUPS)[number]['status'],
) => filter.tab === 'ALL' || filter.tab === status;
