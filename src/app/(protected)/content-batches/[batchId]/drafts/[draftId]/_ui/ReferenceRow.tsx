'use client';

// 질문·표현·별점 줄 — 누르면 코멘트 참조를 넣고 빼는 버튼. 선택(targetPath)은 오렌지 테두리, 검증기에서 찾아온 줄은 2초 하이라이트.
// 검수가 잠겨 있으면(disabled) 참조도 넣지 않는다 — 비활성 칸에 참조만 쌓이는 일이 없게
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { rowElementId } from '../_model/draft-content';

interface ReferenceRowProps {
  path: string;
  /** 참조 라벨(`L1 Q2`·`E 3`·`S 2.5`) — 낭독기엔 내용 앞에 "참조"로 붙는다 */
  label: string;
  selected: boolean;
  highlighted: boolean;
  disabled?: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

export function ReferenceRow({
  path,
  label,
  selected,
  highlighted,
  disabled = false,
  onToggle,
  children,
  className,
}: ReferenceRowProps) {
  return (
    <button
      type="button"
      id={rowElementId(path)}
      aria-pressed={selected}
      data-highlighted={highlighted || undefined}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-hairline disabled:cursor-default disabled:hover:bg-transparent',
        className,
        // className 뒤에 둔다 — 앞에 두면 tailwind-merge가 줄 배경(bg-muted/40)으로 덮어 하이라이트가 안 보인다
        selected && 'ring-1 ring-primary ring-inset',
        highlighted && 'bg-primary/10',
      )}
    >
      <span className="sr-only">{label} 참조 — </span>
      {children}
    </button>
  );
}
