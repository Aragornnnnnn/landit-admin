'use client';

// 제목 있는 내비 그룹을 접고 펼치며 현재 화면의 그룹은 처음에 열어 둔다.
import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/shared/ui/shadcn/sidebar';

export function SidebarNavGroup({
  label,
  active,
  children,
}: {
  label: string | null;
  active: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(active);
  const contentId = useId();
  return (
    <SidebarGroup className="p-0">
      {label && (
        <SidebarGroupLabel
          asChild
          className={cn(
            'mt-3 h-11 w-full justify-between px-3.5 text-[13px] font-medium text-subtle hover:bg-sidebar-accent',
            active && 'text-strong',
          )}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-controls={contentId}
            onClick={() => setOpen(!open)}
          >
            <span>{label}</span>
            <ChevronDown
              aria-hidden
              className={cn(
                'transition-transform motion-reduce:transition-none',
                !open && '-rotate-90',
              )}
            />
          </button>
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent id={contentId} hidden={label !== null && !open}>
        {children}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
