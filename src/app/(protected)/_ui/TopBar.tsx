'use client';

// 상단바 — 페이지 제목만. 액션은 콘텐츠 첫 줄에 둔다.
// 모바일은 프레임대로 두 줄이다 — 햄버거·서버 표시 줄 위에 제목 줄. 데스크톱은 사이드바가 둘 다 대신해 제목만 남는다
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useSidebar } from '@/shared/ui/sidebar';

import { pageTitleFor } from '../_model/navigation';
import { ServerBadge } from './ServerBadge';

export function TopBar() {
  const pathname = usePathname();
  const title = pageTitleFor(pathname);
  const { toggleSidebar } = useSidebar();

  return (
    <header className="px-6 pt-3 pb-2 md:flex md:h-[88px] md:items-center md:px-12 md:pb-0">
      <div className="mb-1.5 flex h-9 items-center md:hidden">
        {/* shadcn 기본 트리거는 패널 아이콘이라 프레임의 ☰로 바꾼다 */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="메뉴 열기"
          className="-ml-1 rounded-md p-1 text-strong"
        >
          <Menu className="size-6" aria-hidden />
        </button>
        <ServerBadge className="ml-auto" />
      </div>
      <h1 className="text-[22px] leading-[1.3] font-bold text-foreground md:text-[28px]">
        {title}
      </h1>
    </header>
  );
}
