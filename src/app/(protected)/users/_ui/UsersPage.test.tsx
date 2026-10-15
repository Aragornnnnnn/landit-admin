// 서버 검색과 페이지 이동, 주소 복원 및 오류 복구를 화면에서 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { UsersPage } from './UsersPage';

const navigation = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  const state = {
    url: '',
    listeners,
    replace: (url: string) => {
      state.url = url;
      listeners.forEach((listener) => listener());
    },
  };
  return state;
});
vi.mock('next/navigation', async () => {
  const { useSyncExternalStore } = await import('react');
  return {
    useRouter: () => ({ replace: navigation.replace }),
    useSearchParams: () =>
      new URLSearchParams(
        useSyncExternalStore(
          (listener) => {
            navigation.listeners.add(listener);
            return () => {
              navigation.listeners.delete(listener);
            };
          },
          () => navigation.url.split('?')[1] ?? '',
        ),
      ),
  };
});
const json = (data: unknown, status = 200) =>
  new Response(
    JSON.stringify({
      success: status < 400,
      data,
      error: status >= 400 ? { message: '조회 실패' } : undefined,
    }),
    { status },
  );
const page = (id = 1281, totalCount = 41, current = 0) => ({
  items: [
    {
      userProfileId: id,
      email: `test${id}@example.com`,
      nickname: `사용자${id}`,
      role: 'USER',
      status: 'ACTIVE',
    },
  ],
  page: current,
  size: 20,
  totalCount,
  totalPages: Math.ceil(totalCount / 20),
  hasNext: current < 2,
});
let client: QueryClient;
beforeEach(() => {
  navigation.url = '/users';
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
});
afterEach(() => {
  client.clear();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function renderPage() {
  render(
    <QueryClientProvider client={client}>
      <UsersPage />
    </QueryClientProvider>,
  );
}

it('페이지를 이동하면 해당 페이지만 요청하고 검색 조건을 바꾸면 첫 페이지를 조회한다', async () => {
  const fetchMock = vi.fn<typeof fetch>(async () => json(page()));
  vi.stubGlobal('fetch', fetchMock);
  renderPage();
  await screen.findByText('검색 결과 41명');
  expect(fetchMock).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByRole('button', { name: '다음 페이지' }));
  await waitFor(() =>
    expect(String(fetchMock.mock.calls[1][0])).toContain('page=1'),
  );
  await screen.findByText('사용자1281');
  vi.useFakeTimers();
  fireEvent.change(screen.getByRole('textbox', { name: '사용자 검색' }), {
    target: { value: '1281' },
  });
  expect(fetchMock).toHaveBeenCalledTimes(2);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(300);
  });
  vi.useRealTimers();
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
  expect(String(fetchMock.mock.calls[2][0])).toContain('keyword=1281');
  expect(String(fetchMock.mock.calls[2][0])).toContain('page=0');
  expect(
    screen.queryByText(/로컬 페이징|검색은 불러온 범위/),
  ).not.toBeInTheDocument();
});

it('외부 주소가 바뀌면 입력을 복원하고 이전 검색어를 다시 요청하지 않는다', async () => {
  navigation.url = '/users?keyword=first';
  const fetchMock = vi.fn<typeof fetch>(async () => json(page(1, 1)));
  vi.stubGlobal('fetch', fetchMock);
  renderPage();
  await screen.findByText('검색 결과 1명');
  act(() => navigation.replace('/users?keyword=second'));
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: '사용자 검색' })).toHaveValue(
      'second',
    ),
  );
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  vi.useFakeTimers();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(350);
  });
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(navigation.url).toContain('keyword=second');
});

it('서버 조회가 실패하면 오류를 표시하고 재시도로 복구한다', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json(null, 503))
      .mockResolvedValueOnce(json(page(1, 1))),
  );
  renderPage();
  await screen.findByText('사용자를 불러오지 못했어요');
  await userEvent.click(screen.getByRole('button', { name: /다시/ }));
  await screen.findByText('검색 결과 1명');
});

it('범위 밖 페이지가 비어 있으면 첫 페이지로 이동할 수 있다', async () => {
  navigation.url = '/users?page=99';
  const fetchMock = vi.fn<typeof fetch>(async (input) =>
    json(String(input).includes('page=99') ? { ...page(), items: [] } : page()),
  );
  vi.stubGlobal('fetch', fetchMock);
  renderPage();
  await userEvent.click(
    await screen.findByRole('button', { name: '첫 페이지로' }),
  );
  await screen.findByText('사용자1281');
  expect(String(fetchMock.mock.calls[1][0])).toContain('page=0');
});
