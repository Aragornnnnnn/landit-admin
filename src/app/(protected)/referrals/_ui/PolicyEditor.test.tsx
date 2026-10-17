// 저장 전 확인과 동시 수정 충돌 시 초안 보존을 실제 API 경계에서 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

import type { PolicyState } from '../_api/referrals';
import { PolicyEditor } from './PolicyEditor';

const stage = {
  enabled: true,
  target: 'BOTH' as const,
  inviterWon: 100,
  inviteeWon: 200,
};
const state: PolicyState = {
  revision: 2,
  paused: false,
  policy: {
    version: 3,
    signup: stage,
    purchase: { enabled: false, target: 'NONE', inviterWon: 0, inviteeWon: 0 },
    products: [],
    createdBy: 1,
    createdAt: '2026-10-18T00:00:00Z',
    reason: '초기 정책',
  },
};
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it('확인 전에는 요청하지 않고 충돌하면 입력한 사유를 유지한다', async () => {
  const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(
      JSON.stringify({
        success: false,
        error: {
          message: '정책이 변경되었어요.',
          code: 'REFERRAL_POLICY_CHANGED',
        },
      }),
      { status: 409 },
    ),
  );
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PolicyEditor state={state} reload={() => {}} />
    </QueryClientProvider>,
  );
  await userEvent.type(
    screen.getByLabelText('정책 변경 사유'),
    '신규 가입 혜택 변경',
  );
  await userEvent.click(screen.getByRole('button', { name: '변경 내용 확인' }));
  expect(fetcher).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(await screen.findByText('정책이 변경되었어요.')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: '취소' }));
  expect(screen.getByLabelText('정책 변경 사유')).toHaveValue(
    '신규 가입 혜택 변경',
  );
  expect(screen.getByRole('button', { name: '변경 내용 확인' })).toBeDisabled();
  const body = JSON.parse(fetcher.mock.calls[0][1]?.body as string);
  expect(body.expectedRevision).toBe(2);
  expect(body.purchase).toEqual({
    enabled: false,
    target: 'NONE',
    inviterWon: 0,
    inviteeWon: 0,
  });
});

it('서버 정책이 갱신되어도 편집 시작 시점의 revision으로 저장한다', async () => {
  const fetcher = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: state })),
    );
  const client = new QueryClient();
  const { rerender } = render(
    <QueryClientProvider client={client}>
      <PolicyEditor state={state} reload={() => {}} />
    </QueryClientProvider>,
  );
  await userEvent.type(screen.getByLabelText('정책 변경 사유'), '편집 중');
  rerender(
    <QueryClientProvider client={client}>
      <PolicyEditor state={{ ...state, revision: 99 }} reload={() => {}} />
    </QueryClientProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: '변경 내용 확인' }));
  await userEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(
    JSON.parse(fetcher.mock.calls[0][1]?.body as string).expectedRevision,
  ).toBe(2);
});
