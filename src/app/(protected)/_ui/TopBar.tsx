'use client';

// 상단바 — 페이지 제목만. 액션은 콘텐츠 첫 줄에 둔다. 모바일에선 햄버거(SidebarTrigger)가 앞에 붙는다
import { usePathname } from 'next/navigation';

import { SidebarTrigger } from '@/shared/ui/sidebar';

import { pageTitleFor } from '../_model/navigation';

export function TopBar() {
  const pathname = usePathname();
  const title = pageTitleFor(pathname);

  return (
    <header className="flex h-[88px] items-center gap-3 px-6 pt-3 md:px-12">
      <SidebarTrigger className="md:hidden" aria-label="메뉴 열기" />
      <h1 className="text-[22px] leading-[1.3] font-bold text-foreground md:text-[28px]">
        {title}
      </h1>
    </header>
  );
}
