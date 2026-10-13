// 개인 편지의 유효한 ID를 상세 화면에 전달한다.
import { notFound } from 'next/navigation';

import { DirectLetterDetailPage } from '../_ui/DirectLetterDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id <= 0) notFound();
  return <DirectLetterDetailPage id={id} />;
}
