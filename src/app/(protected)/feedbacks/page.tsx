'use client';

// /feedbacks — URL 파라미터 해석과 조립만. 필터 규칙은 _model, 화면은 _ui에 있다
import { Suspense } from 'react';

import { FeedbackListPage } from './_ui/FeedbackListPage';

export default function FeedbacksPage() {
  // useSearchParams는 Suspense 경계를 요구한다
  return (
    <Suspense fallback={null}>
      <FeedbackListPage />
    </Suspense>
  );
}
