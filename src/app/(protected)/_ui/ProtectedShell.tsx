'use client';

// 보호 구역 셸 — 사이드바 + 상단바 + 콘텐츠. 닉네임은 로그인 콜백이 남긴 표시용 값(sessionStorage)을 읽는다
import { useSyncExternalStore } from 'react';

import { readAccountDisplay } from '@/shared/auth/account-display';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';

import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';

// sessionStorage는 클라이언트 전용 — 서버 렌더에선 null, 마운트 후 실제 값
const subscribeNoop = () => () => {};
function useAccountNickname() {
  return useSyncExternalStore(
    subscribeNoop,
    () => readAccountDisplay()?.nickname ?? null,
    () => null,
  );
}

export function ProtectedShell({
  apiHost,
  children,
}: {
  apiHost: string;
  children: React.ReactNode;
}) {
  const nickname = useAccountNickname();

  return (
    <SidebarProvider
      style={{ '--sidebar-width': '280px' } as React.CSSProperties}
    >
      <AppSidebar apiHost={apiHost} nickname={nickname} />
      <SidebarInset className="bg-background">
        <TopBar />
        <div className="flex-1 px-6 pb-12 md:px-12">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
