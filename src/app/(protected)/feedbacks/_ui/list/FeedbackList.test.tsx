// 피드백 다중 선택과 일괄 숨기기의 확인 및 실패 복구를 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import type { FeedbackItem } from '@/features/feedback/api/feedback-list';
import { api } from '@/shared/api/client';
import { reportError } from '@/shared/monitoring/report';

import { DEFAULT_FEEDBACK_FILTER } from '../../_model/list/feedback-filter';
import { FeedbackList } from './FeedbackList';

vi.mock('@/shared/api/client', () => ({ api: { post: vi.fn() } }));
vi.mock('@/shared/monitoring/report', () => ({ reportError: vi.fn() }));

const items: FeedbackItem[] = [
  { feedbackId: 7, status: 'PENDING', content: '첫 피드백' },
  { feedbackId: 8, status: 'PENDING', content: '둘째 피드백' },
  { feedbackId: 9, status: 'COMPLETED', content: '답장한 피드백' },
];
const hidePath = (id: number) => `/api/v1/admin/mailbox/feedbacks/${id}/hide`;

function renderFeedbackList(mobile = false) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: mobile,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  const onSelect = vi.fn();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <FeedbackList
        items={items}
        filter={DEFAULT_FEEDBACK_FILTER}
        isPending={false}
        isError={false}
        onSelect={onSelect}
        onRetry={vi.fn()}
        onResetFilter={vi.fn()}
      />
    </QueryClientProvider>,
  );
  return onSelect;
}

it('현재 페이지 전체를 선택하고 일부 숨기기에 실패하면 실패한 항목만 선택해 둔다', async () => {
  vi.mocked(api.post)
    .mockResolvedValueOnce(null)
    .mockRejectedValueOnce(new Error('일시적 요청 실패'));
  renderFeedbackList();

  await userEvent.click(
    screen.getByRole('button', { name: '현재 페이지 전체 선택' }),
  );
  await userEvent.click(
    screen.getByRole('button', { name: '어드민에서 숨기기' }),
  );
  const dialog = screen.getByRole('alertdialog');
  expect(dialog).toHaveTextContent('피드백 2건');
  expect(api.post).not.toHaveBeenCalled();
  await userEvent.click(within(dialog).getByRole('button', { name: '확인' }));

  await waitFor(() => expect(dialog).not.toBeInTheDocument());
  expect(vi.mocked(api.post).mock.calls).toEqual([
    [hidePath(7)],
    [hidePath(8)],
  ]);
  expect(reportError).toHaveBeenCalledOnce();
  expect(
    screen.getByRole('checkbox', { name: '첫 피드백 선택' }),
  ).not.toBeChecked();
  expect(
    screen.getByRole('checkbox', { name: '둘째 피드백 선택' }),
  ).toBeChecked();
  expect(
    screen.queryByRole('checkbox', { name: '답장한 피드백 선택' }),
  ).not.toBeInTheDocument();
});

it('모바일에서 체크박스를 누르면 상세를 열지 않고 숨기기를 취소하면 요청하지 않는다', async () => {
  const onSelect = renderFeedbackList(true);

  await userEvent.click(
    screen.getByRole('checkbox', { name: '첫 피드백 선택' }),
  );
  await userEvent.click(
    screen.getByRole('button', { name: '어드민에서 숨기기' }),
  );
  await userEvent.click(screen.getByRole('button', { name: '취소' }));

  expect(onSelect).not.toHaveBeenCalled();
  expect(api.post).not.toHaveBeenCalled();
  expect(
    screen.getByRole('checkbox', { name: '첫 피드백 선택' }),
  ).toBeChecked();
});
