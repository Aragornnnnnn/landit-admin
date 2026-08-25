// POST /api/auth/oauth-token — code→id_token 교환을 서버에서 중계. client_secret을 브라우저에 노출하지 않는다 (landit-fe 웹 폴백에서 가져와 봉투·CSRF 규칙만 맞춤)
import { isSameOriginRequest } from '@/shared/security/same-origin';

import { apiFailure, apiSuccess } from '../../_model/respond';

export const dynamic = 'force-dynamic';

// 제공자별로 다른 것만 표로 — 토큰 URL, client id env, 선택 secret env, PKCE 여부
const PROVIDERS = {
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientId: () => process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET,
    usesPkce: true,
  },
  kakao: {
    tokenUrl: 'https://kauth.kakao.com/oauth/token',
    clientId: () => process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
    clientSecret: () => process.env.KAKAO_CLIENT_SECRET,
    usesPkce: false,
  },
} as const;
type Provider = keyof typeof PROVIDERS;

interface ExchangeRequest {
  provider: Provider;
  code: string;
  redirectUri: string;
  codeVerifier?: string;
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return apiFailure(403, 'CSRF_REJECTED');

  const body = readExchangeRequest(await request.json().catch(() => null));
  if (!body)
    return apiFailure(400, 'INVALID_REQUEST', '요청 값이 올바르지 않아요.');

  try {
    const idToken = await exchangeCodeForIdToken(body);
    return apiSuccess({ idToken });
  } catch (error) {
    // 제공자가 준 설명(invalid_grant 등)은 운영자가 원인을 짚는 데 필요하다 — 어드민이라 그대로 보여준다
    return apiFailure(
      400,
      'TOKEN_EXCHANGE_FAILED',
      error instanceof Error ? error.message : '토큰 교환에 실패했어요.',
    );
  }
}

function readExchangeRequest(raw: unknown): ExchangeRequest | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const provider =
    typeof r.provider === 'string' ? r.provider.toLowerCase() : '';
  if (!(provider in PROVIDERS)) return null;
  if (typeof r.code !== 'string' || !r.code) return null;
  if (typeof r.redirectUri !== 'string' || !r.redirectUri) return null;
  const codeVerifier =
    typeof r.codeVerifier === 'string' ? r.codeVerifier : undefined;
  return {
    provider: provider as Provider,
    code: r.code,
    redirectUri: r.redirectUri,
    codeVerifier,
  };
}

async function exchangeCodeForIdToken(body: ExchangeRequest): Promise<string> {
  const config = PROVIDERS[body.provider];
  const clientId = config.clientId();
  if (!clientId)
    throw new Error(`${body.provider} client ID가 설정되지 않았어요.`);
  if (config.usesPkce && !body.codeVerifier)
    throw new Error('PKCE code verifier가 없어요.');

  const params: Record<string, string> = {
    grant_type: 'authorization_code',
    client_id: clientId,
    code: body.code,
    redirect_uri: body.redirectUri,
  };
  if (config.usesPkce) params.code_verifier = body.codeVerifier as string;
  // 웹 클라이언트 유형이면 secret이 필요하고, PKCE 전용 유형이면 없어도 된다
  const clientSecret = config.clientSecret();
  if (clientSecret) params.client_secret = clientSecret;

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });
  const data = (await response.json().catch(() => ({}))) as {
    id_token?: string;
    error_description?: string;
    error?: string;
  };
  if (!response.ok || !data.id_token)
    throw new Error(
      data.error_description ?? data.error ?? '토큰 교환에 실패했어요.',
    );
  return data.id_token;
}
