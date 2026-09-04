'use client';

// 그룹 카드 하나가 쓰는 조회 — 공개 상태별로 따로 부른다.
// 상태를 섞어 한 번에 받으면 그룹마다 몇 건인지 알 수 없고 잘림도 그룹별로 다르게 나타난다
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  fetchLetterPage,
  type LetterItem,
  type LetterStatus,
} from '@/features/letter/api/letter-list';

import { LETTER_FETCH_SIZE, type LetterFilter } from './letter-filter';

export const letterListKey = (status: LetterStatus, type: string | undefined) =>
  ['letters', 'list', status, type ?? 'ALL'] as const;

export function useLetterGroupQuery(
  status: LetterStatus,
  filter: LetterFilter,
  enabled: boolean,
) {
  return useQuery({
    queryKey: letterListKey(status, filter.type),
    queryFn: async () => {
      const params = new URLSearchParams({
        publicationStatus: status,
        page: '0',
        size: String(LETTER_FETCH_SIZE),
      });
      if (filter.type) params.set('type', filter.type);
      const page = await fetchLetterPage(params);
      // 답장은 피드백 화면에서 만들어지는 편지라 기본 목록에서 뺀다 — 타입으로 콕 집었을 때만 보인다
      const items = (page.items ?? []).filter(
        (item) => filter.type === 'REPLY' || item.type !== 'REPLY',
      );
      return { ...page, items };
    },
    enabled,
    placeholderData: keepPreviousData,
  });
}

/** 목록에 그리는 순서 — 고정이 먼저, 그다음 최신순 (프레임의 첫 줄이 고정 공지다) */
export function sortLetters(items: LetterItem[]): LetterItem[] {
  return [...items].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    return letterTime(b) - letterTime(a);
  });
}

/**
 * 그 편지에 마지막으로 일어난 일의 시각 — 발행된 편지는 발행 시각, 임시저장·숨김은 마지막 수정 시각.
 * 숨긴 편지에 발행일을 적으면 "언제 숨겼는지"를 못 읽는다 (프레임의 숨김 행도 수정일을 적는다)
 */
export function letterEventAt(item: LetterItem): string | undefined {
  return item.publicationStatus === 'PUBLISHED'
    ? (item.publishedAt ?? item.updatedAt)
    : (item.updatedAt ?? item.createdAt);
}

function letterTime(item: LetterItem): number {
  const iso = letterEventAt(item);
  const time = iso ? new Date(iso).getTime() : Number.NaN;
  return Number.isNaN(time) ? 0 : time;
}
