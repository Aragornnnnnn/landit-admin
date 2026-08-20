// 로딩 지연 표시 검증 — 짧은 로딩은 안 보이고, 긴 로딩만 보이며, 끝나면 즉시 사라진다
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDelayedPending } from './useDelayedPending';

describe('useDelayedPending', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('200ms 안에 끝나는 로딩은 표시하지 않는다 — 깜빡임 방지', () => {
    const { result, rerender } = renderHook(
      ({ pending }) => useDelayedPending(pending),
      { initialProps: { pending: true } },
    );

    act(() => {
      vi.advanceTimersByTime(150);
    });
    rerender({ pending: false });

    expect(result.current).toBe(false);
  });

  it('200ms를 넘겨 이어지면 표시한다', () => {
    const { result } = renderHook(() => useDelayedPending(true));

    expect(result.current).toBe(false);
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(true);
  });

  it('표시 중이던 로딩이 끝나면 바로 숨긴다', () => {
    const { result, rerender } = renderHook(
      ({ pending }) => useDelayedPending(pending),
      { initialProps: { pending: true } },
    );
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe(true);

    rerender({ pending: false });

    expect(result.current).toBe(false);
  });
});
