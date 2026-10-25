// 서버 실패 뒤 확인창·입력을 보존하고 재시도 성공 뒤에만 완료 처리하는지 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

import { ContentAction } from './ContentAction';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it('승인이 실패하면 확인창을 유지하고 재시도가 성공한 뒤에만 완료한다', async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json(
        { success: false, error: { message: 'OK가 아닌 Day가 있습니다.' } },
        { status: 409 },
      ),
    )
    .mockResolvedValueOnce(
      Response.json({
        success: true,
        data: { batch: { batchId: 7, status: 'APPROVED' }, days: [] },
      }),
    );
  vi.stubGlobal('fetch', fetch);
  const done = vi.fn();
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <ContentAction
        label="배치 승인"
        command={{ kind: 'approve', batchId: 7 }}
        onComplete={done}
      >
        <p>Day 1 승인</p>
      </ContentAction>
    </QueryClientProvider>,
  );
  const user = userEvent.setup();

  await user.click(screen.getByRole('button', { name: '배치 승인' }));
  await user.click(screen.getByRole('button', { name: /^확인$/ }));
  await screen.findByText('OK가 아닌 Day가 있습니다.');
  expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  expect(done).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: /^확인$/ }));

  await waitFor(() =>
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
  );
  expect(done).toHaveBeenCalledOnce();
  expect(fetch).toHaveBeenCalledTimes(2);
  client.clear();
});
