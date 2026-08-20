// CSP 정책 조립 검증 — nonce 주입, 개발 전용 unsafe-eval, 외부 도메인 목록이 규칙대로 들어가는지
import { describe, expect, it } from 'vitest';

import { buildContentSecurityPolicy } from './csp';

const directivesOf = (policy: string) =>
  Object.fromEntries(
    policy.split(';').map((d) => {
      const [name, ...values] = d.trim().split(/\s+/);
      return [name, values];
    }),
  );

describe('buildContentSecurityPolicy', () => {
  it('script-src에 요청별 nonce와 strict-dynamic을 넣고 unsafe-inline은 넣지 않는다', () => {
    const policy = buildContentSecurityPolicy({
      nonce: 'abc123',
      isDev: false,
    });
    const d = directivesOf(policy);

    expect(d['script-src']).toContain("'nonce-abc123'");
    expect(d['script-src']).toContain("'strict-dynamic'");
    expect(d['script-src']).not.toContain("'unsafe-inline'");
    expect(d['script-src']).not.toContain("'unsafe-eval'");
  });

  it('개발 환경이면 React 디버깅용 unsafe-eval만 추가로 허용한다', () => {
    const policy = buildContentSecurityPolicy({ nonce: 'n', isDev: true });

    expect(directivesOf(policy)['script-src']).toContain("'unsafe-eval'");
  });

  it('style-src에는 nonce를 넣지 않는다 — 넣으면 CSP3 브라우저가 unsafe-inline을 무시해 radix·sonner의 style 속성이 깨진다', () => {
    const policy = buildContentSecurityPolicy({ nonce: 'n', isDev: false });
    const d = directivesOf(policy);

    expect(d['style-src']).toContain("'unsafe-inline'");
    expect(d['style-src'].join(' ')).not.toMatch(/nonce-/);
  });

  it('프레임 삽입·object·base·form-action을 잠근다', () => {
    const d = directivesOf(
      buildContentSecurityPolicy({ nonce: 'n', isDev: false }),
    );

    expect(d['frame-ancestors']).toEqual(["'none'"]);
    expect(d['object-src']).toEqual(["'none'"]);
    expect(d['base-uri']).toEqual(["'self'"]);
    expect(d['form-action']).toEqual(["'self'"]);
  });

  it('공백·줄바꿈 없이 한 줄로 만든다 — 헤더 값에 개행이 들어가면 브라우저가 거부한다', () => {
    const policy = buildContentSecurityPolicy({ nonce: 'n', isDev: false });

    expect(policy).not.toMatch(/\n/);
    expect(policy).not.toMatch(/\s{2,}/);
  });
});
