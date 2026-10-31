// Day 초안 상세 (docs/screens/content-batches.md "Day 초안 상세")
import { DraftDetailPage } from './_ui/DraftDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ batchId: string; draftId: string }>;
}) {
  const { batchId, draftId } = await params;
  return (
    <DraftDetailPage batchId={Number(batchId)} draftId={Number(draftId)} />
  );
}
