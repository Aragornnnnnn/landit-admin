// 백엔드 공통 응답 포맷 { success, data, error }
import { ApiError } from './api-error';

interface ApiBody {
  success: boolean;
  data?: unknown;
  error?: { code?: string; message?: string };
}

// 호스트·쿼리를 떼고 경로만 — 같은 API 실패를 한 태그로 모은다
function endpointOf(response: Response): string {
  try {
    return new URL(response.url).pathname;
  } catch {
    // url이 없는 Response(직접 만든 객체)면 빈 값 — 태그만 비고 파싱은 계속한다
    return response.url || '';
  }
}

/**
 * 백엔드 공통 응답 봉투(`{ success, data, error }`)를 해석한다.
 *
 * @typeParam T 성공 시 `data`의 타입 — 호출부가 기대하는 타입을 그대로 신뢰한다 (런타임 검증 없음)
 * @throws ApiError 실패 응답이거나 공통 봉투가 아닌 응답(스프링 기본 에러 페이지 등)이면
 */
export async function parseApiResponse<T>(
  response: Response,
  // 프록시를 거친 응답은 url이 /api/proxy/…라 태그가 갈린다 — 호출자가 BE 경로를 알면 그걸 쓴다
  endpoint: string = endpointOf(response),
): Promise<T> {
  let body: ApiBody | null = null;
  try {
    body = (await response.json()) as ApiBody;
  } catch {
    // JSON이 아닌 응답(스프링 기본 에러 페이지 등) — 아래 상태코드 분기로 처리
  }

  if (body?.success) return body.data as T;

  throw new ApiError(
    // 공통 봉투 없이 온 실패(스프링 기본 에러 페이지 등)는 상태코드를 붙인 기본 문구로
    body?.error?.message ?? `서버 오류가 발생했어요. (${response.status})`,
    response.status,
    endpoint,
    body?.error?.code,
  );
}
