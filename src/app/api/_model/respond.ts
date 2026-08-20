// route handler 공통 응답 — BE와 같은 봉투({ success, data | error })에 no-store를 항상 붙인다. 토큰은 어떤 응답에도 싣지 않는다
import 'server-only';

const NO_STORE = { 'cache-control': 'no-store' } as const;

export function apiSuccess(data: unknown, extraHeaders?: string[][]): Response {
  const headers = new Headers({
    'content-type': 'application/json',
    ...NO_STORE,
  });
  for (const [name, value] of extraHeaders ?? []) headers.append(name, value);
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers,
  });
}

export function apiFailure(
  status: number,
  code: string,
  message?: string,
  extraHeaders?: string[][],
): Response {
  const headers = new Headers({
    'content-type': 'application/json',
    ...NO_STORE,
  });
  for (const [name, value] of extraHeaders ?? []) headers.append(name, value);
  return new Response(
    JSON.stringify({ success: false, error: { code, message } }),
    { status, headers },
  );
}
