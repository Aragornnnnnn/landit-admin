// 숨김 사용자 검색·선택·해제와 조회 실패 시 선택 보존을 검증한다.
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';

import { PopupExcludedUsers } from './PopupExcludedUsers';

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

function Editor() {
  const [selected, setSelected] = useState([7]);
  return <PopupExcludedUsers selected={selected} onChange={setSelected} />;
}
function renderEditor(onSubmit = vi.fn()) {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Editor />
      </form>
    </QueryClientProvider>,
  );
}
it('서버 검색 결과를 선택한 뒤 검색어가 바뀌어도 선택을 유지하고 해제한다', async () => {
  const requests: URL[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url) => {
      const parsed = new URL(url, 'http://localhost');
      requests.push(parsed);
      return Response.json({
        success: true,
        data: {
          items:
            parsed.searchParams.get('keyword') === '민수'
              ? [
                  {
                    userProfileId: 12,
                    nickname: '민수',
                    email: 'sample@example.com',
                    status: 'ACTIVE',
                  },
                ]
              : [],
          hasNext: false,
        },
      });
    }),
  );
  const user = userEvent.setup();
  renderEditor();
  await user.type(
    screen.getByRole('textbox', { name: '숨길 사용자 검색' }),
    '민수',
  );
  await user.click(await screen.findByRole('checkbox', { name: /민수/ }));
  expect(screen.getByText('숨길 사용자 · 2명')).toBeInTheDocument();
  await user.clear(screen.getByRole('textbox', { name: '숨길 사용자 검색' }));
  expect(
    screen.getByRole('button', { name: '사용자 12 숨김 해제' }),
  ).toBeInTheDocument();
  expect(
    requests.some(
      (url) =>
        url.searchParams.get('keyword') === '민수' &&
        url.searchParams.get('status') === 'ACTIVE',
    ),
  ).toBe(true);
  await user.click(screen.getByRole('button', { name: '전체 선택 해제' }));
  expect(screen.getByText('숨길 사용자 · 0명')).toBeInTheDocument();
});
it('검색이 실패하면 기존 숨김 대상을 보존하고 재시도한다', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      Response.json(
        { success: false, error: { message: '실패' } },
        { status: 500 },
      ),
    );
  vi.stubGlobal('fetch', fetchMock);
  const user = userEvent.setup();
  const submitted = vi.fn();
  renderEditor(submitted);
  await screen.findByText('사용자 목록을 불러오지 못했어요.');
  expect(
    screen.getByRole('button', { name: '사용자 7 숨김 해제' }),
  ).toBeInTheDocument();
  fetchMock.mockImplementation(async () =>
    Response.json({ success: true, data: { items: [], hasNext: false } }),
  );
  await user.click(screen.getByRole('button', { name: '다시 시도' }));
  await waitFor(() =>
    expect(
      screen.queryByText('사용자 목록을 불러오지 못했어요.'),
    ).not.toBeInTheDocument(),
  );
  expect(screen.getByText('숨길 사용자 · 1명')).toBeInTheDocument();
  expect(submitted).not.toHaveBeenCalled();
});
