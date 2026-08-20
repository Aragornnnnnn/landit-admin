'use client';

// 사이드바 "내 계정" 닉네임 — 로그인 콜백이 sessionStorage에 남긴 표시용 값. 서버 렌더에선 null, 마운트 후 실제 값
import { useSyncExternalStore } from 'react';

import { readAccountDisplay } from '@/shared/auth/account-display';

const subscribeNoop = () => () => {};
const getSnapshot = () => readAccountDisplay()?.nickname ?? null;
const getServerSnapshot = () => null;

export function useAccountNickname() {
  return useSyncExternalStore(subscribeNoop, getSnapshot, getServerSnapshot);
}
