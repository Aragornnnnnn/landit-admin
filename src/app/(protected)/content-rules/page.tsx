// 제작 규칙 — 목록 · 등록 · 은퇴 (docs/screens/content-batches.md "제작 규칙")
import { Suspense } from 'react';

import { ContentRulesPage } from './_ui/ContentRulesPage';

export default function Page() {
  // useSearchParams는 Suspense 경계가 필요하다 — 화면 전체가 그 경계다
  return (
    <Suspense>
      <ContentRulesPage />
    </Suspense>
  );
}
