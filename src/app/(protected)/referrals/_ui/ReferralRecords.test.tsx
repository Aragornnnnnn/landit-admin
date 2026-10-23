// 한도에 따른 부분 지급과 정책 이력을 운영자가 구분할 수 있는지 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

import { ReferralRecords } from './ReferralRecords';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderRecords(items: unknown[]) {
  vi.spyOn(globalThis, 'fetch').mockImplementation(
    async () =>
      new Response(
        JSON.stringify({ success: true, data: { items, hasNext: false } }),
      ),
  );
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ReferralRecords />
    </QueryClientProvider>,
  );
}

it.each([0, 500])(
  '한도로 %i원만 지급하면 약정 금액과 현재 적립액을 구분한다',
  async (creditedWon) => {
    renderRecords([
      {
        id: 1,
        status: 'CREDITED',
        stage: 'SIGNUP',
        recipientRole: 'INVITER',
        recipientId: 10,
        amountWon: 1000,
        creditedWon,
        referralId: 20,
        policyVersion: 3,
        createdAt: '2026-10-22T00:00:00Z',
        reason: 'INVITER_LIMIT_REACHED',
      },
    ]);
    expect(
      await screen.findByText(`약정 금액 1,000원 / 현재 적립 ${creditedWon}원`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/초대인 한도에 따라 부분 또는 0원 지급/),
    ).toBeInTheDocument();
    expect(screen.getByText(/소급 증액하지 않아요/)).toBeInTheDocument();
  },
);

it.each([
  [{ type: 'TOTAL_AMOUNT', value: 5000 }, '누적 초대 적립금 5,000원'],
  [{ type: 'INVITE_COUNT', value: 10 }, '최대 초대 10명'],
  [{ type: 'UNLIMITED', value: null }, '제한 없음'],
  [undefined, '설정 정보 없음'],
])(
  '정책 이력을 열면 저장 당시의 한도를 표시한다 (%j)',
  async (inviterLimit, label) => {
    const stage = {
      enabled: false,
      target: 'NONE',
      inviterWon: 0,
      inviteeWon: 0,
    };
    renderRecords([
      {
        version: 3,
        signup: stage,
        purchase: stage,
        products: [],
        inviterLimit,
        createdBy: 1,
        createdAt: '2026-10-22T00:00:00Z',
        reason: '한도 조정',
      },
    ]);
    await userEvent.click(screen.getByRole('button', { name: '정책 이력' }));
    expect(
      await screen.findByText(`초대인 한도: ${label}`),
    ).toBeInTheDocument();
  },
);
