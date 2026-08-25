'use client';

// 콜백이 남긴 "관리자 아님" 안내를 마운트 후 한 번 읽는다 — sessionStorage는 외부 저장소라 useSyncExternalStore로 읽어
// 서버 렌더(null)와 첫 클라이언트 렌더가 어긋나지 않게 한다. 읽는 순간 저장소에서 지워지므로 값은 모듈에 잠시 들고 있는다
import { useSyncExternalStore } from 'react';

import {
  readForbiddenNotice,
  type ForbiddenNotice,
} from '@/shared/auth/forbidden-notice';

let current: ForbiddenNotice | null = null;
let consumed = false;
const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
};
const getSnapshot = () => {
  if (!consumed) {
    consumed = true;
    current = readForbiddenNotice();
  }
  return current;
};
const getServerSnapshot = () => null;

export function useForbiddenNotice() {
  const notice = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const dismiss = () => {
    current = null;
    listeners.forEach((l) => l());
  };
  return { notice, dismiss };
}
