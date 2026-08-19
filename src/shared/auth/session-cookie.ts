// 세션 쿠키의 이름·속성·읽기/쓰기 — 토큰이 쿠키 밖으로 나가지 않게 하는 유일한 통로 (docs/auth.md "쿠키 속성")
import 'server-only';

export interface SessionCookieNames {
  access: string;
  refresh: string;
}

export interface SessionCookies {
  access: string | undefined;
  refresh: string | undefined;
}

interface CookieSecurity {
  /** true면 Secure 속성을 붙인다. 프로덕션은 항상 true, 로컬 http는 false */
  secure: boolean;
}

const BASE_NAME = 'landit-admin';

/**
 * 환경에 맞는 쿠키 이름. 프로덕션은 `__Host-` 접두사 — 브라우저가 Secure·Path=/·Domain 없음을 강제해
 * 서브도메인·http에서 덮어쓰기(cookie tossing)를 막는다. 로컬 http는 Secure를 못 쓰니 접두사도 뺀다.
 */
export function sessionCookieNames(isProduction: boolean): SessionCookieNames {
  const prefix = isProduction ? '__Host-' : '';
  return {
    access: `${prefix}${BASE_NAME}-access`,
    refresh: `${prefix}${BASE_NAME}-refresh`,
  };
}

/** 현재 프로세스 기준 이름·보안 설정 — route handler들이 같은 값을 쓰게 한 곳에서 계산한다 */
export function currentSessionCookieConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    names: sessionCookieNames(isProduction),
    security: { secure: isProduction } satisfies CookieSecurity,
  };
}

/** Set-Cookie 헤더 값 하나를 만든다. HttpOnly·SameSite=Strict·Path=/는 항상, Domain은 절대 붙이지 않는다 */
export function serializeSessionCookie(
  name: string,
  value: string,
  maxAgeSeconds: number,
  { secure }: CookieSecurity,
): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

/** 두 세션 쿠키를 지우는 Set-Cookie 값들 (Max-Age=0) */
export function clearSessionCookieHeaders(
  names: SessionCookieNames,
  security: CookieSecurity,
): string[] {
  return [names.access, names.refresh].map((name) =>
    serializeSessionCookie(name, '', 0, security),
  );
}

/** 요청의 Cookie 헤더에서 access·refresh 토큰을 읽는다. 없으면 undefined */
export function readSessionCookies(
  cookieHeader: string | null,
  names: SessionCookieNames,
): SessionCookies {
  const jar = parseCookieHeader(cookieHeader);
  return { access: jar.get(names.access), refresh: jar.get(names.refresh) };
}

// "a=1; b=2" → Map. 값은 URL 디코딩. 이름이 같으면 첫 번째를 쓴다
function parseCookieHeader(header: string | null): Map<string, string> {
  const jar = new Map<string, string>();
  if (!header) return jar;
  for (const pair of header.split(';')) {
    const index = pair.indexOf('=');
    if (index < 0) continue;
    const name = pair.slice(0, index).trim();
    if (!name || jar.has(name)) continue;
    jar.set(name, safeDecode(pair.slice(index + 1).trim()));
  }
  return jar;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
