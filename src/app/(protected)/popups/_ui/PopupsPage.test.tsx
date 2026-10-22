// 실제 폼과 프록시 요청을 통해 저장 실패 복구와 부분 수정 계약을 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';

import { PopupsPage } from './PopupsPage';

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
const popup = {
  popupId: 1,
  title: '기존 팝업',
  imageUrl: 'https://cdn.example.com/a.png',
  linkUrl: '/learn',
  enabled: true,
  startsAt: '2026-10-22T00:00:00.123456Z',
  endsAt: '2026-10-29T00:00:00Z',
  priority: 0,
  updatedAt: '2026-10-22T00:00:00Z',
};
it('링크를 비우고 끈 뒤 확인하면 변경 필드만 저장하고 목록을 갱신한다', async () => {
  const user = userEvent.setup();
  const requests: object[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url, init) => {
      if (init.method === 'PATCH') {
        requests.push(JSON.parse(init.body));
        return Response.json({
          success: true,
          data: { ...popup, linkUrl: null, enabled: false },
        });
      }
      return Response.json({ success: true, data: [popup] });
    }),
  );
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <PopupsPage />
    </QueryClientProvider>,
  );
  await user.click(
    await screen.findByRole('button', { name: '기존 팝업 수정' }),
  );
  await user.clear(screen.getByLabelText(/^연결 링크/));
  await user.click(screen.getByRole('switch', { name: '팝업 켜기' }));
  await user.click(screen.getByRole('button', { name: '저장' }));
  expect(requests).toHaveLength(0);
  await user.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: '확인',
    }),
  );
  await waitFor(() =>
    expect(requests).toEqual([{ linkUrl: null, enabled: false }]),
  );
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  );
});
it('저장에 실패하면 입력을 보존한 채 재시도할 수 있다', async () => {
  const user = userEvent.setup();
  let failed = true;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url, init) => {
      if (init.method === 'PATCH' && failed)
        return Response.json(
          { success: false, error: { message: '실패' } },
          { status: 500 },
        );
      return Response.json({
        success: true,
        data: init.method === 'GET' ? [popup] : popup,
      });
    }),
  );
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <PopupsPage />
    </QueryClientProvider>,
  );
  await user.click(
    await screen.findByRole('button', { name: '기존 팝업 수정' }),
  );
  await user.clear(screen.getByLabelText('제목'));
  await user.type(screen.getByLabelText('제목'), '변경한 제목');
  await user.click(screen.getByRole('button', { name: '저장' }));
  await user.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: '확인',
    }),
  );
  await screen.findByRole('button', { name: '확인' });
  expect(screen.getByLabelText('제목')).toHaveValue('변경한 제목');
  failed = false;
  await user.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: '확인',
    }),
  );
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  );
});

it('편집 중 목록 재조회가 실패해도 입력을 유지한다', async () => {
  const user = userEvent.setup();
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const fetchMock = vi
    .fn()
    .mockResolvedValue(Response.json({ success: true, data: [popup] }));
  vi.stubGlobal('fetch', fetchMock);
  render(
    <QueryClientProvider client={client}>
      <PopupsPage />
    </QueryClientProvider>,
  );
  await user.click(
    await screen.findByRole('button', { name: '기존 팝업 수정' }),
  );
  await user.type(screen.getByLabelText('제목'), ' 초안');
  fetchMock.mockImplementation(async () =>
    Response.json({ success: false }, { status: 500 }),
  );
  await client.invalidateQueries();
  await waitFor(() =>
    expect(client.getQueryState(['admin-popups'])?.status).toBe('error'),
  );
  expect(screen.getByLabelText('제목')).toHaveValue('기존 팝업 초안');
});
