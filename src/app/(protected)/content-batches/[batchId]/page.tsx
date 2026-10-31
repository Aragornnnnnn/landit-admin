// 배치 상세 — 라인업 확인(LINEUP_READY 이전) 또는 Day 목록 (docs/screens/content-batches.md "배치 상세")
import { Suspense } from 'react';

import { BatchDetailPage } from './_ui/BatchDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  return (
    <Suspense>
      <BatchDetailPage batchId={Number(batchId)} />
    </Suspense>
  );
}
