'use client';

// URL이 필터의 진실이다 — 화면 상태를 따로 들지 않고 쿼리스트링을 읽고 쓴다.
// 검색어만 예외로 입력 중 값을 들고 있다가 300ms 뒤 URL에 반영한다(글자마다 조회하지 않게)
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  changeFeedbackFilter,
  DEFAULT_FEEDBACK_FILTER,
  readFeedbackFilter,
  writeFeedbackFilter,
  type FeedbackFilter,
} from './feedback-filter';

const KEYWORD_DEBOUNCE_MS = 300;

export function useFeedbackFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = readFeedbackFilter(searchParams);

  const [keywordDraft, setKeywordDraft] = useState(filter.keyword);

  const replaceFilter = (next: FeedbackFilter) => {
    const query = writeFeedbackFilter(next);
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const change = (patch: Partial<FeedbackFilter>) =>
    replaceFilter(changeFeedbackFilter(filter, patch));

  // 입력이 멈추면 URL에 반영한다 — 타이머는 다음 입력마다 새로 걸린다
  useEffect(() => {
    if (keywordDraft === filter.keyword) return;
    const timer = setTimeout(
      () => change({ keyword: keywordDraft }),
      KEYWORD_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filter/change는 매 렌더 새로 만들어져 넣으면 타이머가 즉시 재설정된다
  }, [keywordDraft]);

  const reset = () => {
    setKeywordDraft(DEFAULT_FEEDBACK_FILTER.keyword);
    replaceFilter(DEFAULT_FEEDBACK_FILTER);
  };

  return { filter, keywordDraft, setKeywordDraft, change, reset };
}
