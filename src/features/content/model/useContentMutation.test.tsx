// 변경 실패 — 409(상태 가드)는 화면이 낡았다는 뜻이라 토스트 뒤 콘텐츠 캐시를 다시 읽는다. 다른 실패는 토스트만
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { useContentBatchMutation } from './useContentMutation';
import { CONTENT_KEY } from './useContentQuery';

vi.mock('@/shared/monitoring/report', () => ({ reportError: vi.fn() }));

afterEach(() => vi.unstubAllGlobals());

function renderMutation(status: number) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json(
        { success: false, error: { code: 'X', message: '상태가 바뀌었어요' } },
        { status },
      ),
    ),
  );
  const client = new QueryClient();
  const invalidate = vi.spyOn(client, 'invalidateQueries');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => useContentBatchMutation(), { wrapper });
  return { result, invalidate };
}

it('409로 실패하면 콘텐츠 캐시를 무효화해 현재 상태를 다시 읽는다', async () => {
  const { result, invalidate } = renderMutation(409);

  result.current.mutate({ type: 'approve', batchId: 6 });

  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(invalidate).toHaveBeenCalledWith({ queryKey: CONTENT_KEY });
});

it('409가 아닌 실패는 캐시를 그대로 둔다', async () => {
  const { result, invalidate } = renderMutation(500);

  result.current.mutate({ type: 'approve', batchId: 6 });

  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(invalidate).not.toHaveBeenCalled();
});
