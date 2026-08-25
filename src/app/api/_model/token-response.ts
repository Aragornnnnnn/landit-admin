// BE 토큰 응답(AuthTokenResponse·TokenRefreshResponse)에서 쿠키에 심을 값만 검증해서 꺼낸다 — 필드가 빠지거나 형식이 다르면 null
import 'server-only';

export interface IssuedTokens {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
}

export function readIssuedTokens(data: unknown): IssuedTokens | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Partial<Record<keyof IssuedTokens, unknown>>;
  if (
    typeof d.accessToken !== 'string' ||
    !d.accessToken ||
    typeof d.refreshToken !== 'string' ||
    !d.refreshToken ||
    !Number.isFinite(d.accessTokenExpiresIn) ||
    !Number.isFinite(d.refreshTokenExpiresIn)
  ) {
    return null;
  }
  return {
    accessToken: d.accessToken,
    accessTokenExpiresIn: d.accessTokenExpiresIn as number,
    refreshToken: d.refreshToken,
    refreshTokenExpiresIn: d.refreshTokenExpiresIn as number,
  };
}
