'use client';

// 클라이언트 전역 Provider 묶음 — 루트 레이아웃(서버 컴포넌트)이 이걸로 children을 감싼다
import { QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/api/query-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
