// 새 개인 편지 흐름 검증 — 붙여넣기 판정 · 확인 후 발송 본문 · 404 전체 미발송 배너. 네트워크(fetch)만 목한다
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { NewDirectLetterPage } from './NewDirectLetterPage';

const USERS = [
  { userProfileId: 1290, nickname: '하늘', status: 'ACTIVE' },
  { userProfileId: 977, nickname: '서연', status: 'ACTIVE' },
  { userProfileId: 640, nickname: '태오', status: 'WITHDRAWN' },
].map((u) => ({
  ...u,
  email: `${u.userProfileId}@example.com`,
  role: 'USER',
  pushPermissionStatus: 'GRANTED',
  createdAt: '2026-08-18T10:00:00',
}));

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

/** 사용자 목록은 한 장으로 끝나고, 발송은 주어진 응답을 돌려준다 */
function stubBackend(sendResponse: () => Response) {
  const fetchMock = vi.fn<typeof fetch>(async (input) => {
    const url = String(input);
    if (url.includes('/admin/users'))
      return json(200, {
        success: true,
        data: { items: USERS, page: 0, size: 50, hasNext: false },
      });
    return sendResponse();
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <NewDirectLetterPage />
    </QueryClientProvider>,
  );
  return userEvent.setup();
}

async function pasteIds(user: ReturnType<typeof userEvent.setup>, ids: string) {
  await user.click(screen.getByRole('tab', { name: 'ID 붙여넣기' }));
  await user.type(screen.getByLabelText('붙여넣을 ID'), ids);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('NewDirectLetterPage', () => {
  it('붙여넣은 ID 중 활성 사용자만 받는 사람으로 추가하고, 없거나 탈퇴한 ID는 따로 센다', async () => {
    stubBackend(() => json(500, {}));
    const user = renderPage();

    await pasteIds(user, '1290 640 9999');
    expect(
      await screen.findByText(/없거나 탈퇴 2개 \(#640 #9999\)/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '1명 추가' }));

    const chips = screen.getByRole('list', { name: '받는 사람' });
    expect(within(chips).getByText('하늘')).toBeInTheDocument();
    expect(within(chips).queryByText('태오')).not.toBeInTheDocument();
  });

  it('확인창에서 보내면 받는 사람·제목·본문을 그대로 보내고 폼을 비운다', async () => {
    const fetchMock = stubBackend(() =>
      json(201, {
        success: true,
        data: {
          letterId: 58,
          recipientCount: 2,
          sentAt: '2026-10-02T14:32:00',
        },
      }),
    );
    const user = renderPage();

    await pasteIds(user, '1290, 977');
    await user.click(await screen.findByRole('button', { name: '2명 추가' }));
    await user.type(screen.getByLabelText('제목'), ' 결제 오류 보상 안내 ');
    await user.type(
      screen.getByLabelText('본문'),
      '안녕하세요.{enter}{enter}감사합니다.',
    );
    await user.click(screen.getByRole('button', { name: '2명에게 보내기' }));
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', {
        name: '보내기',
      }),
    );

    await waitFor(() => expect(screen.getByLabelText('제목')).toHaveValue(''));
    const [, init] = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith('/admin/mailbox/direct-letters'),
    )!;
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toEqual({
      userProfileIds: [1290, 977],
      title: '결제 오류 보상 안내',
      bodyText: '안녕하세요.\n\n감사합니다.',
    });
  });

  it('404면 아무에게도 보내지 않았다는 배너를 띄우고 입력은 그대로 둔다', async () => {
    stubBackend(() =>
      json(404, {
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: '활성 수신자를 찾을 수 없습니다.',
        },
      }),
    );
    const user = renderPage();

    await pasteIds(user, '1290');
    await user.click(await screen.findByRole('button', { name: '1명 추가' }));
    await user.type(screen.getByLabelText('제목'), '안내');
    await user.type(screen.getByLabelText('본문'), '본문');
    await user.click(screen.getByRole('button', { name: '1명에게 보내기' }));
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', {
        name: '보내기',
      }),
    );

    expect(
      await screen.findByText('아무에게도 보내지 않았어요'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('제목')).toHaveValue('안내');
  });
});
