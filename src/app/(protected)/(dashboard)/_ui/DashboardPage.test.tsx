// 느리거나 실패한 조회가 다른 대시보드 카드를 가리지 않는지 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

import { DashboardPage } from './DashboardPage';

const signupPath = '/api/v1/admin/users/signup-statistics';
const json = (data: unknown, status = 200) =>
  new Response(
    JSON.stringify({
      success: status < 400,
      data,
      error: status >= 400 ? { message: '조회 실패' } : undefined,
    }),
    { status },
  );
function respond(path: string) {
  if (path.includes('signup-statistics'))
    return json({
      thisWeek: 67,
      lastWeek: 476,
      thisMonth: 744,
      lastMonth: 1198,
      asOf: '2026-10-13T22:00:00',
    });
  if (path.includes('app-versions'))
    return json([{ platform: 'IOS', versionName: '1.3.2', buildNumber: 1 }]);
  return json({ items: [], totalElements: 0 });
}
function renderPage() {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <DashboardPage />
    </QueryClientProvider>,
  );
  return userEvent.setup();
}
afterEach(() => vi.unstubAllGlobals());

it.each([
  ['가입 통계', 'signup-statistics', '이번 주 가입', '앱 버전'],
  ['미처리 피드백', 'status=PENDING', '답장 기다리는 피드백', '앱 버전'],
  ['최근 피드백', 'createdFrom=', '최근 피드백', '이번 주 가입'],
  ['앱 버전', 'app-versions', '앱 버전', '이번 주 가입'],
  [
    '편지함',
    'publicationStatus=PUBLISHED',
    '지금 편지함 맨 위',
    '이번 주 가입',
  ],
])(
  '%s 응답이 지연되면 해당 카드만 로딩하고 다른 카드는 표시한다',
  async (_, match, blocked, ready) => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const path = String(input);
      return path.includes(match)
        ? new Promise<Response>(() => {})
        : respond(path);
    });
    vi.stubGlobal('fetch', fetchMock);

    renderPage();

    const readyCard = screen.getByRole('region', { name: ready });
    await within(readyCard).findByText(ready === '앱 버전' ? /1.3.2/ : '67');
    expect(
      within(screen.getByRole('region', { name: blocked })).getByLabelText(
        '불러오는 중',
      ),
    ).toBeInTheDocument();
    expect(
      fetchMock.mock.calls.some(([input]) => /\/users\?/.test(String(input))),
    ).toBe(false);
  },
);

it('가입 통계가 실패하면 해당 카드에서 재시도하고 다른 카드는 유지한다', async () => {
  let failed = true;
  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>(async (input) =>
      String(input).includes(signupPath) && failed
        ? json(null, 503)
        : respond(String(input)),
    ),
  );
  const user = renderPage();
  const card = screen.getByRole('region', { name: '이번 주 가입' });
  await within(card).findByRole('alert');
  expect(within(card).queryByText('0')).not.toBeInTheDocument();
  expect(
    within(screen.getByRole('region', { name: '앱 버전' })).getByText(/1.3.2/),
  ).toBeInTheDocument();

  failed = false;
  await user.click(within(card).getByRole('button', { name: '다시 시도' }));

  expect(await within(card).findByText('67')).toBeInTheDocument();
});

it.each([
  null,
  { thisWeek: 2 },
  {
    thisWeek: -1,
    lastWeek: 0,
    thisMonth: 0,
    lastMonth: 0,
    asOf: '2026-10-13T22:00:00',
  },
])(
  '가입 통계 응답이 올바르지 않으면 숫자로 표시하지 않고 해당 카드에 오류를 표시한다',
  async (data) => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(async (input) =>
        String(input).includes(signupPath)
          ? json(data)
          : respond(String(input)),
      ),
    );
    renderPage();
    const card = screen.getByRole('region', { name: '이번 주 가입' });
    await within(card).findByRole('alert');
    expect(within(card).queryByText('0')).not.toBeInTheDocument();
  },
);
