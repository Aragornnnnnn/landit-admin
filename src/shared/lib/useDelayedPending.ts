'use client';

// 로딩 표시를 조금 늦춘다 — 200ms 안에 응답이 오면 스켈레톤을 아예 그리지 않아 깜빡임이 없다 (docs/admin-spec.md "공통 상태")
import { useEffect, useState } from 'react';

/** 이 시간(ms) 안에 끝나는 로딩은 표시하지 않는다 */
export const PENDING_DELAY_MS = 200;

/**
 * 로딩이 이 시간보다 길어질 때만 true가 된다.
 *
 * @param isPending 진행 중인가 (예: react-query의 isPending)
 * @param delayMs 이 시간이 지나야 표시한다. 기본 200ms
 * @returns 스켈레톤·스피너를 그릴지 여부
 */
export function useDelayedPending(
  isPending: boolean,
  delayMs: number = PENDING_DELAY_MS,
): boolean {
  // 표시 여부는 "진행 중인가"와 "충분히 오래 걸렸나"의 곱이다 — 진행이 끝나면 계산만으로 바로 사라진다
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (!isPending) return;
    const timer = setTimeout(() => setElapsed(true), delayMs);
    // 다음 로딩이 다시 처음부터 기다리도록 정리 시점에 되돌린다
    return () => {
      clearTimeout(timer);
      setElapsed(false);
    };
  }, [isPending, delayMs]);

  return isPending && elapsed;
}
