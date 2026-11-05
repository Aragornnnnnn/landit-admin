// 백엔드 API 실패를 구조로 보존하는 에러 — 모니터링 태그(endpoint·status·code)의 원천
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly endpoint: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** 화면에 보일 실패 문구 — BE가 준 메시지까지만, 없으면 호출부의 기본 문구 (docs/security.md "입력·출력") */
export function failureMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.message ? error.message : fallback;
}
