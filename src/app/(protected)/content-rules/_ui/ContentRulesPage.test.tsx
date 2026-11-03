// 제작 규칙 화면 — 상태 필터 안에서 scope 칩을 세고, 은퇴는 확인창을 거쳐 PATCH하며(409면 열어 둔다), 등록은 POST 뒤 입력을 비운다
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import type { ContentRule } from '@/features/content/api/content-rule';

import { ContentRulesPage } from './ContentRulesPage';

let search = '';
const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(search),
}));
vi.mock('@/shared/monitoring/report', () => ({ reportError: vi.fn() }));

beforeEach(() => {
  search = '';
  replace.mockReset();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

const rule = (
  ruleId: number,
  ruleCode: string,
  scope: ContentRule['scope'],
  status: ContentRule['status'] = 'ACTIVE',
  sourceCommentId: number | null = null,
): ContentRule => ({
  ruleId,
  ruleCode,
  scope,
  ruleText: `${ruleCode} 규칙 문장`,
  sourceCommentId,
  status,
  createdAt: '2026-10-23T09:00:00',
});

const RULES = [
  rule(30, 'Q-30', 'QUESTION'),
  rule(31, 'Q-31', 'QUESTION', 'ACTIVE', 41),
  rule(7, 'Q-07', 'QUESTION', 'RETIRED'),
  rule(1, 'C-01', 'COMMON'),
];

function renderPage({
  rules = RULES as ContentRule[] | null,
  retireStatus = 200,
} = {}) {
  const requests: { method: string; url: string; body: unknown }[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      requests.push({
        method,
        url,
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
      });
      if (method === 'PATCH')
        return retireStatus === 200
          ? Response.json({
              success: true,
              data: { ...RULES[0], status: 'RETIRED' },
            })
          : Response.json(
              { success: false, error: { message: '이미 은퇴한 규칙이에요' } },
              { status: retireStatus },
            );
      if (method === 'POST')
        return Response.json({
          success: true,
          data: rule(32, 'Q-32', body(init).scope),
        });
      if (rules === null)
        return Response.json(
          { success: false, error: { message: '서버 오류' } },
          { status: 500 },
        );
      return Response.json({ success: true, data: rules });
    }),
  );
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <ContentRulesPage />
    </QueryClientProvider>,
  );
  return requests;
}

const body = (init?: RequestInit) =>
  JSON.parse(String(init?.body)) as { scope: ContentRule['scope'] };

it('기본은 ACTIVE만 — 은퇴한 행은 숨기고 칩 수도 ACTIVE 안에서 센다', async () => {
  renderPage();
  // 목록을 받기 전엔 칩에 수를 적지 않는다 — 0처럼 보이면 안 된다
  expect(screen.getByRole('tab', { name: '전체' })).toBeInTheDocument();

  expect(await screen.findByText('Q-30')).toBeInTheDocument();
  expect(screen.queryByText('Q-07')).not.toBeInTheDocument();
  expect(screen.getByRole('tab', { name: '전체 3' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'QUESTION 2' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'LINEUP 0' })).toBeInTheDocument();
});

it('scope 칩을 누르면 쿼리스트링에 scope를 적는다', async () => {
  const user = userEvent.setup();
  renderPage();
  await screen.findByText('Q-30');

  await user.click(screen.getByRole('tab', { name: 'COMMON 1' }));

  expect(replace).toHaveBeenCalledWith('?scope=COMMON', { scroll: false });
});

it('전체 칩으로 돌아가면 쿼리스트링 없는 주소로 간다', async () => {
  search = 'scope=COMMON';
  const user = userEvent.setup();
  renderPage();
  await screen.findByText('C-01');

  await user.click(screen.getByRole('tab', { name: '전체 3' }));

  expect(replace).toHaveBeenCalledWith('/content-rules', { scroll: false });
});

it('?status=ALL이면 은퇴한 행도 보이고 그 행의 액션은 비어 있다', async () => {
  search = 'status=ALL&scope=QUESTION';
  renderPage();

  const row = (await screen.findByText('Q-07')).closest('li')!;

  expect(within(row).getByText('RETIRED')).toBeInTheDocument();
  expect(within(row).queryByRole('button', { name: /은퇴/ })).toBeNull();
});

