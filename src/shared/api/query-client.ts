'use client';

// TanStack Query 클라이언트 — 앱에 하나. 어드민 데이터는 짧게 신선하고(30초), 창 포커스 재조회는 끈다(운영 중 깜빡임 방지)
import { QueryClient } from '@tanstack/react-query';

let client: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  client ??= new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // 401·403은 재시도해도 같다 — 세션·권한 문제는 client.ts가 처리한다
        retry: (failureCount, error) => {
          const status = (error as { status?: number }).status;
          if (status === 401 || status === 403) return false;
          return failureCount < 2;
        },
      },
    },
  });
  return client;
}
