'use client';

// TanStack Query 클라이언트 — 브라우저엔 하나, 서버(SSR)에선 요청마다 새로(사용자 간 캐시가 섞이지 않게).
// 어드민 데이터는 짧게 신선하고(30초), 창 포커스 재조회는 끈다(운영 중 깜빡임 방지)
import { isServer, QueryClient } from '@tanstack/react-query';

import { ApiError } from './api-error';

let browserClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (isServer) return createQueryClient();
  browserClient ??= createQueryClient();
  return browserClient;
}

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // 401·403은 재시도해도 같다 — 세션·권한 문제는 client.ts가 처리한다
        retry: (failureCount, error) => {
          if (
            error instanceof ApiError &&
            (error.status === 401 || error.status === 403)
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}
