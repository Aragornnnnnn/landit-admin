// Day 목록 — 필터 칩이 행을 거르고, 승인은 모든 Day OK일 때만, 확인하면 approve를 보낸다
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';

import type {
  ContentBatchDetail,
  ContentDraftStatus,
} from '@/features/content/api/content-batch';

import { DaysStage } from './DaysStage';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(''),
}));

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

const detail = (statuses: ContentDraftStatus[]): ContentBatchDetail => ({
  batch: {
    batchId: 6,
    status: 'REVIEW_READY',
    startDay: 301,
    endDay: 300 + statuses.length,
    dayCount: statuses.length,
    characterRatio: { chloe: 1, marco: 1, teddy: 0 },
    note: null,
    autoProceed: false,
    requestedBy: 12,
    errorMessage: null,
    createdAt: '2026-10-22T09:30:00',
    updatedAt: '2026-10-22T10:05:00',
  },
  days: statuses.map((status, index) => ({
    draftId: 601 + index,
    plannedDay: 301 + index,
    status,
    title: `제목 ${301 + index}`,
    errorMessage: null,
  })),
});

const POLLED_AT = new Date('2026-10-22T10:30:00').getTime();

function renderStage(data: ContentBatchDetail, fetchMock = vi.fn()) {
  fetchMock.mockImplementation(async (url: string) =>
    Response.json({
      success: true,
      data: String(url).includes('/drafts/')
        ? {
            draftId: 601,
            batchId: 6,
            plannedDay: 301,
            status: 'OK',
            errorMessage: null,
            comments: [],
          }
        : data,
    }),
  );
  vi.stubGlobal('fetch', fetchMock);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <DaysStage detail={data} polledAt={POLLED_AT} />
    </QueryClientProvider>,
  );
  return fetchMock;
}

it('수정이 남아 있으면 승인이 잠기고, 수정 칩을 누르면 그 필터 주소로 간다', async () => {
  const user = userEvent.setup();
  renderStage(detail(['OK', 'NEEDS_FIX', 'REVIEW_READY']));

  expect(
    screen.getByRole('button', { name: '승인 — 표현 id 예약' }),
  ).toBeDisabled();
  expect(screen.getByRole('tab', { name: '수정 1' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: '전체 3' })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await user.click(screen.getByRole('tab', { name: '수정 1' }));

  expect(replace).toHaveBeenCalledWith('?filter=NEEDS_FIX', { scroll: false });
});

it('모든 Day가 OK면 승인할 수 있고, 확인하면 approve를 보낸다', async () => {
  const user = userEvent.setup();
  const fetchMock = renderStage(detail(['OK', 'OK']));

  await user.click(screen.getByRole('button', { name: '승인 — 표현 id 예약' }));
  await user.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: '확인',
    }),
  );

  await waitFor(() =>
    expect(
      fetchMock.mock.calls.some(
        ([url, init]) =>
          String(url).endsWith('/content-batches/6/approve') &&
          (init as RequestInit).method === 'POST',
      ),
    ).toBe(true),
  );
});

it('검수 대기 배치는 재시작이 잠긴다 — 실패했거나 멈춘 생성만', () => {
  renderStage(detail(['OK']));

  expect(screen.getByRole('button', { name: '재시작' })).toBeDisabled();
});

it('생성 중 배치의 마지막 갱신이 폴링 시각 기준 16분 이상 전이면 재시작이 켜진다', () => {
  const stale = detail(['OK', 'GENERATING']);
  stale.batch.status = 'GENERATING';
  stale.batch.updatedAt = '2026-10-22T10:13:00';

  renderStage(stale);

  expect(screen.getByRole('button', { name: '재시작' })).toBeEnabled();
});
