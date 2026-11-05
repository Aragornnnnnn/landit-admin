// 어드민 피드백 숨김이 확인 후에만 요청되는지 검증한다.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { api } from '@/shared/api/client';

import { HideFeedbackAction } from './HideFeedbackAction';

vi.mock('@/shared/api/client', () => ({
  api: { post: vi.fn().mockResolvedValue(null) },
}));

function renderHideAction() {
  const client = new QueryClient();
  const onHide = vi.fn();
  render(
    <QueryClientProvider client={client}>
      <HideFeedbackAction feedbackId={7} disabled={false} onHide={onHide} />
    </QueryClientProvider>,
  );
  return onHide;
}

describe('HideFeedbackAction', () => {
  it('숨김을 확인하면 어드민 숨김 API를 호출하고 상세를 닫는다', async () => {
    const onHide = renderHideAction();

    await userEvent.click(
      screen.getByRole('button', { name: '어드민에서 숨기기' }),
    );
    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(api.post).toHaveBeenCalledWith(
      '/api/v1/admin/mailbox/feedbacks/7/hide',
    );
    await waitFor(() => expect(onHide).toHaveBeenCalledOnce());
  });

  it('숨김 확인을 취소하면 요청하지 않는다', async () => {
    renderHideAction();

    await userEvent.click(
      screen.getByRole('button', { name: '어드민에서 숨기기' }),
    );
    await userEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(api.post).not.toHaveBeenCalled();
  });
});
