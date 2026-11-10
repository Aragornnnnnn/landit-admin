// 배치 완료가 상세 조회보다 먼저 도착해도 최종 초안을 다시 읽는지 검증한다.
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { useContentDraftQuery } from './useContentQuery';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it('목록의 Day 상태가 완료로 바뀌면 오래된 LINEUP 상세를 새로 조회한다', async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({ success: true, data: { status: 'LINEUP' } }),
    )
    .mockResolvedValueOnce(
      Response.json({ success: true, data: { status: 'REVIEW_READY' } }),
    );
  vi.stubGlobal('fetch', fetch);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result, rerender, unmount } = renderHook(
    ({ status }) => useContentDraftQuery(42, 43, false, status),
    { initialProps: { status: 'LINEUP' }, wrapper },
  );
  await waitFor(() => expect(result.current.data?.status).toBe('LINEUP'));

  rerender({ status: 'REVIEW_READY' });

  await waitFor(() => expect(result.current.data?.status).toBe('REVIEW_READY'));
  expect(fetch).toHaveBeenCalledTimes(2);
  unmount();
  client.clear();
});
