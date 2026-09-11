// 푸시 알림 목록 (docs/screens/push-campaigns.md "목록")
import { Suspense } from 'react';

import { PushCampaignsPage } from './_ui/PushCampaignsPage';

export default function Page() {
  // useSearchParams는 Suspense 경계가 필요하다 — 목록 화면 전체가 그 경계다
  return (
    <Suspense>
      <PushCampaignsPage />
    </Suspense>
  );
}
