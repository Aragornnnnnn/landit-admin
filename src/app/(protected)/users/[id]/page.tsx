// 사용자 상세 (docs/screens/users.md "상세")
import { UserDetailPage } from '../_ui/UserDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserDetailPage userProfileId={Number(id)} />;
}
