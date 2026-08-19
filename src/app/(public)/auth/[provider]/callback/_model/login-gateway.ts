// 콜백 흐름(complete-social-login)이 쓰는 실제 HTTP 배선 — 교환·세션 발급·관리자 판정·세션 종료. 페이지는 이걸 끼우기만 한다
import { ApiError } from '@/shared/api/api-error';
import { parseApiResponse } from '@/shared/api/parse';

import type { CallbackDeps } from './complete-social-login';

// 관리자 판정 — 가장 가벼운 admin 조회의 403을 본다. BE에 /auth/me가 생기면 여기만 바꾼다.
// api 클라이언트가 아니라 fetch를 직접 쓴다 — 클라이언트의 401 자동 이동이 콜백 화면에서 끼어들지 않게
const ADMIN_PROBE_PATH = '/api/proxy/api/v1/admin/app-versions';

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
    const { user } = await postJson<{
      user: { email?: string | null; nickname?: string | null } | null;
    }>('/api/auth/social-login', input);
    return user ?? {};
  },
  probeAdmin: async () => {
    const response = await fetch(ADMIN_PROBE_PATH, { cache: 'no-store' });
    if (response.status === 403) {
      throw new ApiError('관리자 아님', 403, ADMIN_PROBE_PATH, 'FORBIDDEN');
    }
  },
  endSession: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
  },
};
