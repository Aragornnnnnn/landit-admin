// 공지를 발행하는 중에 편집기를 닫아도 선택한 푸시 요청이 이어지는지 검증한다.
import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { api } from '@/shared/api/client';

import {
  EMPTY_NOTICE_PUSH_SELECTION,
  toNoticePushAudience,
} from './notice-push-audience';
import { useLetterActionMutation } from './useLetterActionMutation';

vi.mock('@/shared/api/client', () => ({
  api: { patch: vi.fn(), post: vi.fn() },
}));

it('발행을 확인한 뒤 편집기를 떠나면 발행 성공 후 푸시 요청을 이어간다', async () => {
  let finishPublish: (() => void) | undefined;
  const publication = new Promise<void>((resolve) => {
    finishPublish = resolve;
  });
  vi.mocked(api.patch).mockReturnValueOnce(publication);
  vi.mocked(api.post).mockResolvedValueOnce([]);
  const audience = toNoticePushAudience(EMPTY_NOTICE_PUSH_SELECTION);
  const client = new QueryClient();
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result, unmount } = renderHook(() => useLetterActionMutation(), {
    wrapper,
  });

  act(() =>
    result.current.mutate({
      letterId: 42,
      action: 'publish',
      sendPushOnPublish: audience,
    }),
  );
  unmount();
  expect(api.post).not.toHaveBeenCalled();
  finishPublish?.();

  await waitFor(() =>
    expect(api.post).toHaveBeenCalledWith(
      '/api/v1/admin/push-campaigns/notice/42/send',
      audience,
    ),
  );
});