it('쿼리스트링의 scope 칩이 선택되고 그 수는 상태 필터 안에서 센다', async () => {
  search = 'status=ALL&scope=QUESTION';
  renderPage();
  await screen.findByText('Q-07');

  expect(screen.getByRole('tab', { name: 'QUESTION 3' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

it('출처는 코멘트에서 승격했으면 코멘트 번호, 아니면 시드·직접으로 적는다', async () => {
  renderPage();

  const promoted = (await screen.findByText('Q-31')).closest('li')!;
  const seeded = screen.getByText('Q-30').closest('li')!;

  expect(within(promoted).getByText('코멘트 #41')).toBeInTheDocument();
  expect(within(seeded).getByText('시드·직접')).toBeInTheDocument();
});

it('은퇴를 누르면 확인창이 열리고, 확인하면 PATCH {status: RETIRED}를 보내고 닫힌다', async () => {
  const user = userEvent.setup();
  const requests = renderPage();
  await screen.findByText('Q-30');

  await user.click(screen.getByRole('button', { name: 'Q-30 은퇴' }));
  const dialog = screen.getByRole('alertdialog', {
    name: 'Q-30 규칙을 은퇴할까요?',
  });
  await user.click(within(dialog).getByRole('button', { name: '확인' }));

  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  const patch = requests.find((request) => request.method === 'PATCH');
  expect(patch?.url).toMatch(/\/content-rules\/30$/);
  expect(patch?.body).toEqual({ status: 'RETIRED' });
});

it('은퇴가 409(이미 은퇴)로 실패하면 확인창을 닫는다 — 목록은 공통 훅이 다시 읽는다', async () => {
  const user = userEvent.setup();
  renderPage({ retireStatus: 409 });
  await screen.findByText('Q-30');

  await user.click(screen.getByRole('button', { name: 'Q-30 은퇴' }));
  await user.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: '확인',
    }),
  );

  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
});

it('은퇴가 다른 오류로 실패하면 확인창을 열어 둬 다시 시도할 수 있다', async () => {
  const user = userEvent.setup();
  renderPage({ retireStatus: 500 });
  await screen.findByText('Q-30');

  await user.click(screen.getByRole('button', { name: 'Q-30 은퇴' }));
  const dialog = screen.getByRole('alertdialog');
  await user.click(within(dialog).getByRole('button', { name: '확인' }));

  // 요청이 끝나 확인 버튼이 다시 켜진 뒤에도 열려 있어야 한다 — 보내는 중엔 어차피 열려 있다
  await waitFor(() =>
    expect(within(dialog).getByRole('button', { name: '확인' })).toBeEnabled(),
  );
  expect(screen.getByRole('alertdialog')).toBeInTheDocument();
});

it('규칙 문장을 적고 등록하면 보고 있는 scope로 POST하고 입력을 비운다', async () => {
  search = 'scope=COMMON';
  const user = userEvent.setup();
  const requests = renderPage();
  await screen.findByText('C-01');

  await user.type(
    screen.getByLabelText(/규칙 문장/),
    '  유저 이름을 쓰지 않는다 ',
  );
  await user.click(screen.getByRole('button', { name: '등록' }));

  await waitFor(() =>
    expect(requests.find((request) => request.method === 'POST')?.body).toEqual(
      { scope: 'COMMON', ruleText: '유저 이름을 쓰지 않는다' },
    ),
  );
  await waitFor(() =>
    expect(screen.getByLabelText(/규칙 문장/)).toHaveValue(''),
  );
});

it('규칙 문장이 비어 있으면 등록 버튼이 잠긴다', async () => {
  renderPage();
  await screen.findByText('Q-30');

  expect(screen.getByRole('button', { name: '등록' })).toBeDisabled();
});

it('고른 scope에 규칙이 없으면 그렇다고 말한다', async () => {
  search = 'scope=IMAGE';
  renderPage();

  expect(
    await screen.findByText('이 scope에 규칙이 없어요'),
  ).toBeInTheDocument();
});

it('목록을 못 읽으면 다시 시도 버튼과 함께 알린다', async () => {
  renderPage({ rules: null });

  expect(
    await screen.findByText('규칙 목록을 불러오지 못했어요'),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /다시/ })).toBeInTheDocument();
});
