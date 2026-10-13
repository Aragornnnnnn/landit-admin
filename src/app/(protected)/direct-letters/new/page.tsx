// 새 개인 편지 또는 이전 수신자를 가져온 편지 편집기를 연다.
import { notFound } from 'next/navigation';

import { NewDirectLetterPage } from './_ui/NewDirectLetterPage';
import { RepeatLetterPage } from './_ui/RepeatLetterPage';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  if (from === undefined) return <NewDirectLetterPage />;
  const id = Number(from);
  if (!Number.isSafeInteger(id) || id <= 0) notFound();
  return <RepeatLetterPage from={id} />;
}
