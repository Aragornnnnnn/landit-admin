// 처리된 실패를 보고하는 단일 통로 — 도메인 코드는 이 두 함수만 부른다. 지금은 콘솔로만 남긴다(내부 도구라 외부 모니터링 없음).
// 나중에 Sentry 같은 수집기를 붙이게 되면 이 파일만 바꾼다.
import { ApiError } from '@/shared/api/api-error';

// API 실패면 endpoint·status·code를 함께 남긴다 — 같은 API 실패를 한눈에 모으기 위해
const apiContext = (failure: unknown) =>
  failure instanceof ApiError
    ? { endpoint: failure.endpoint, status: failure.status, code: failure.code }
    : undefined;

/**
 * 연산이 실패로 끝났음을 보고한다 — 데이터 유실·진행 불가 수준.
 *
 * @param error 잡은 예외
 * @param extra 함께 남길 컨텍스트. 사용자 식별 정보·토큰은 넣지 않는다
 */
export const reportError = (
  error: unknown,
  extra?: Record<string, unknown>,
) => {
  console.error('[admin] 실패', error, { ...apiContext(error), ...extra });
};

/**
 * 비정상이지만 감내하고 계속하는 상황을 보고한다.
 *
 * @param failure 잡은 예외, 또는 예외가 없는 상황이면 설명 문자열
 * @param extra 함께 남길 컨텍스트. 사용자 식별 정보·토큰은 넣지 않는다
 */
export const reportWarning = (
  failure: unknown,
  extra?: Record<string, unknown>,
) => {
  console.warn('[admin] 경고', failure, { ...apiContext(failure), ...extra });
};
