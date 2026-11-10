// 제작 배치 선택을 URL로 관리하는 관리자 화면을 연다.
import { Suspense } from 'react';

import { ContentBatchesPage } from './_ui/ContentBatchesPage';

export default function Page() {
  return (
    <Suspense fallback={<p>제작 목록을 불러오는 중이에요.</p>}>
      <ContentBatchesPage />
    </Suspense>
  );
}
