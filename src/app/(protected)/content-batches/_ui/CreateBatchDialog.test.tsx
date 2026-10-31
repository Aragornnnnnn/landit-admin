// 접수 Dialog — 합계가 맞을 때만 접수되고, 보내는 몸체가 BE 계약(dayCount·characterRatio·note·autoProceed)대로인지
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';

import { CreateBatchDialog } from './CreateBatchDialog';

// Radix Dialog가 jsdom에 없는 ResizeObserver를 찾는다 — 팝업 테스트와 같은 빈 구현
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

const nextDay = {
  nextDay: 301,
  publishedScenarioCount: 300,
  reservedDayCount: 0,
  characterCounts: { chloe: 80, marco: 74, teddy: 146 },
};

function renderDialog(onCreated = vi.fn()) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <CreateBatchDialog
        open
        nextDay={nextDay}
        onClose={vi.fn()}
        onCreated={onCreated}
      />
    </QueryClientProvider>,
  );
  return onCreated;
}

it('누적이 적은 캐릭터부터 비율을 채우고 예약 범위를 알려 준다', () => {
  renderDialog();

  expect(screen.getByLabelText('chloe Day 수')).toHaveValue(3);
  expect(screen.getByLabelText('marco Day 수')).toHaveValue(4);
  expect(screen.getByLabelText('teddy Day 수')).toHaveValue(3);
  expect(screen.getByText('Day 301 ~ 310 예약')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '접수' })).toBeEnabled();
});

it('캐릭터 합이 Day 수와 다르면 접수 버튼이 잠기고 이유를 보여 준다', async () => {
  const user = userEvent.setup();
  renderDialog();

  await user.clear(screen.getByLabelText('teddy Day 수'));
  await user.type(screen.getByLabelText('teddy Day 수'), '2');

  expect(screen.getByRole('button', { name: '접수' })).toBeDisabled();
  expect(screen.getByRole('alert')).toHaveTextContent(
    '캐릭터별 Day 수의 합을 Day 수와 맞춰 주세요',
  );
});

it('접수하면 BE 계약대로 보내고 받은 배치 번호로 넘어간다', async () => {
  const user = userEvent.setup();
  const requests: { url: string; body: unknown }[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      requests.push({ url, body: JSON.parse(String(init?.body)) });
      return Response.json({
        success: true,
        data: { batch: { batchId: 9 }, days: [] },
      });
    }),
  );
  const onCreated = renderDialog();

  await user.type(screen.getByRole('textbox'), '찡찡대는 주제는 1개까지');
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: '접수' }));

  await waitFor(() => expect(onCreated).toHaveBeenCalledWith(9));
  expect(requests).toEqual([
    {
      url: '/api/proxy/api/v1/admin/content-batches',
      body: {
        dayCount: 10,
        characterRatio: { chloe: 3, marco: 4, teddy: 3 },
        note: '찡찡대는 주제는 1개까지',
        autoProceed: true,
      },
    },
  ]);
});
