// 검색 조건을 URL에서 복원하는 시나리오 조회 화면을 연다.
import { Suspense } from 'react';

import { ScenarioCatalogPage } from './_ui/ScenarioCatalogPage';

export default function Page() {
  return (
    <Suspense fallback={<p>시나리오를 불러오는 중이에요.</p>}>
      <ScenarioCatalogPage />
    </Suspense>
  );
}
