// 임포트 확인·중복 실행 방지·부분 실패 표시를 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

import { ImportAssetsCard } from './ImportAssetsCard';

afterEach(() => vi.unstubAllGlobals());
it('확인한 뒤 실행하고 진행 중 두 단계를 잠그며 부분 실패를 표시한다', async () => {
  let finish: (response: Response) => void = () => {};
  const fetchMock = vi.fn(
    () =>
      new Promise<Response>((resolve) => {
        finish = resolve;
      }),
  );
  vi.stubGlobal('fetch', fetchMock);
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <ImportAssetsCard />
    </QueryClientProvider>,
  );
  const user = userEvent.setup();
  await user.type(
    screen.getByLabelText('기준 데이터 매니페스트 키'),
    'reference.json',
  );
  await user.type(screen.getByLabelText('TTS 매니페스트 키'), 'tts.json');
  await user.click(screen.getByRole('button', { name: '기준 데이터 임포트' }));
  expect(fetchMock).not.toHaveBeenCalled();
  expect(screen.getByText(/단어별 음성 URL을 초기화/)).toBeInTheDocument();
  await user.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: '확인',
    }),
  );
  expect(screen.getByLabelText('TTS 매니페스트 키')).toBeDisabled();
  expect(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: '취소',
    }),
  ).toBeDisabled();
  finish(
    new Response(
      JSON.stringify({
        success: true,
        data: {
          inserted: 1,
          updated: 2,
          failures: [
            {
              expressionId: 99,
              accentLocale: 'EN_US',
              reason: '문장이 다릅니다.',
            },
          ],
        },
      }),
    ),
  );
  expect(
    await screen.findByText('삽입 1개 · 갱신 2개 · 실패 1개'),
  ).toBeInTheDocument();
  expect(screen.getByText(/#99 · EN_US · 문장이 다릅니다/)).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
  );
});
