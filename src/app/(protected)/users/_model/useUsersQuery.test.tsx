// 서버 검색의 페이지 요청과 늦게 도착한 이전 응답을 검증한다.
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { useUsersQuery } from './useUsersQuery';

const response = (id: number, total = 41) =>
  new Response(
    JSON.stringify({
      success: true,
      data: {
        items: [{ userProfileId: id }],
        page: 0,
        size: 20,
        hasNext: true,
        totalCount: total,
        totalPages: Math.ceil(total / 20),
      },
    }),
  );
function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
let client: QueryClient;
afterEach(() => {
  client?.clear();
  vi.unstubAllGlobals();
});

it('한 페이지를 조회하면 다음 페이지를 자동으로 불러오지 않고 서버 건수를 사용한다', async () => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const fetchMock = vi.fn<typeof fetch>(async () => response(1281));
  vi.stubGlobal('fetch', fetchMock);
  const { result, rerender } = renderHook(
    ({ page }) =>
      useUsersQuery({
        keyword: ' 1281 ',
        role: 'ADMIN',
        status: 'BANNED',
        page,
      }),
    { initialProps: { page: 0 }, wrapper },
  );
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(result.current.data?.totalCount).toBe(41);
  expect(String(fetchMock.mock.calls[0]?.[0])).toContain('keyword=1281');
  expect(String(fetchMock.mock.calls[0]?.[0])).toContain('role=ADMIN');
  expect(String(fetchMock.mock.calls[0]?.[0])).toContain('status=BANNED');
  rerender({ page: 1 });
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  expect(String(fetchMock.mock.calls[1]?.[0])).toContain('page=1');
});

it('이전 검색 응답이 늦게 도착해도 최신 검색 결과를 유지한다', async () => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let resolveOld!: (value: Response) => void;
  vi.stubGlobal(
    'fetch',
    vi.fn((path: string) =>
      path.includes('keyword=old')
        ? new Promise<Response>((resolve) => {
            resolveOld = resolve;
          })
        : Promise.resolve(response(2, 1)),
    ),
  );
  const { result, rerender } = renderHook(
    ({ keyword }) => useUsersQuery({ keyword, page: 0 }),
    { initialProps: { keyword: 'old' }, wrapper },
  );
  rerender({ keyword: 'new' });
  await waitFor(() =>
    expect(result.current.data?.items[0]?.userProfileId).toBe(2),
  );
  await act(async () => {
    resolveOld(response(1));
  });
  expect(result.current.data?.items[0]?.userProfileId).toBe(2);
});
