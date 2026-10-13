// 개인 편지 발송 내역의 페이지 번호를 해석한다.
import { DirectLetterListPage } from './_ui/DirectLetterListPage';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const value = Number((await searchParams).page ?? 0);
  return (
    <DirectLetterListPage
      page={Number.isSafeInteger(value) && value >= 0 ? value : 0}
    />
  );
}
