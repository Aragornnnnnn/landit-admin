// 사용자 목록 (docs/screens/users.md)
import { Suspense } from 'react';

import { UsersPage } from './_ui/UsersPage';

export default function Page() {
  // useSearchParams는 Suspense 경계가 필요하다 — 목록 화면 전체가 그 경계다
  return (
    <Suspense>
      <UsersPage />
    </Suspense>
  );
}
