// api 클라이언트 검증 — 프록시 경로로 보내는지, 401이면 로그인으로 보내는지, 403은 그대로 던지는지
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from './api-error';
import { api } from './client';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

describe('api', () => {
  const fetchMock = vi.fn();
  const assign = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    // jsdom의 location은 navigation을 구현하지 않아 assign만 목한다
    vi.stubGlobal('location', {
      ...window.location,
      origin: window.location.origin,
      pathname: '/feedbacks',
      search: '?page=2',
      assign,
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('BE 경로를 그대로 주면 /api/proxy 아래로 보내고 data를 돌려준다', async () => {
    fetchMock.mockResolvedValueOnce(json({ success: true, data: { a: 1 } }));

    const data = await api.get<{ a: number }>('/api/v1/admin/users?page=1');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/proxy/api/v1/admin/users?page=1',
      expect.objectContaining({ method: 'GET', cache: 'no-store' }),
    );
    expect(data).toEqual({ a: 1 });
  });

  it('body가 있으면 JSON으로 직렬화하고 content-type을 붙인다', async () => {
    fetchMock.mockResolvedValueOnce(json({ success: true, data: null }));

    await api.post('/api/v1/admin/mailbox/replies', { feedbackIds: [1] });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBe(JSON.stringify({ feedbackIds: [1] }));
    expect(new Headers(init.headers).get('content-type')).toBe(
      'application/json',
    );
  });

  it('401이면 현재 위치를 next로 붙여 /login으로 보내고 ApiError를 던진다', async () => {
    fetchMock.mockResolvedValueOnce(json({ success: false }, 401));

    await expect(api.get('/api/v1/admin/users')).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(assign).toHaveBeenCalledWith(
      `${window.location.origin}/login?next=%2Ffeedbacks%3Fpage%3D2`,
    );
  });

  it('403(관리자 아님)은 리다이렉트 없이 status를 보존한 ApiError로 던진다', async () => {
    fetchMock.mockResolvedValueOnce(
      json({ success: false, error: { code: 'FORBIDDEN' } }, 403),
    );

    const thrown = await api.get('/api/v1/admin/users').catch((e) => e);

    expect(thrown).toBeInstanceOf(ApiError);
    expect((thrown as ApiError).status).toBe(403);
    expect(assign).not.toHaveBeenCalled();
  });
});
