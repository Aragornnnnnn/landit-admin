// 라우트 가드·next 파라미터 규칙 검증 — 세션 없는 보호 경로는 /login으로, 오픈 리다이렉트는 거부
import { describe, expect, it } from 'vitest';

import { decideRouteGuard, safeNextPath } from './route-guard';

describe('decideRouteGuard', () => {
  it.each(['/', '/feedbacks', '/letters/3', '/users?page=2'])(
    '세션이 없으면 %s는 /login?next=로 보낸다',
    (path) => {
      const decision = decideRouteGuard({
        pathname: path.split('?')[0],
        search: path.includes('?') ? '?' + path.split('?')[1] : '',
        hasSession: false,
      });

      expect(decision).toEqual({
        action: 'redirect',
        to: `/login?next=${encodeURIComponent(path)}`,
      });
    },
  );

  it.each(['/login', '/auth/kakao/callback'])(
    '세션이 없어도 %s(공개 경로)는 통과한다',
    (path) => {
      expect(
        decideRouteGuard({ pathname: path, search: '', hasSession: false }),
      ).toEqual({ action: 'next' });
    },
  );

  it('세션이 있는데 /login에 오면 /로 보낸다 — next가 있으면 그쪽으로', () => {
    expect(
      decideRouteGuard({ pathname: '/login', search: '', hasSession: true }),
    ).toEqual({ action: 'redirect', to: '/' });
    expect(
      decideRouteGuard({
        pathname: '/login',
        search: '?next=%2Ffeedbacks',
        hasSession: true,
      }),
    ).toEqual({ action: 'redirect', to: '/feedbacks' });
  });

  it('세션이 있으면 보호 경로는 통과한다', () => {
    expect(
      decideRouteGuard({
        pathname: '/feedbacks',
        search: '',
        hasSession: true,
      }),
    ).toEqual({ action: 'next' });
  });
});

describe('safeNextPath', () => {
  it.each(['/feedbacks', '/letters/3?open=1', '/'])(
    '같은 오리진 상대 경로 %s는 그대로 쓴다',
    (next) => {
      expect(safeNextPath(next)).toBe(next);
    },
  );

  it.each([
    'https://evil.test/x',
    '//evil.test',
    '/\\evil.test',
    '/\t/evil.test',
    '/\n/evil.test',
    '/\r/evil.test',
    'javascript:alert(1)',
    'feedbacks',
    '',
    null,
    undefined,
  ])('외부·상대·빈 값 %s은 /로 바꾼다 — 오픈 리다이렉트 방지', (next) => {
    expect(safeNextPath(next)).toBe('/');
  });

  it('/login 자체로 돌아가는 next는 /로 바꾼다 — 로그인 루프 방지', () => {
    expect(safeNextPath('/login?next=%2F')).toBe('/');
  });
});
