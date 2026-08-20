// @vitest-environment node
// 세션 쿠키 규칙 검증 — 이름·속성·파싱·삭제가 docs/auth.md "쿠키 속성"대로인지
import { describe, expect, it } from 'vitest';

import {
  clearSessionCookieHeaders,
  readSessionCookies,
  serializeSessionCookie,
  sessionCookieNames,
} from './session-cookie';

describe('sessionCookieNames', () => {
  it('프로덕션이면 __Host- 접두사를 붙인다 — Secure·Path=/·Domain 없음을 브라우저가 강제한다', () => {
    const names = sessionCookieNames(true);

    expect(names.access).toBe('__Host-landit-admin-access');
    expect(names.refresh).toBe('__Host-landit-admin-refresh');
  });

  it('로컬(비프로덕션)이면 접두사를 뺀다 — http://localhost는 Secure 쿠키를 못 심는다', () => {
    const names = sessionCookieNames(false);

    expect(names.access).toBe('landit-admin-access');
  });
});

describe('serializeSessionCookie', () => {
  it('HttpOnly·SameSite=Strict·Path=/·Max-Age를 항상 붙인다', () => {
    const header = serializeSessionCookie('landit-admin-access', 'tok', 1800, {
      secure: true,
    });

    expect(header).toMatch(/^landit-admin-access=tok; /);
    expect(header).toContain('HttpOnly');
    expect(header).toContain('SameSite=Strict');
    expect(header).toContain('Path=/');
    expect(header).toContain('Max-Age=1800');
    expect(header).toContain('Secure');
    expect(header).not.toMatch(/Domain=/);
  });

  it('비프로덕션이면 Secure만 뺀다', () => {
    const header = serializeSessionCookie('landit-admin-access', 'tok', 60, {
      secure: false,
    });

    expect(header).not.toContain('Secure');
    expect(header).toContain('HttpOnly');
  });

  it('값은 URL 인코딩한다 — 세미콜론 등이 쿠키 구분자와 섞이지 않게', () => {
    const header = serializeSessionCookie('n', 'a;b=c', 1, { secure: true });

    expect(header.startsWith('n=a%3Bb%3Dc;')).toBe(true);
  });
});

describe('readSessionCookies', () => {
  it('Cookie 헤더에서 access·refresh 값을 꺼낸다', () => {
    const cookies = readSessionCookies(
      'foo=1; landit-admin-access=acc; landit-admin-refresh=ref',
      sessionCookieNames(false),
    );

    expect(cookies).toEqual({ access: 'acc', refresh: 'ref' });
  });

  it('헤더가 없거나 쿠키가 없으면 undefined로 둔다', () => {
    expect(readSessionCookies(null, sessionCookieNames(false))).toEqual({
      access: undefined,
      refresh: undefined,
    });
  });

  it('URL 인코딩된 값은 되돌린다', () => {
    const cookies = readSessionCookies(
      'landit-admin-access=a%3Bb',
      sessionCookieNames(false),
    );

    expect(cookies.access).toBe('a;b');
  });
});

describe('clearSessionCookieHeaders', () => {
  it('두 쿠키를 Max-Age=0으로 지우는 Set-Cookie 두 개를 만든다', () => {
    const headers = clearSessionCookieHeaders(sessionCookieNames(true), {
      secure: true,
    });

    expect(headers).toHaveLength(2);
    expect(headers[0]).toMatch(/^__Host-landit-admin-access=; .*Max-Age=0/);
    expect(headers[1]).toMatch(/^__Host-landit-admin-refresh=; .*Max-Age=0/);
  });
});
