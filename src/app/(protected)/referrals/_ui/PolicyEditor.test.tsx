// 저장 전 확인과 동시 수정 충돌 시 초안 보존을 실제 API 경계에서 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, within } from '@testing-library/react';
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
    inviterLimit: { type: 'TOTAL_AMOUNT', value: 15000 },
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
  await userEvent.clear(screen.getByLabelText('초대 적립금 한도 (원)'));
  await userEvent.type(screen.getByLabelText('초대 적립금 한도 (원)'), '5000');
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
  expect(body.inviterLimit).toEqual({ type: 'TOTAL_AMOUNT', value: 5000 });
  expect(screen.getByLabelText('초대 적립금 한도 (원)')).toHaveValue(5000);
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

it.each([
  ['TOTAL_AMOUNT', '초대 적립금 한도 (원)', '누적 초대 적립금 5,000원'],
])(
  '%s 한도를 확인하고 저장하면 선택한 기준과 값을 보낸다',
  async (type, label, summary) => {
    const fetcher = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ success: true, data: state })),
      );
    render(
      <QueryClientProvider client={new QueryClient()}>
        <PolicyEditor state={state} reload={() => {}} />
      </QueryClientProvider>,
    );
    await userEvent.selectOptions(screen.getByLabelText('한도 설정'), type);
    await userEvent.clear(screen.getByLabelText(label));
    await userEvent.type(screen.getByLabelText(label), '5000');
    await userEvent.type(screen.getByLabelText('정책 변경 사유'), '한도 조정');
    await userEvent.click(
      screen.getByRole('button', { name: '변경 내용 확인' }),
    );

    const dialog = within(screen.getByRole('alertdialog'));
    expect(
      dialog.getByText(`초대인 한도: 누적 초대 적립금 15,000원 → ${summary}`),
    ).toBeInTheDocument();
    expect(dialog.getByText(/이미 지급한 적립금은 유지/)).toBeInTheDocument();
    expect(fetcher).not.toHaveBeenCalled();
    await userEvent.click(dialog.getByRole('button', { name: '확인' }));
    expect(JSON.parse(fetcher.mock.calls[0][1]?.body as string)).toMatchObject({
      expectedRevision: 2,
      inviterLimit: { type, value: 5000 },
    });
  },
);
it('제한 없음으로 바꾸면 이전 숫자를 비우고 null을 보낸다', async () => {
  const fetcher = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: state })),
    );
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PolicyEditor state={state} reload={() => {}} />
    </QueryClientProvider>,
  );
  await userEvent.selectOptions(
    screen.getByLabelText('한도 설정'),
    'UNLIMITED',
  );
  await userEvent.type(screen.getByLabelText('정책 변경 사유'), '한도 해제');
  await userEvent.click(screen.getByRole('button', { name: '변경 내용 확인' }));
  await userEvent.click(screen.getByRole('button', { name: '확인' }));

  expect(
    JSON.parse(fetcher.mock.calls[0][1]?.body as string).inviterLimit,
  ).toEqual({ type: 'UNLIMITED', value: null });
});
it('금액 한도를 다시 켜면 값을 입력하기 전까지 저장을 막는다', async () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PolicyEditor state={state} reload={() => {}} />
    </QueryClientProvider>,
  );
  expect(
    screen.queryByRole('option', { name: '최대 초대 수' }),
  ).not.toBeInTheDocument();
  await userEvent.type(
    screen.getByLabelText('정책 변경 사유'),
    '금액 한도 변경',
  );
  await userEvent.selectOptions(
    screen.getByLabelText('한도 설정'),
    'UNLIMITED',
  );
  await userEvent.selectOptions(
    screen.getByLabelText('한도 설정'),
    'TOTAL_AMOUNT',
  );
  expect(screen.getByLabelText('초대 적립금 한도 (원)')).toHaveValue(null);
  expect(screen.getByRole('button', { name: '변경 내용 확인' })).toBeDisabled();
});
it('과거 초대 수 정책은 금액 한도를 선택하기 전까지 다시 저장하지 못한다', async () => {
  const old = {
    ...state,
    policy: {
      ...state.policy,
      inviterLimit: { type: 'INVITE_COUNT' as const, value: 10 },
    },
  };
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PolicyEditor state={old} reload={() => {}} />
    </QueryClientProvider>,
  );
  await userEvent.type(
    screen.getByLabelText('정책 변경 사유'),
    '금액으로 변경',
  );
  expect(screen.getByRole('button', { name: '변경 내용 확인' })).toBeDisabled();
  expect(screen.queryByLabelText('최대 초대 수 (명)')).not.toBeInTheDocument();
  await userEvent.selectOptions(
    screen.getByLabelText('한도 설정'),
    'TOTAL_AMOUNT',
  );
  expect(screen.getByLabelText('초대 적립금 한도 (원)')).toHaveValue(null);
});
it('서버가 한도를 제공하지 않으면 편집을 막고 기존 정책만 저장한다', async () => {
  const legacy = {
    ...state,
    policy: { ...state.policy, inviterLimit: undefined },
  };
  const fetcher = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: legacy })),
    );
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PolicyEditor state={legacy} reload={() => {}} />
    </QueryClientProvider>,
  );
  expect(screen.getByLabelText('한도 설정')).toBeDisabled();
  expect(
    screen.getByText('초대인 한도 설정은 아직 사용할 수 없어요.'),
  ).toBeInTheDocument();
  await userEvent.type(
    screen.getByLabelText('정책 변경 사유'),
    '가입 보상 조정',
  );
  await userEvent.click(screen.getByRole('button', { name: '변경 내용 확인' }));
  await userEvent.click(screen.getByRole('button', { name: '확인' }));

  expect(
    JSON.parse(fetcher.mock.calls[0][1]?.body as string),
  ).not.toHaveProperty('inviterLimit');
});
