// 배치 상세 — 없는 배치(404)는 알리고 목록으로 보낸다(첫 라인업이 끝까지 실패하면 BE가 배치를 지운다)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { BatchDetailPage } from './BatchDetailPage';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));
const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: { error: (...args: unknown[]) => toastError(...args) },
}));

afterEach(() => vi.unstubAllGlobals());

function renderPage(status: number) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json(
        { success: false, error: { code: 'X', message: '없어요' } },
        { status },
      ),
    ),
  );
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <BatchDetailPage batchId={99} />
    </QueryClientProvider>,
  );
}

it('배치가 404면 토스트를 띄우고 목록으로 보낸다', async () => {
  renderPage(404);

  await waitFor(() => expect(replace).toHaveBeenCalledWith('/content-batches'));
  expect(toastError).toHaveBeenCalledWith('배치를 찾을 수 없어요');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('다른 실패는 그 자리에서 알리고 다시 시도하게 한다', async () => {
  renderPage(500);

  expect(await screen.findByRole('alert')).toHaveTextContent(
    '배치를 불러오지 못했어요',
  );
  expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  expect(replace).not.toHaveBeenCalled();
});
