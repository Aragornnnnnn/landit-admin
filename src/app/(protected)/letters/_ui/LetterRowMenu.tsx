'use client';

// 행 ⋯ 메뉴 — 이 편지에 지금 할 수 있는 일만 뜬다 (Figma 1050:10602).
// 되돌릴 수 없거나 사용자 편지함이 바로 바뀌는 일은 확인 창을 한 번 거친다
import { Fragment } from 'react';
import { MoreHorizontal } from 'lucide-react';

import type { LetterItem } from '@/features/letter/api/letter-list';
import { cn } from '@/shared/lib/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { letterMenuItems, type LetterAction } from '../_model/letter-actions';

interface LetterRowMenuProps {
  item: LetterItem;
  onSelect: (action: LetterAction) => void;
  className?: string;
}

export function LetterRowMenu({
  item,
  onSelect,
  className,
}: LetterRowMenuProps) {
  const items = letterMenuItems(item);
  if (items.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${item.title ?? '편지'} 메뉴`}
        // 행 전체가 링크라 메뉴 클릭이 이동으로 새지 않게 여기서 멈춘다
        onClick={(event) => event.preventDefault()}
        className={cn(
          'rounded-md p-1 text-subtle hover:text-foreground',
          className,
        )}
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {items.map((menu) => (
          <Fragment key={menu.action}>
            {/* 되돌리기 어려운 항목은 선 하나로 떼어 둔다 — 손이 미끄러지지 않게 (프레임) */}
            {menu.destructive && <DropdownMenuSeparator />}
            <DropdownMenuItem
              disabled={Boolean(menu.disabledReason)}
              onSelect={() => onSelect(menu.action)}
              className={cn(
                'text-[14px]',
                menu.destructive && 'text-destructive focus:text-destructive',
              )}
            >
              {menu.label}
              {menu.disabledReason && (
                <span className="ml-auto text-[11px] text-subtle">
                  {menu.disabledReason}
                </span>
              )}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
