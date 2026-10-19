// 최신 정책의 조회와 지급 보류가 편집 상태에 미치는 영향을 독립 재현한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

import { ReferralsPage } from './ReferralsPage';

const stage = {
  enabled: true,
  target: 'BOTH',
  inviterWon: 100,
  inviteeWon: 200,
};
const initial = {
  revision: 2,
  paused: false,
  policy: {
    version: 3,
    signup: stage,
    purchase: { enabled: false, target: 'NONE', inviterWon: 0, inviteeWon: 0 },
    products: [],
    createdBy: 1,
    createdAt: '2026-10-18T00:00:00Z',
    reason: 'initial',
  },
};
function response(data: unknown) {
  return new Response(JSON.stringify({ success: true, data }));
}
afterEach(cleanup);
function client() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 30000 } },
  });
}
it('오래된 캐시로 재방문하면 최신 정책과 지급 상태를 표시한다', async () => {
  const qc = client();
  qc.setQueryData(['referrals', 'policy'], initial, {
    updatedAt: Date.now() - 60000,
  });
  const latest = {
    ...initial,
    revision: 4,
    paused: true,
    policy: {
      ...initial.policy,
      version: 4,
      signup: { ...stage, inviterWon: 3000 },
    },
  };
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) =>
    String(url).includes('/referral-policy')
      ? response(latest)
      : response({ items: [], hasNext: false }),
  );
  render(
    <QueryClientProvider client={qc}>
      <ReferralsPage />
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(qc.getQueryData(['referrals', 'policy'])).toEqual(latest),
  );
  await screen.findByText('현재 정책 v4 · 지급 보류 중');
  expect(screen.getAllByLabelText('초대인 금액 (원)')[0]).toHaveValue(3000);
});
it('지급 보류만 저장하면 정책 초안을 보존하고 새 revision으로 저장한다', async () => {
  const qc = client();
  let current = initial;
  const fetcher = vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async (url) => {
      if (String(url).includes('/referral-processing')) {
        current = { ...initial, revision: 3, paused: true };
        return response(current);
      }
      return String(url).includes('/referral-policy')
        ? response(current)
        : response({ items: [], hasNext: false });
    });
  render(
    <QueryClientProvider client={qc}>
      <ReferralsPage />
    </QueryClientProvider>,
  );
  await screen.findByText('현재 정책 v3 · 정상 처리 중');
  const amount = screen.getAllByLabelText('초대인 금액 (원)')[0];
  await userEvent.clear(amount);
  await userEvent.type(amount, '3000');
  await userEvent.type(
    screen.getByLabelText('정책 변경 사유'),
    '혜택 조정 초안',
  );
  await userEvent.type(
    screen.getByLabelText('처리 변경 사유'),
    '지급 일시 보류',
  );
  await userEvent.click(screen.getByRole('button', { name: '지급 보류' }));
  await userEvent.click(screen.getByRole('button', { name: '확인' }));
  await screen.findByText('현재 정책 v3 · 지급 보류 중');
  expect(screen.getByLabelText('정책 변경 사유')).toHaveValue('혜택 조정 초안');
  expect(screen.getAllByLabelText('초대인 금액 (원)')[0]).toHaveValue(3000);
  await userEvent.click(screen.getByRole('button', { name: '변경 내용 확인' }));
  await userEvent.click(screen.getByRole('button', { name: '확인' }));
  await waitFor(() =>
    expect(
      fetcher.mock.calls.some(
        ([url, init]) =>
          String(url).endsWith('/referral-policy') && init?.method === 'PUT',
      ),
    ).toBe(true),
  );
  const saved = fetcher.mock.calls.find(
    ([url, init]) =>
      String(url).endsWith('/referral-policy') && init?.method === 'PUT',
  );
  expect(JSON.parse(saved![1]!.body as string)).toMatchObject({
    expectedRevision: 3,
    signup: { inviterWon: 3000 },
    reason: '혜택 조정 초안',
  });
});

it('다른 관리자가 정책을 바꾼 뒤 보류를 변경하면 초안의 원래 저장 기준을 보존한다', async () => {
  const qc = client();
  let current = initial;
  const requests: unknown[] = [];
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, init) => {
    if (String(url).includes('/referral-processing')) {
      current = { ...current, revision: 5, paused: false };
      return response(current);
    }
    if (String(url).endsWith('/referral-policy') && init?.method === 'PUT') {
      requests.push(JSON.parse(init.body as string));
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'REFERRAL_POLICY_CHANGED',
            message: '다른 관리자가 정책을 변경했어요.',
          },
        }),
        { status: 409 },
      );
    }
    return String(url).includes('/referral-policy')
      ? response(current)
      : response({ items: [], hasNext: false });
  });
  render(
    <QueryClientProvider client={qc}>
      <ReferralsPage />
    </QueryClientProvider>,
  );
  await screen.findByText('현재 정책 v3 · 정상 처리 중');
  await userEvent.type(screen.getByLabelText('정책 변경 사유'), '보존할 초안');
  current = {
    ...initial,
    revision: 4,
    paused: true,
    policy: { ...initial.policy, version: 4 },
  };
  await qc.invalidateQueries({ queryKey: ['referrals', 'policy'] });
  await screen.findByText('현재 정책 v4 · 지급 보류 중');

  await userEvent.type(screen.getByLabelText('처리 변경 사유'), '처리 재개');
  await userEvent.click(screen.getByRole('button', { name: '지급 재개' }));
  await userEvent.click(screen.getByRole('button', { name: '확인' }));
  await screen.findByText('현재 정책 v4 · 정상 처리 중');
  await userEvent.click(screen.getByRole('button', { name: '변경 내용 확인' }));
  await userEvent.click(screen.getByRole('button', { name: '확인' }));

  await waitFor(() => expect(requests).toHaveLength(1));
  expect(requests[0]).toMatchObject({
    expectedRevision: 2,
    reason: '보존할 초안',
  });
  expect(
    await screen.findByText('다른 관리자가 정책을 변경했어요.'),
  ).toBeInTheDocument();
});

it('보류 확인창 이후 상태가 바뀌면 처음 확인한 대상과 revision으로 요청한다', async () => {
  const qc = client();
  let current = initial;
  const requests: unknown[] = [];
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, init) => {
    if (String(url).includes('/referral-processing')) {
      requests.push(JSON.parse(init!.body as string));
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'REFERRAL_POLICY_CHANGED',
            message: '처리 상태가 변경됐어요.',
          },
        }),
        { status: 409 },
      );
    }
    return String(url).includes('/referral-policy')
      ? response(current)
      : response({ items: [], hasNext: false });
  });
  render(
    <QueryClientProvider client={qc}>
      <ReferralsPage />
    </QueryClientProvider>,
  );
  await screen.findByText('현재 정책 v3 · 정상 처리 중');
  await userEvent.type(screen.getByLabelText('처리 변경 사유'), '일시 보류');
  await userEvent.click(screen.getByRole('button', { name: '지급 보류' }));
  current = { ...initial, revision: 3, paused: true };
  await qc.invalidateQueries({ queryKey: ['referrals', 'policy'] });
  await screen.findByText('현재 정책 v3 · 지급 보류 중');

  await userEvent.click(screen.getByRole('button', { name: '확인' }));

  await waitFor(() => expect(requests).toHaveLength(1));
  expect(requests[0]).toMatchObject({ expectedRevision: 2, paused: true });
  expect(
    await screen.findByText('처리 상태가 변경됐어요.'),
  ).toBeInTheDocument();
});
