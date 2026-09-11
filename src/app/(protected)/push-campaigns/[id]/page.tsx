// 푸시 캠페인 상세 (docs/screens/push-campaigns.md "상세")
import { CampaignDetailPage } from './_ui/CampaignDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaignDetailPage campaignId={id} />;
}
