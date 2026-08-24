'use client';

// 셸 사이드바 — 로고 → 서버 카드 → 내비 그룹(배지) → 내 계정. 데스크톱 고정, 모바일은 shadcn Sidebar가 Sheet로 바꾼다 (docs/admin-spec.md "셸")
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { LanditAppIcon } from '@/shared/ui/LanditAppIcon';
import { LanditLogo } from '@/shared/ui/LanditLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar';

import { isActiveNav, isDevelopServer, NAV_GROUPS } from '../_model/navigation';
import { useAccountNickname } from '../_model/useAccountNickname';
import { useLogout } from '../_model/useLogout';
import { usePendingFeedbackCountQuery } from '../_model/usePendingFeedbackCountQuery';

interface AppSidebarProps {
  apiHost: string;
}

export function AppSidebar({ apiHost }: AppSidebarProps) {
  const pathname = usePathname();
  const nickname = useAccountNickname();
  const { isMobile, setOpenMobile } = useSidebar();
  const developServer = isDevelopServer(apiHost);
  const pendingCount = usePendingFeedbackCountQuery();
  const { logout, pending: loggingOut } = useLogout();

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="gap-5 px-5 pt-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-1"
          aria-label="대시보드로"
        >
          <LanditAppIcon size={32} className="rounded-[9px]" />
          <span className="flex items-baseline gap-1.5">
            <LanditLogo height={16} className="text-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              어드민
            </span>
          </span>
        </Link>
        {/* 지금 어느 BE를 보고 있는지 알리기만 한다 — 누를 곳이 아니므로 화살표 같은 어포던스를 두지 않는다 */}
        <div className="flex flex-col gap-0.5 px-1.5 py-0.5">
          <span className="text-[15px] font-medium text-strong">
            {developServer ? '개발 서버' : '운영 서버'}
          </span>
          <span className="text-xs text-subtle">
            {apiHost || '서버 미설정'}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-5">
        {NAV_GROUPS.map((group, index) => {
          const items = group.items.filter(
            (item) => !item.developOnly || developServer,
          );
          if (items.length === 0) return null;
          return (
            <SidebarGroup key={group.label ?? index} className="py-1">
              {group.label && (
                <SidebarGroupLabel className="h-auto px-3.5 pt-6 pb-2 text-[13px] font-medium text-subtle">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {items.map((item) => {
                    const active = isActiveNav(item.href, pathname);
                    const badge =
                      item.badge === 'pendingFeedbacks' ? pendingCount.data : 0;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          className="h-11 rounded-xl px-3.5 text-[15px] font-medium text-body data-[active=true]:bg-sidebar-accent data-[active=true]:text-strong"
                        >
                          <Link
                            href={item.href}
                            onClick={() => isMobile && setOpenMobile(false)}
                          >
                            <item.icon className="size-5" aria-hidden />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                        {/* 배지는 hover·활성에서도 흰 글자 — shadcn 기본값이 진회색으로 바꿔 오렌지 배경과 뭉갠다 */}
                        {badge ? (
                          <SidebarMenuBadge className="h-[17px] min-w-[27px] rounded-full bg-primary px-[7px] text-[11px] font-medium text-primary-foreground!">
                            {badge}
                          </SidebarMenuBadge>
                        ) : null}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-accent px-5 pt-4 pb-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left hover:bg-sidebar-accent"
            aria-label="내 계정 메뉴"
          >
            <LanditAppIcon size={32} className="rounded-full" />
            <span className="flex flex-col">
              <span className="text-[13px] font-medium text-foreground">
                {nickname ?? '관리자'}
              </span>
              <span className="text-[11px] text-muted-foreground">
                ADMIN · 로그아웃
              </span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuItem onSelect={() => logout()} disabled={loggingOut}>
              <LogOut aria-hidden />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
