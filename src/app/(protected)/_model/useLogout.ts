'use client';

// 로그아웃 — 서버가 BE 무효화 + 쿠키 삭제, 여기선 표시용 저장소를 지우고 전체 페이지 이동(메모리 캐시 초기화)
import { useState } from 'react';

import { clearAccountDisplay } from '@/shared/auth/account-display';
import { LOGIN_PATH } from '@/shared/auth/route-guard';

export function useLogout() {
  const [pending, setPending] = useState(false);

  const logout = async () => {
    if (pending) return;
    setPending(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      clearAccountDisplay();
      // 전체 이동 — React Query 캐시·상태가 통째로 비워져 다음 계정에 이전 데이터가 남지 않는다
      window.location.assign(new URL(LOGIN_PATH, window.location.origin).href);
    }
  };

  return { logout, pending };
}
