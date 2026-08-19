'use client';

// 셸 사이드바 — 로고 → 서버 카드 → 내비 그룹(배지) → 내 계정. 데스크톱 고정, 모바일은 shadcn Sidebar가 Sheet로 바꾼다 (docs/admin-spec.md "셸")
import { ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
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
import { useLogout } from '../_model/useLogout';
import { usePendingFeedbackCountQuery } from '../_model/usePendingFeedbackCountQuery';

interface AppSidebarProps {
  apiHost: string;
  nickname: string | null;
}

export function AppSidebar({ apiHost, nickname }: AppSidebarProps) {
  const pathname = usePathname();
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
          <span className="flex size-8 items-center justify-center rounded-[9px] bg-primary text-sm font-extrabold text-primary-foreground">
            L
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-foreground">
              landit
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              어드민
            </span>
          </span>
        </Link>
        <div className="flex items-center justify-between rounded-xl px-1.5 py-0.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-medium text-strong">
              {developServer ? '개발 서버' : '운영 서버'}
            </span>
            <span className="text-xs text-subtle">
              {apiHost || '서버 미설정'}
            </span>
          </div>
          <ChevronRight className="size-4 text-subtle" aria-hidden />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        {NAV_GROUPS.map((group, index) => {
          const items = group.items.filter(
            (item) => !item.developOnly || developServer,
          );
          if (items.length === 0) return null;
          return (
            <SidebarGroup key={group.label ?? index} className="py-1">
              {group.label && (
                <SidebarGroupLabel className="px-3.5 pt-4 text-[13px] font-medium text-subtle">
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
                        {badge ? (
                          <SidebarMenuBadge className="rounded-full bg-primary px-[7px] text-[11px] font-medium text-primary-foreground">
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
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-strong">
              {(nickname ?? '관').slice(0, 1)}
            </span>
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
