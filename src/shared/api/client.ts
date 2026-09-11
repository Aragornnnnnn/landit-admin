// API 호출 진입점 — api.get/post/… 로 부르면 같은 오리진 프록시(/api/proxy)로 보낸다. 토큰은 쿠키에 있어 클라이언트는 모른다
import { isPublicPath, loginRedirectPath } from '@/shared/auth/route-guard';

import { ApiError } from './api-error';
import { parseApiResponse } from './parse';

const PROXY_PREFIX = '/api/proxy';

/**
 * API 호출 진입점. 경로는 BE 경로 그대로(`/api/v1/admin/users`) 쓰면 프록시가 붙여 보낸다.
 * 401(세션 끝)이면 로그인 화면으로 보낸다. 403(관리자 아님)은 ApiError로 던져 화면이 처리한다.
 *
 * @typeParam T 성공 응답 `data`의 타입 — schema.d.ts 타입을 feature api에서 좁혀 넘긴다
 * @throws ApiError 실패 응답이면 (endpoint·status·code 포함 — reportError가 태그로 승격)
 */
export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
};

interface RequestOptions {
  /** 요청별 추가 헤더 — 예: 푸시 캠페인의 `Idempotency-Key`. 프록시가 넘기는 헤더만 BE에 닿는다 */
  headers?: Record<string, string>;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (body !== undefined) headers.set('content-type', 'application/json');
  const response = await fetch(`${PROXY_PREFIX}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    // 브라우저 캐시도 쓰지 않는다 — 프록시가 no-store를 주지만 이중으로
    cache: 'no-store',
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new ApiError(
      '세션이 만료됐어요. 다시 로그인해 주세요.',
      401,
      path,
      'SESSION_EXPIRED',
    );
  }

  return parseApiResponse<T>(response, path.split('?')[0]);
}

// 전체 페이지 이동 — 메모리(React Query 캐시·상태)가 통째로 비워져 다음 계정에 이전 데이터가 남지 않는다.
// 로그인·콜백(공개 경로)에서 난 401은 그 화면이 스스로 처리한다 — 여기서 이동하면 콜백 URL이 next에 담겨 되돌아온다
function redirectToLogin() {
  if (typeof window === 'undefined') return;
  if (isPublicPath(window.location.pathname)) return;
  const next = window.location.pathname + window.location.search;
  window.location.assign(
    new URL(loginRedirectPath(next), window.location.origin).href,
  );
}
