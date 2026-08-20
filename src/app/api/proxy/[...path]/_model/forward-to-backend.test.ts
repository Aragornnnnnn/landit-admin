// @vitest-environment node
// BFF 프록시 규칙 검증 — 화이트리스트·CSRF·Bearer 부착·401 갱신 1회·no-store·토큰 비노출 (docs/auth.md "테스트로 고정할 것")
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionCookieNames } from '@/shared/auth/session-cookie';

import {
  forwardToBackend,
  resetRefreshCacheForTests,
  type ForwardDeps,
} from './forward-to-backend';

const names = sessionCookieNames(false);
const API = 'https://api.test';

beforeEach(() => resetRefreshCacheForTests());

// 우리 오리진에서 온 요청처럼 만든다. 기본은 access 쿠키 있음 + same-origin
function incoming(
  path: string,
  init: RequestInit & { cookie?: string | null; site?: string | null } = {},
) {
  const headers = new Headers(init.headers);
  const cookie =
    init.cookie === undefined
      ? `${names.access}=acc; ${names.refresh}=ref`
      : init.cookie;
  if (cookie) headers.set('cookie', cookie);
  if (init.site !== null)
    headers.set('sec-fetch-site', init.site ?? 'same-origin');
  if (init.body && !headers.has('content-type'))
    headers.set('content-type', 'application/json');
  return new Request(`https://admin.test/api/proxy/${path}`, {
    ...init,
    headers,
  });
}

function deps(
  fetchImpl: ForwardDeps['fetch'],
  overrides: Partial<ForwardDeps> = {},
): ForwardDeps {
  return {
    fetch: fetchImpl,
    apiBaseUrl: API,
    cookieNames: names,
    cookieSecurity: { secure: false },
    ...overrides,
  };
}

const ok = (body: unknown = { success: true, data: 1 }) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
const unauthorized = () =>
  new Response(JSON.stringify({ success: false }), { status: 401 });

