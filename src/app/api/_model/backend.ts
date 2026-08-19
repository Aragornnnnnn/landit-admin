// route handler들이 BE를 부를 때 쓰는 공통 의존성 — fetch(no-store·타임아웃)·BE 주소·쿠키 설정. 테스트는 이 모양을 가짜로 끼운다
import 'server-only';

import {
  currentSessionCookieConfig,
  type SessionCookieNames,
} from '@/shared/auth/session-cookie';
import { reportError } from '@/shared/monitoring/report';

import { apiFailure } from './respond';

export interface BackendDeps {
  fetch: (url: string, init: RequestInit) => Promise<Response>;
  /** 끝에 슬래시 없는 BE 주소. 경로 prefix가 있어도 그대로 둔다 */
  apiBaseUrl: string;
  cookieNames: SessionCookieNames;
  cookieSecurity: { secure: boolean };
}

// BE가 멈춰 있어도 요청이 무한정 매달리지 않게 — 관리자 화면은 15초면 충분히 길다
const BACKEND_TIMEOUT_MS = 15_000;

/** env·쿠키 설정으로 의존성을 만든다. `API_BASE_URL`이 없으면 null — 호출자는 `backendNotConfigured()`를 돌려준다 */
export function resolveBackendDeps(): BackendDeps | null {
  const apiBaseUrl = process.env.API_BASE_URL?.replace(/\/+$/, '');
  if (!apiBaseUrl) {
    reportError(new Error('API_BASE_URL이 설정되지 않았습니다'));
    return null;
  }
  const { names, security } = currentSessionCookieConfig();
  return {
    fetch: (url, init) =>
      fetch(url, {
        ...init,
        cache: 'no-store',
        signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
      }),
    apiBaseUrl,
    cookieNames: names,
    cookieSecurity: security,
  };
}

export const backendNotConfigured = () =>
  apiFailure(503, 'BACKEND_NOT_CONFIGURED');
