// 편지 편집 (docs/screens/letters.md "새 편지 / 편집")
import { LetterEditor } from '../_ui/LetterEditor';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LetterEditor letterId={Number(id)} />;
}
