// 서버 실패 뒤 확인창·입력을 보존하고 재시도 성공 뒤에만 완료 처리하는지 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

import { needsRevisit } from '@/features/content/model/review-visit';

import { ContentAction } from './ContentAction';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.localStorage.clear();
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

it('재생성이 성공하면 그 Day를 "다시 볼 것"으로 기록한다 — Day 목록 필터 칩이 이 기록으로 센다', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        data: { draftId: 43, status: 'GENERATING' },
      }),
    ),
  );
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <ContentAction
        label="선택 범위 다시 생성"
        command={{ kind: 'regenerate', batchId: 7, draftId: 43, scope: 'ALL' }}
      >
        <p>Day 301 다시 생성</p>
      </ContentAction>
    </QueryClientProvider>,
  );
  const user = userEvent.setup();
  expect(needsRevisit(43, 'REVIEW_READY')).toBe(false);

  await user.click(screen.getByRole('button', { name: '선택 범위 다시 생성' }));
  await user.click(screen.getByRole('button', { name: /^확인$/ }));

  await waitFor(() => expect(needsRevisit(43, 'REVIEW_READY')).toBe(true));
  client.clear();
});
