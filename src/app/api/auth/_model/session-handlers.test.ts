// @vitest-environment node
// 로그인·로그아웃 route handler 규칙 검증 — 토큰은 쿠키로만, body엔 user만, 로그아웃은 BE가 실패해도 쿠키를 지운다
import { describe, expect, it, vi } from 'vitest';

import { sessionCookieNames } from '@/shared/auth/session-cookie';

import {
  completeSocialLogin,
  logoutSession,
  type SessionHandlerDeps,
} from './session-handlers';

const names = sessionCookieNames(false);
const API = 'https://api.test';

const deps = (fetchImpl: SessionHandlerDeps['fetch']): SessionHandlerDeps => ({
  fetch: fetchImpl,
  apiBaseUrl: API,
  cookieNames: names,
  cookieSecurity: { secure: false },
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const loginRequest = (body: unknown, site = 'same-origin') =>
  new Request('https://admin.test/api/auth/social-login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'sec-fetch-site': site },
    body: JSON.stringify(body),
  });

const tokenResponse = {
  success: true,
  data: {
    tokenType: 'Bearer',
    accessToken: 'acc',
    accessTokenExpiresIn: 1800,
    refreshToken: 'ref',
    refreshTokenExpiresIn: 1209600,
    user: {
      userId: 7,
      nickname: '준서',
      email: 'a@b.c',
      provider: 'KAKAO',
      newUser: false,
    },
  },
};

describe('completeSocialLogin', () => {
  it('BE 로그인 성공이면 토큰을 httpOnly 쿠키로 심고 body엔 user만 준다', async () => {
    const fetchMock = vi
      .fn<SessionHandlerDeps['fetch']>()
      .mockResolvedValueOnce(json(tokenResponse));

    const res = await completeSocialLogin(
      loginRequest({ provider: 'kakao', idToken: 'id', nonce: 'n' }),
      deps(fetchMock),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ user: tokenResponse.data.user });
    expect(JSON.stringify(body)).not.toMatch(/acc|ref/);
    const cookies = res.headers.getSetCookie();
    expect(cookies.some((c) => c.startsWith(`${names.access}=acc;`))).toBe(
      true,
    );
    expect(cookies.some((c) => c.startsWith(`${names.refresh}=ref;`))).toBe(
      true,
    );
    expect(
      cookies.every((c) => /HttpOnly/.test(c) && /SameSite=Strict/.test(c)),
    ).toBe(true);
    expect(cookies.find((c) => c.startsWith(names.access))).toContain(
      'Max-Age=1800',
    );
    expect(cookies.find((c) => c.startsWith(names.refresh))).toContain(
      'Max-Age=1209600',
    );
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('BE에 provider·idToken·nonce를 그대로 넘긴다', async () => {
    const fetchMock = vi
      .fn<SessionHandlerDeps['fetch']>()
      .mockResolvedValueOnce(json(tokenResponse));

    await completeSocialLogin(
      loginRequest({ provider: 'google', idToken: 'id', nonce: 'n' }),
      deps(fetchMock),
    );

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API}/api/v1/auth/social-login`);
    expect(JSON.parse(init.body as string)).toEqual({
      provider: 'google',
      idToken: 'id',
      nonce: 'n',
    });
  });

  it('BE가 실패 봉투를 주면 같은 상태·메시지로 돌려주고 쿠키는 심지 않는다', async () => {
    const fetchMock = vi
      .fn<SessionHandlerDeps['fetch']>()
      .mockResolvedValueOnce(
        json(
          {
            success: false,
            error: {
              code: 'OIDC_NONCE_MISMATCH',
              message: '검증 값이 달라요.',
            },
          },
          401,
        ),
      );

    const res = await completeSocialLogin(
      loginRequest({ provider: 'google', idToken: 'id', nonce: 'n' }),
      deps(fetchMock),
    );

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toMatchObject({
      error: { code: 'OIDC_NONCE_MISMATCH', message: '검증 값이 달라요.' },
    });
    expect(res.headers.getSetCookie()).toHaveLength(0);
  });

  it.each<[Record<string, string>, string]>([
    [{ provider: 'kakao', idToken: 'id' }, 'nonce 없음'],
    [
      { provider: 'naver', idToken: 'id', nonce: 'n' },
      '지원하지 않는 provider',
    ],
    [{ idToken: 'id', nonce: 'n' }, 'provider 없음'],
  ])('요청이 %o(%s)이면 BE를 부르지 않고 400', async (body) => {
    const fetchMock = vi.fn<SessionHandlerDeps['fetch']>();

    const res = await completeSocialLogin(loginRequest(body), deps(fetchMock));

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('교차 사이트에서 온 요청은 403 — 로그인 CSRF(공격자 계정으로 세션 심기) 방지', async () => {
    const fetchMock = vi.fn<SessionHandlerDeps['fetch']>();

    const res = await completeSocialLogin(
      loginRequest(
        { provider: 'kakao', idToken: 'id', nonce: 'n' },
        'cross-site',
      ),
      deps(fetchMock),
    );

    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('logoutSession', () => {
  const logoutRequest = (cookie?: string) =>
    new Request('https://admin.test/api/auth/logout', {
      method: 'POST',
      headers: {
        'sec-fetch-site': 'same-origin',
        ...(cookie ? { cookie } : {}),
      },
    });

  it('refresh 쿠키로 BE 로그아웃을 부르고 두 쿠키를 지운다', async () => {
    const fetchMock = vi
      .fn<SessionHandlerDeps['fetch']>()
      .mockResolvedValueOnce(json({ success: true }));

    const res = await logoutSession(
      logoutRequest(`${names.access}=acc; ${names.refresh}=ref`),
      deps(fetchMock),
    );

    expect(res.status).toBe(204);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API}/api/v1/auth/logout`);
    expect(JSON.parse(init.body as string)).toEqual({ refreshToken: 'ref' });
    expect(new Headers(init.headers).get('authorization')).toBe('Bearer acc');
    const cookies = res.headers.getSetCookie();
    expect(cookies).toHaveLength(2);
    expect(cookies.every((c) => c.includes('Max-Age=0'))).toBe(true);
  });

  it('BE 로그아웃이 실패하거나 네트워크가 죽어도 쿠키는 지운다', async () => {
    const fetchMock = vi
      .fn<SessionHandlerDeps['fetch']>()
      .mockRejectedValueOnce(new Error('network'));

    const res = await logoutSession(
      logoutRequest(`${names.refresh}=ref`),
      deps(fetchMock),
    );

    expect(res.status).toBe(204);
    expect(res.headers.getSetCookie()).toHaveLength(2);
  });

  it('쿠키가 없으면 BE를 부르지 않고 쿠키 삭제만 한다', async () => {
    const fetchMock = vi.fn<SessionHandlerDeps['fetch']>();

    const res = await logoutSession(logoutRequest(), deps(fetchMock));

    expect(res.status).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
