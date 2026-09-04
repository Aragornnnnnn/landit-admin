'use client';

// 편지 본문 카드 — 마크다운 에디터 하나. 저장할 때 PARAGRAPH 블록 하나로 감싸는 건 letter-draft가 한다 (docs/screens/letters.md "새 편지 / 편집")
import { MarkdownEditor } from '@/features/markdown-editor/ui/MarkdownEditor';

export function LetterBodyCard({
  body,
  onChange,
}: {
  body: string;
  onChange: (body: string) => void;
}) {
  return (
    // 카드 제목은 두지 않는다 — 에디터 라벨 줄("본문 · 도움말 · 쓰기|미리보기")이 곧 제목이라 겹친다
    <section className="flex flex-col gap-3 rounded-[20px] bg-card p-6">
      <MarkdownEditor
        value={body}
        onChange={onChange}
        background="card"
        label="편지 본문"
        placeholder="본문 — 이미지는 붙여넣거나 끌어다 놓으세요"
      />
    </section>
  );
}
