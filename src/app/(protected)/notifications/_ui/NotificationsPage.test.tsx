// 설정 조회 실패와 확인 후 저장·이메일 재시도 동작을 네트워크 경계에서 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

import { NotificationsPage } from './NotificationsPage';

const json = (data: unknown, status = 200) =>
  new Response(
    JSON.stringify({
      success: status < 400,
      data,
      error: status >= 400 ? { message: '요청 실패' } : undefined,
    }),
    { status },
  );
const jobId = 'cc1cb013-78d0-461e-9bb7-c880992cab5f';
function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <NotificationsPage />
    </QueryClientProvider>,
  );
  return userEvent.setup();
}
afterEach(() => vi.unstubAllGlobals());
it('설정을 조회하지 못하면 기본값으로 덮어쓸 수 없게 저장 버튼을 표시하지 않는다', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(null, 503)));
  renderPage();
  await screen.findByRole('alert');
  expect(
    screen.queryByRole('button', { name: '설정 저장' }),
  ).not.toBeInTheDocument();
});
it('설정 응답의 채널 값이 누락되면 저장을 막는다', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(json({ pushEnabled: true })),
  );
  renderPage();
  await screen.findByRole('alert');
  expect(screen.queryByRole('switch')).not.toBeInTheDocument();
});
it('채널 변경은 확인 전에는 전송하지 않고 두 설정을 함께 저장한다', async () => {
  const fetchMock = vi.fn<typeof fetch>(async (_, options) =>
    json(
      options?.method === 'PUT'
        ? { pushEnabled: false, emailEnabled: true }
        : { pushEnabled: true, emailEnabled: true },
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  const user = renderPage();
  await user.click(
    await screen.findByRole('switch', { name: '체험 푸시 알림' }),
  );
  await user.click(screen.getByRole('button', { name: '설정 저장' }));
  expect(
    fetchMock.mock.calls.filter(([, options]) => options?.method === 'PUT'),
  ).toHaveLength(0);
  await user.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: '확인',
    }),
  );
  await waitFor(() =>
    expect(screen.getByRole('button', { name: '설정 저장' })).toBeDisabled(),
  );
  expect(
    fetchMock.mock.calls.find(([, options]) => options?.method === 'PUT')?.[1]
      ?.body,
  ).toBe(JSON.stringify({ pushEnabled: false, emailEnabled: true }));
});
it('발송 응답이 유실되면 같은 키로 재시도하고 ACCEPTED를 제공자 접수로 표시한다', async () => {
  let attempts = 0;
  const fetchMock = vi.fn<typeof fetch>(async (input) => {
    if (String(input).includes('trial-reminder-settings'))
      return json({ pushEnabled: true, emailEnabled: true });
    if (String(input).includes('/jobs/'))
      return json({ id: jobId, status: 'ACCEPTED' });
    if (++attempts === 1) throw new TypeError('network disconnected');
    return json({ id: jobId, status: 'ACCEPTED' }, 202);
  });
  vi.stubGlobal('fetch', fetchMock);
  const user = renderPage();
  await user.type(screen.getByLabelText('수신 이메일'), 'tester@example.com');
  for (let index = 0; index < 2; index++) {
    await user.click(
      screen.getByRole('button', { name: '테스트 메일 보내기' }),
    );
    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', {
        name: '확인',
      }),
    );
    if (index === 0) await screen.findByRole('alert');
  }
  expect(await screen.findByText('제공자 접수')).toBeInTheDocument();
  const sends = fetchMock.mock.calls.filter(([input]) =>
    String(input).includes('email-tests'),
  );
  expect(sends).toHaveLength(2);
  const keys = sends.map(([, options]) =>
    new Headers(options?.headers).get('Idempotency-Key'),
  );
  expect(keys[0]).toBeTruthy();
  expect(keys[1]).toBe(keys[0]);
  expect(
    screen.getByText('제공자 접수는 메일함 도착을 의미하지 않아요.'),
  ).toBeInTheDocument();
});
