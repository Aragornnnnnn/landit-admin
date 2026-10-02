'use client';

// 사용자 편지함 미리보기 — 받는 사람이 볼 편지를 그린다 (Figma 2593:426 우측). 본문은 사용자 앱과 같은 마크다운 렌더 조합이다.
// 칩 문구 "편지"는 앱이 DIRECT를 어떻게 보여 줄지 정해지면 맞춘다 (docs/screens/direct-letters.md "열린 질문")
import { MarkdownPreview } from '@/features/markdown-editor/ui/MarkdownPreview';
import { cn } from '@/shared/lib/cn';
import { StatusChip } from '@/shared/ui/StatusChip';

const todayLabel = () => {
  const now = new Date();
  return `${now.getMonth() + 1}월 ${now.getDate()}일`;
};

export function DirectLetterPreview({
  title,
  body,
  className,
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="text-center text-[13px] text-subtle">
        사용자 편지함 미리보기
      </p>
      <div className="flex h-[560px] w-[300px] flex-col gap-3 self-center overflow-y-auto rounded-[28px] bg-card p-5">
        <span className="text-[13px] text-subtle">‹ 편지함</span>
        <span className="flex items-center gap-2">
          <StatusChip>편지</StatusChip>
          <span className="text-[12px] text-subtle">{todayLabel()}</span>
        </span>
        <h3 className="text-[17px] leading-snug font-bold break-words text-foreground">
          {title}
        </h3>
        <MarkdownPreview text={body} className="text-[14px]" />
      </div>
    </div>
  );
}
