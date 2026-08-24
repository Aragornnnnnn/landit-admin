// 콜백 흐름(complete-social-login)이 쓰는 실제 HTTP 배선 — 교환·세션 발급·세션 종료. 페이지는 이걸 끼우기만 한다
import { parseApiResponse } from '@/shared/api/parse';

import type { CallbackDeps } from './complete-social-login';

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseApiResponse<T>(response, url);
}

export const loginGateway: CallbackDeps = {
  exchangeCode: async (input) => {
    const { idToken } = await postJson<{ idToken: string }>(
      '/api/auth/oauth-token',
      input,
    );
    return idToken;
  },
  establishSession: async (input) => {
    // 관리자 판정도 이 응답의 role로 한다(LAN-337) — 별도 admin 호출이 필요 없다
    const { user } = await postJson<{
      user: {
        email?: string | null;
        nickname?: string | null;
        role?: string | null;
      } | null;
    }>('/api/auth/social-login', input);
    return user ?? {};
  },
  endSession: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
  },
};
