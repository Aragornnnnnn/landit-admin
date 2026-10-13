'use client';

// 개인 편지 상세는 조회만 하며 수신자의 읽음 상태를 바꾸지 않는다.
import { useQuery } from '@tanstack/react-query';

import {
  DIRECT_LETTER_KEY,
  fetchDirectLetter,
} from '../api/direct-letter-query';

export function useDirectLetterQuery(id: number) {
  return useQuery({
    queryKey: [...DIRECT_LETTER_KEY, 'detail', id],
    queryFn: () => fetchDirectLetter(id),
    enabled: Number.isSafeInteger(id) && id > 0,
  });
}