describe('화이트리스트', () => {
  it.each([
    ['api/v1/admin/users', 'GET'],
    ['api/v1/admin/mailbox/letters/3', 'PATCH'],
    ['api/v1/auth/logout', 'POST'],
  ])('%s %s는 BE로 전달한다', async (path, method) => {
    const fetchMock = vi.fn<ForwardDeps['fetch']>(async () => ok());

    const res = await forwardToBackend(
      incoming(path, { method, body: method === 'GET' ? undefined : '{}' }),
      path.split('/'),
      deps(fetchMock),
    );

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['api/v1/scenarios', '사용자 API'],
    ['api/v1/auth/social-login', '로그인(전용 route handler가 따로 있다)'],
    ['api/v1/admin/../me', '경로 이탈'],
    ['actuator/health', '관리 엔드포인트'],
  ])('%s(%s)는 BE를 부르지 않고 404를 준다', async (path) => {
    const fetchMock = vi.fn<ForwardDeps['fetch']>(async () => ok());

    const res = await forwardToBackend(
      incoming(path),
      path.split('/'),
      deps(fetchMock),
    );

    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [
      ['api', 'v1', 'admin', '../../../auth/token/refresh'],
      '%2F 인코딩된 점 세그먼트',
    ],
    [['api', 'v1', 'admin', 'users?x=1'], '세그먼트 안 ?'],
    [['api', 'v1', 'admin', 'users#x'], '세그먼트 안 #'],
    [['api', 'v1', 'admin', 'a\\b'], '세그먼트 안 역슬래시'],
  ])(
    'Next가 세그먼트를 디코드해 %j(%s)로 들어와도 BE를 부르지 않고 404를 준다',
    async (segments) => {
      const fetchMock = vi.fn<ForwardDeps['fetch']>(async () => ok());

      const res = await forwardToBackend(
        incoming(segments.map(encodeURIComponent).join('/')),
        segments,
        deps(fetchMock),
      );

      expect(res.status).toBe(404);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
});

describe('CSRF', () => {
  it('변경 요청의 Sec-Fetch-Site가 same-origin이 아니면 403이고 BE를 부르지 않는다', async () => {
    const fetchMock = vi.fn<ForwardDeps['fetch']>(async () => ok());

    const res = await forwardToBackend(
      incoming('api/v1/admin/mailbox/replies', {
        method: 'POST',
        body: '{}',
        site: 'cross-site',
      }),
      ['api', 'v1', 'admin', 'mailbox', 'replies'],
      deps(fetchMock),
    );

    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('Sec-Fetch-Site가 없으면 Origin이 요청 호스트와 같을 때만 통과한다', async () => {
    const fetchMock = vi.fn<ForwardDeps['fetch']>(async () => ok());
    const path = ['api', 'v1', 'admin', 'mailbox', 'replies'];

    const same = await forwardToBackend(
      incoming('api/v1/admin/mailbox/replies', {
        method: 'POST',
        body: '{}',
        site: null,
        headers: { origin: 'https://admin.test' },
      }),
      path,
      deps(fetchMock),
    );
    const other = await forwardToBackend(
      incoming('api/v1/admin/mailbox/replies', {
        method: 'POST',
        body: '{}',
        site: null,
        headers: { origin: 'https://evil.test' },
      }),
      path,
      deps(fetchMock),
    );

    expect(same.status).toBe(200);
    expect(other.status).toBe(403);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('조회(GET)는 Sec-Fetch-Site를 따지지 않는다 — 쿠키만으로는 응답을 읽을 수 없다(SameSite=Strict·CORS)', async () => {
    const fetchMock = vi.fn<ForwardDeps['fetch']>(async () => ok());

    const res = await forwardToBackend(
      incoming('api/v1/admin/users', { site: 'cross-site' }),
      ['api', 'v1', 'admin', 'users'],
      deps(fetchMock),
    );

    expect(res.status).toBe(200);
  });
});

describe('전달', () => {
  it('access 쿠키를 Bearer로 붙이고 쿠키 자체는 BE로 보내지 않는다', async () => {
    const fetchMock = vi.fn<ForwardDeps['fetch']>(async () => ok());

    await forwardToBackend(
      incoming('api/v1/admin/users?page=2'),
      ['api', 'v1', 'admin', 'users'],
      deps(fetchMock),
    );

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const sent = new Headers(init.headers);
    expect(url).toBe(`${API}/api/v1/admin/users?page=2`);
    expect(sent.get('authorization')).toBe('Bearer acc');
    expect(sent.has('cookie')).toBe(false);
  });

  it('세션 쿠키가 아예 없으면 BE를 부르지 않고 401을 준다', async () => {
    const fetchMock = vi.fn<ForwardDeps['fetch']>(async () => ok());

    const res = await forwardToBackend(
      incoming('api/v1/admin/users', { cookie: null }),
      ['api', 'v1', 'admin', 'users'],
      deps(fetchMock),
    );

    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('응답에는 Cache-Control: no-store를 붙이고 BE body는 그대로 돌려준다', async () => {
    const res = await forwardToBackend(
      incoming('api/v1/admin/users'),
      ['api', 'v1', 'admin', 'users'],
      deps(async () => ok({ success: true, data: { items: [] } })),
    );

    expect(res.headers.get('cache-control')).toBe('no-store');
    await expect(res.json()).resolves.toEqual({
      success: true,
      data: { items: [] },
    });
  });
});

describe('401 갱신', () => {
  const refreshed = () =>
    ok({
      success: true,
      data: {
        accessToken: 'acc2',
        accessTokenExpiresIn: 1800,
        refreshToken: 'ref2',
        refreshTokenExpiresIn: 1209600,
      },
    });

  it('401이면 refresh 쿠키로 재발급받아 한 번 재시도하고 새 쿠키를 Set-Cookie로 내린다', async () => {
    const fetchMock = vi
      .fn<ForwardDeps['fetch']>()
      .mockResolvedValueOnce(unauthorized()) // 원 요청
      .mockResolvedValueOnce(refreshed()) // refresh
      .mockResolvedValueOnce(ok({ success: true, data: 'after' })); // 재시도

    const res = await forwardToBackend(
      incoming('api/v1/admin/users'),
      ['api', 'v1', 'admin', 'users'],
      deps(fetchMock),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true, data: 'after' });
    const refreshCall = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(refreshCall[0]).toBe(`${API}/api/v1/auth/token/refresh`);
    expect(JSON.parse(refreshCall[1].body as string)).toEqual({
      refreshToken: 'ref',
    });
    const retry = new Headers(
      (fetchMock.mock.calls[2] as [string, RequestInit])[1].headers,
    );
    expect(retry.get('authorization')).toBe('Bearer acc2');
    const setCookies = res.headers.getSetCookie();
    expect(setCookies.some((c) => c.startsWith(`${names.access}=acc2;`))).toBe(
      true,
    );
    expect(setCookies.some((c) => c.startsWith(`${names.refresh}=ref2;`))).toBe(
      true,
    );
    expect(setCookies.every((c) => c.includes('HttpOnly'))).toBe(true);
  });

  it('refresh도 실패하면 쿠키를 지우고 401을 준다 — 세션 끝', async () => {
    const fetchMock = vi
      .fn<ForwardDeps['fetch']>()
      .mockResolvedValueOnce(unauthorized())
      .mockResolvedValueOnce(unauthorized());

    const res = await forwardToBackend(
      incoming('api/v1/admin/users'),
      ['api', 'v1', 'admin', 'users'],
      deps(fetchMock),
    );

    expect(res.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const setCookies = res.headers.getSetCookie();
    expect(setCookies).toHaveLength(2);
    expect(setCookies.every((c) => c.includes('Max-Age=0'))).toBe(true);
  });

  it('refresh 쿠키가 없으면 갱신을 시도하지 않고 401을 준다', async () => {
    const fetchMock = vi
      .fn<ForwardDeps['fetch']>()
      .mockResolvedValueOnce(unauthorized());

    const res = await forwardToBackend(
      incoming('api/v1/admin/users', { cookie: `${names.access}=acc` }),
      ['api', 'v1', 'admin', 'users'],
      deps(fetchMock),
    );

    expect(res.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('refresh 경로 자체가 401이어도 다시 갱신하지 않는다 — 무한 루프 방지', async () => {
    const fetchMock = vi
      .fn<ForwardDeps['fetch']>()
      .mockResolvedValue(unauthorized());

    const res = await forwardToBackend(
      incoming('api/v1/auth/token/refresh', { method: 'POST', body: '{}' }),
      ['api', 'v1', 'auth', 'token', 'refresh'],
      deps(fetchMock),
    );

    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('같은 refresh 토큰으로 동시에 401이 나면 갱신 요청은 한 번만 나간다 — BE refresh는 회전형이라 두 번째는 실패한다', async () => {
    let refreshCalls = 0;
    // 각 경로의 첫 호출은 401, 재시도(두 번째)는 200
    const seen = new Set<string>();
    const fetchMock = vi.fn<ForwardDeps['fetch']>(async (url) => {
      if (url.endsWith('/auth/token/refresh')) {
        refreshCalls += 1;
        await new Promise((r) => setTimeout(r, 5));
        return refreshed();
      }
      if (seen.has(url)) return ok();
      seen.add(url);
      return unauthorized();
    });

    const [a, b] = await Promise.all([
      forwardToBackend(
        incoming('api/v1/admin/users'),
        ['api', 'v1', 'admin', 'users'],
        deps(fetchMock),
      ),
      forwardToBackend(
        incoming('api/v1/admin/app-versions'),
        ['api', 'v1', 'admin', 'app-versions'],
        deps(fetchMock),
      ),
    ]);

    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(refreshCalls).toBe(1);
  });
});

describe('갱신 뒤 규칙', () => {
  const refreshed = () =>
    ok({
      success: true,
      data: {
        accessToken: 'acc2',
        accessTokenExpiresIn: 1800,
        refreshToken: 'ref2',
        refreshTokenExpiresIn: 1209600,
      },
    });

  it('새 토큰으로 재시도해도 401이면 쿠키를 지우고 세션을 끝낸다 — 로그인↔보호 경로 루프 방지', async () => {
    const fetchMock = vi
      .fn<ForwardDeps['fetch']>()
      .mockResolvedValueOnce(unauthorized())
      .mockResolvedValueOnce(refreshed())
      .mockResolvedValueOnce(unauthorized());

    const res = await forwardToBackend(
      incoming('api/v1/admin/users'),
      ['api', 'v1', 'admin', 'users'],
      deps(fetchMock),
    );

    expect(res.status).toBe(401);
    const setCookies = res.headers.getSetCookie();
    expect(setCookies.every((c) => c.includes('Max-Age=0'))).toBe(true);
  });

  it('갱신 직후 옛 refresh 토큰으로 온 다음 요청은 다시 갱신하지 않고 같은 새 토큰을 쓴다 — 회전형 BE에서 세션이 끊기지 않게', async () => {
    const fetchMock = vi
      .fn<ForwardDeps['fetch']>()
      .mockResolvedValueOnce(unauthorized()) // A 원 요청
      .mockResolvedValueOnce(refreshed()) // A refresh
      .mockResolvedValueOnce(ok()) // A 재시도
      .mockResolvedValueOnce(unauthorized()) // B 원 요청 (옛 access)
      .mockResolvedValueOnce(ok()); // B 재시도 — refresh 없이 캐시된 acc2

    const a = await forwardToBackend(
      incoming('api/v1/admin/users'),
      ['api', 'v1', 'admin', 'users'],
      deps(fetchMock),
    );
    const b = await forwardToBackend(
      incoming('api/v1/admin/app-versions'),
      ['api', 'v1', 'admin', 'app-versions'],
      deps(fetchMock),
    );

    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    const refreshCalls = fetchMock.mock.calls.filter(([url]) =>
      url.endsWith('/auth/token/refresh'),
    );
    expect(refreshCalls).toHaveLength(1);
    const bRetry = new Headers(fetchMock.mock.calls[4][1].headers);
    expect(bRetry.get('authorization')).toBe('Bearer acc2');
  });

  it('API_BASE_URL에 경로 prefix가 있어도 그 아래로 전달한다', async () => {
    const fetchMock = vi.fn<ForwardDeps['fetch']>(async () => ok());

    await forwardToBackend(
      incoming('api/v1/admin/users'),
      ['api', 'v1', 'admin', 'users'],
      deps(fetchMock, { apiBaseUrl: 'https://gw.test/landit' }),
    );

    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://gw.test/landit/api/v1/admin/users',
    );
  });
});

describe('403', () => {
  it('BE 403은 그대로 전달한다 — 클라이언트가 "관리자 아님" 화면을 띄운다', async () => {
    const res = await forwardToBackend(
      incoming('api/v1/admin/users'),
      ['api', 'v1', 'admin', 'users'],
      deps(
        async () =>
          new Response(
            JSON.stringify({ success: false, error: { code: 'FORBIDDEN' } }),
            { status: 403 },
          ),
      ),
    );

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toMatchObject({
      error: { code: 'FORBIDDEN' },
    });
  });
});
