// Day 초안 상세 — 열람 기록은 생성이 끝난 초안을 열었을 때만 남긴다(만드는 중에 본 건 새 결과를 본 게 아니다)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import type { ContentDraftStatus } from '@/features/content/api/content-batch';
import { needsRevisit } from '@/features/content/model/review-visit';

import { DraftDetailPage } from './DraftDetailPage';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

const draft = (status: ContentDraftStatus) => ({
  draftId: 601,
  batchId: 6,
  plannedDay: 301,
  status,
  errorMessage: null,
  comments: [],
});

const batch = {
  batch: {
    batchId: 6,
    status: 'REVIEW_READY',
    startDay: 301,
    endDay: 301,
    dayCount: 1,
    characterRatio: { chloe: 1, marco: 0, teddy: 0 },
    note: null,
    autoProceed: false,
    requestedBy: 12,
    errorMessage: null,
    createdAt: '2026-10-22T09:30:00',
    updatedAt: '2026-10-22T10:05:00',
  },
  days: [],
};

function renderPage(status: ContentDraftStatus) {
  // 재생성 기록이 있는 Day — 열람 기록이 남으면 "다시 볼 것"에서 빠진다
  window.localStorage.setItem(
    'content-review:601',
    JSON.stringify({ regeneratedAt: '2026-10-22T10:00:00.000Z' }),
  );
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) =>
      Response.json({
        success: true,
        data: String(url).includes('/drafts/') ? draft(status) : batch,
      }),
    ),
  );
  render(
    <QueryClientProvider client={new QueryClient()}>
      <DraftDetailPage batchId={6} draftId={601} />
    </QueryClientProvider>,
  );
}

it('생성이 끝난 초안을 열면 열람을 기록해 "다시 볼 것"에서 빠진다', async () => {
  renderPage('REVIEW_READY');

  await screen.findByRole('link', { name: 'Day 목록' });

  expect(needsRevisit(601, 'REVIEW_READY')).toBe(false);
});

it('아직 만드는 중인 초안을 열면 열람을 기록하지 않는다', async () => {
  renderPage('GENERATING');

  await screen.findByRole('link', { name: 'Day 목록' });

  expect(needsRevisit(601, 'REVIEW_READY')).toBe(true);
});
