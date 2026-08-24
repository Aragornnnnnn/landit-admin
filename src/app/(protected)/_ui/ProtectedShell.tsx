'use client';

// 보호 구역 셸 — 사이드바 + 상단바 + 콘텐츠
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';

import { ApiHostProvider } from '../_model/api-host';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';

export function ProtectedShell({
  apiHost,
  children,
}: {
  apiHost: string;
  children: React.ReactNode;
}) {
  return (
    <ApiHostProvider value={apiHost}>
      <SidebarProvider
        style={{ '--sidebar-width': '280px' } as React.CSSProperties}
      >
        <AppSidebar apiHost={apiHost} />
        <SidebarInset className="min-w-0 bg-background">
          <TopBar />
          <div className="flex-1 px-6 pb-12 md:px-12">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ApiHostProvider>
  );
}
