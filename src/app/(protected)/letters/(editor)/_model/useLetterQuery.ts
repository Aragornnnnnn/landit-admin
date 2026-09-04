'use client';

// 편지 한 통 읽기 — BE에 단건 조회가 없어 목록에서 찾는다 (docs/screens/letters.md "BE 확인 사항").
// 편지가 몇십 건 규모라 지금은 이걸로 충분하고, 단건 API가 생기면 이 파일만 바꾸면 된다
import { useQuery } from '@tanstack/react-query';

import {
  fetchLetterPage,
  type LetterItem,
} from '@/features/letter/api/letter-list';

import { LETTER_FETCH_SIZE } from '../../_model/letter-filter';

export function useLetterQuery(letterId: number | undefined) {
  return useQuery({
    queryKey: ['letters', 'one', letterId] as const,
    queryFn: async (): Promise<LetterItem | null> => {
      const page = await fetchLetterPage(
        new URLSearchParams({ page: '0', size: String(LETTER_FETCH_SIZE) }),
      );
      return (
        (page.items ?? []).find((item) => item.letterId === letterId) ?? null
      );
    },
    enabled: letterId !== undefined,
  });
}
