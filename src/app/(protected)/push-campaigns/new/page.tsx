// 새 푸시 (docs/screens/push-campaigns.md "새 푸시"). ?from={id}면 그 캠페인의 내용·대상을 채워 시작한다
import { Suspense } from 'react';

import { NewCampaignPage } from './_ui/NewCampaignPage';

export default function Page() {
  // useSearchParams는 Suspense 경계가 필요하다
  return (
    <Suspense>
      <NewCampaignPage />
    </Suspense>
  );
}
