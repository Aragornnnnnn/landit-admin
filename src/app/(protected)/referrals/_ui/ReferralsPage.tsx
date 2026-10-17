'use client';

// 현재 정책을 불러오고 편집·운영 내역 화면을 구성한다.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import { referralsApi } from '../_api/referrals';
import { PolicyEditor } from './PolicyEditor';
import { ReferralRecords } from './ReferralRecords';

export function ReferralsPage() {
  const [generation, setGeneration] = useState(0);
  const policy = useQuery({
    queryKey: ['referrals', 'policy'],
    queryFn: referralsApi.policy,
    refetchOnWindowFocus: false,
  });
  if (policy.isPending) return <ListSkeleton rows={6} />;
  if (!policy.data)
    return (
      <InlineError
        message="레퍼럴 정책을 불러오지 못했어요."
        onRetry={() => policy.refetch()}
      />
    );
  return (
    <div className="pb-12">
      {policy.isError && (
        <InlineError
          message="최신 정책을 불러오지 못했어요. 작성 중인 초안은 유지돼요."
          onRetry={() => policy.refetch()}
        />
      )}
      <PolicyEditor
        key={generation}
        state={policy.data}
        reload={() => {
          void policy.refetch().then((result) => {
            if (result.isSuccess) setGeneration((n) => n + 1);
          });
        }}
      />
      <ReferralRecords />
    </div>
  );
}
