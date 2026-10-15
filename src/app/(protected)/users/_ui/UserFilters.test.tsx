// 지연된 URL 반영이 최신 검색 입력을 덮지 않는지 검증한다.
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { UserFilters } from './UserFilters';

afterEach(() => vi.useRealTimers());
it('이전 검색의 URL이 늦게 반영돼도 새 입력을 유지하고 그 입력을 검색한다', async () => {
  vi.useFakeTimers();
  const onChange = vi.fn();
  const { rerender } = render(
    <UserFilters
      filter={{ keyword: '', page: 0 }}
      loading={false}
      onChange={onChange}
    />,
  );
  const input = screen.getByRole('textbox', { name: '사용자 검색' });
  fireEvent.change(input, { target: { value: 'a' } });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(300);
  });
  expect(onChange).toHaveBeenLastCalledWith({ keyword: 'a' });
  fireEvent.change(input, { target: { value: 'ab' } });
  rerender(
    <UserFilters
      filter={{ keyword: 'a', page: 0 }}
      loading={false}
      onChange={onChange}
    />,
  );
  expect(input).toHaveValue('ab');
  await act(async () => {
    await vi.advanceTimersByTimeAsync(300);
  });
  expect(onChange).toHaveBeenLastCalledWith({ keyword: 'ab' });
  expect(input).toHaveAttribute('maxlength', '255');
});
