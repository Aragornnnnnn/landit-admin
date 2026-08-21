// 공지·업데이트 목록 (docs/screens/letters.md)
import { Suspense } from 'react';

import { LettersPage } from './_ui/LettersPage';

export default function Page() {
  // useSearchParams는 Suspense 경계가 필요하다 — 목록 화면 전체가 그 경계다
  return (
    <Suspense>
      <LettersPage />
    </Suspense>
  );
}
