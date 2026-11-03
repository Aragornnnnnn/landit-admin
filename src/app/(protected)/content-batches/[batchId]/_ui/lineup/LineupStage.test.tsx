// 라인업 확인 — 행을 고치면 진행이 잠기고, 저장은 10행 전부를 PUT으로 보내며, 코멘트 재생성은 코멘트가 있을 때만
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import type { ContentBatchDetail } from '@/features/content/api/content-batch';

import { LineupStage } from './LineupStage';

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

// fetch 대체가 다음 테스트로 새지 않게
afterEach(() => vi.unstubAllGlobals());

const detail: ContentBatchDetail = {
  batch: {
    batchId: 8,
    status: 'LINEUP_READY',
    startDay: 321,
    endDay: 322,
    dayCount: 2,
    characterRatio: { chloe: 1, marco: 1, teddy: 0 },
    note: null,
    autoProceed: false,
    requestedBy: 12,
    errorMessage: null,
    createdAt: '2026-10-23T14:02:00',
    updatedAt: '2026-10-23T14:04:00',
  },
  days: [321, 322].map((day, index) => ({
    draftId: 800 + day,
    plannedDay: day,
    status: 'LINEUP',
    title: `제목 ${day}`,
    errorMessage: null,
    lineupRow: {
      day,
      title: `제목 ${day}`,
      categoryDisplayOrder: 6,
      proposedCategory: null,
      difficulty: 'EASY',
      firstSpeaker: 'AI',
      characterId: index === 0 ? 'chloe' : 'marco',
      beats: ['하나', '둘'],
      overlapWarnings: [],
    },
  })),
};

function renderStage() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <LineupStage detail={detail} />
    </QueryClientProvider>,
  );
}

it('행을 고치면 저장 전까지 진행·재생성이 잠기고, 저장은 모든 행을 PUT으로 보내며, 저장되면 다시 풀린다', async () => {
  const user = userEvent.setup();
  const requests: { method: string; url: string; body: unknown }[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      requests.push({
        method: init?.method ?? 'GET',
        url,
        body: JSON.parse(String(init?.body)),
      });
      // 저장은 배치를 건드리지 않는다 — updatedAt이 그대로인 응답(BE updateLineup과 같다)
      return Response.json({
        success: true,
        data: {
          ...detail,
          days: detail.days.map((day) =>
            day.plannedDay === 321
              ? {
                  ...day,
                  lineupRow: {
                    ...(day.lineupRow as object),
                    title: '새 임원과 점심',
                  },
                }
              : day,
          ),
        },
      });
    }),
  );
  renderStage();

  expect(
    screen.getByRole('button', { name: '진행 — Day 생성 시작' }),
  ).toBeEnabled();

  await user.click(screen.getByRole('button', { name: /Day 321 수정/ }));
  const editor = within(screen.getByRole('group', { name: 'Day 321 편집' }));
  await user.clear(editor.getByLabelText('제목'));
  await user.type(editor.getByLabelText('제목'), '새 임원과 점심');

  expect(
    screen.getByRole('button', { name: '진행 — Day 생성 시작' }),
  ).toBeDisabled();
  expect(screen.getByRole('button', { name: '라인업 재생성' })).toBeDisabled();

  await user.click(screen.getByRole('button', { name: '저장' }));

  await waitFor(() => expect(requests).toHaveLength(1));
  expect(requests[0].method).toBe('PUT');
  expect(requests[0].url).toBe(
    '/api/proxy/api/v1/admin/content-batches/8/lineup',
  );
  const rows = (requests[0].body as { rows: { day: number; title: string }[] })
    .rows;
  expect(rows.map((row) => [row.day, row.title])).toEqual([
    [321, '새 임원과 점심'],
    [322, '제목 322'],
  ]);
  await waitFor(() =>
    expect(
      screen.getByRole('button', { name: '진행 — Day 생성 시작' }),
    ).toBeEnabled(),
  );
  expect(screen.getByText('바뀐 행이 없어요')).toBeInTheDocument();
});

it('캐릭터를 바꿔 접수 비중과 어긋나면 표 오류를 보여 주고 저장을 막는다', async () => {
  const user = userEvent.setup();
  renderStage();

  await user.click(screen.getByRole('button', { name: /Day 322 수정/ }));
  const editor = within(screen.getByRole('group', { name: 'Day 322 편집' }));
  await user.selectOptions(editor.getByLabelText('캐릭터'), 'chloe');

  expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  expect(
    screen.getByText(
      /캐릭터 수가 접수 비중\(chloe 1 · marco 1 · teddy 0\)과 달라요/,
    ),
  ).toBeInTheDocument();
});

it('코멘트가 비어 있으면 재생성 버튼이 잠기고, 적으면 그 코멘트로 보낸다', async () => {
  const user = userEvent.setup();
  const bodies: unknown[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init?: RequestInit) => {
      bodies.push(JSON.parse(String(init?.body)));
      return Response.json({ success: true, data: detail });
    }),
  );
  renderStage();

  const button = screen.getByRole('button', { name: '코멘트로 재생성' });
  expect(button).toBeDisabled();

  await user.type(
    screen.getByLabelText(/라인업 재생성 코멘트/),
    '친구 장면을 2개 늘려 줘',
  );
  await user.click(button);

  await waitFor(() =>
    expect(bodies).toEqual([{ comment: '친구 장면을 2개 늘려 줘' }]),
  );
});
