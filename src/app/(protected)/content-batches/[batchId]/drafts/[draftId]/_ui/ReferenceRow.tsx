'use client';

// 질문·표현·별점 줄 — 누르면 코멘트 참조를 넣고 빼는 버튼. 선택(targetPath)은 오렌지 테두리, 검증기에서 찾아온 줄은 2초 하이라이트
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { rowElementId } from '../_model/draft-content';

interface ReferenceRowProps {
  path: string;
  label: string;
  selected: boolean;
  highlighted: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

export function ReferenceRow({
  path,
  label,
  selected,
  highlighted,
  onToggle,
  children,
  className,
}: ReferenceRowProps) {
  return (
    <button
      type="button"
      id={rowElementId(path)}
      aria-pressed={selected}
      aria-label={`${label} 참조`}
      onClick={onToggle}
      className={cn(
        'w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-hairline',
        selected && 'ring-1 ring-primary ring-inset',
        highlighted && 'bg-primary/10',
        className,
      )}
    >
      {children}
    </button>
  );
}
