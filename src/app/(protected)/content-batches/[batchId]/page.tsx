// 배치 상세 — 라인업 확인(LAN-811)·Day 목록(LAN-812)이 들어올 자리. 그때까지는 1차 화면을 이 배치로 고정해 보여 준다
import { Suspense } from 'react';

import { ContentBatchesPage } from '../_ui/ContentBatchesPage';

export default async function Page({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  return (
    <Suspense>
      <ContentBatchesPage batchId={Number(batchId)} />
    </Suspense>
  );
}
