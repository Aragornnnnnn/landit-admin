// Day 초안 상세 (docs/screens/content-batches.md "Day 초안 상세")
import { DraftDetailPage } from './_ui/DraftDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ batchId: string; draftId: string }>;
}) {
  const { batchId, draftId } = await params;
  return (
    // Day가 바뀌면 새로 마운트한다 — 코멘트 초안·탭·하이라이트가 다른 Day로 넘어가지 않게
    <DraftDetailPage
      key={draftId}
      batchId={Number(batchId)}
      draftId={Number(draftId)}
    />
  );
}
