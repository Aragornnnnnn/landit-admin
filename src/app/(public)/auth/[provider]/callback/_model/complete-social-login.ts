// 소셜 로그인 콜백의 본체 — code→id_token 교환 → 세션 쿠키 발급 → 관리자 판정(첫 admin 호출 403) → 갈 곳 결정. 순수 함수라 테스트로 고정한다
import { ApiError } from '@/shared/api/api-error';
import type { PendingSocialLogin } from '@/shared/auth/web-social-login';

export interface CallbackInput {
  provider: string;
  code: string | null;
  state: string | null;
  error: string | null;
  pending: PendingSocialLogin | null;
}

export interface CallbackDeps {
  /** POST /api/auth/oauth-token — code를 id_token으로 */
  exchangeCode: (input: {
    provider: string;
    code: string;
    redirectUri: string;
    codeVerifier?: string;
  }) => Promise<string>;
  /** POST /api/auth/social-login — 세션 쿠키를 심고 user를 돌려준다 */
  establishSession: (input: {
    provider: string;
    idToken: string;
    nonce: string;
  }) => Promise<{ email?: string | null; nickname?: string | null }>;
  /** 가장 가벼운 admin 조회 — 403이면 관리자가 아니다 (관리자 판정 API가 생기면 교체) */
  probeAdmin: () => Promise<void>;
  /** POST /api/auth/logout — 관리자 아님이면 세션을 바로 끝낸다 */
  endSession: () => Promise<void>;
}

export type CallbackOutcome =
  | { kind: 'done'; next: string | undefined; nickname: string | null }
  | { kind: 'forbidden'; email: string | null }
  | { kind: 'cancelled' }
  | { kind: 'failed'; message: string };

const WEB_PROVIDERS = new Set(['kakao', 'google']);
const CANCEL_ERRORS = new Set(['access_denied', 'user_cancelled_authorize']);

export async function completeSocialLogin(
  input: CallbackInput,
  deps: CallbackDeps,
): Promise<CallbackOutcome> {
  if (!WEB_PROVIDERS.has(input.provider)) {
    return { kind: 'failed', message: '지원하지 않는 로그인 제공자예요.' };
  }
  if (input.error) {
    // 동의 화면에서 사용자가 취소한 경우엔 조용히 로그인 화면으로 되돌린다
    if (CANCEL_ERRORS.has(input.error)) return { kind: 'cancelled' };
    return { kind: 'failed', message: '소셜 로그인이 취소됐어요.' };
  }
  const { code, state, pending } = input;
  if (!code || !state || !pending) {
    return {
      kind: 'failed',
      message: '로그인 요청 정보를 찾지 못했어요. 다시 시도해 주세요.',
    };
  }
  // CSRF 방어 — 시작할 때 저장한 provider·state와 일치해야 한다
  if (pending.provider !== input.provider || pending.state !== state) {
    return {
      kind: 'failed',
      message: '로그인 검증 값이 일치하지 않아요. 다시 시도해 주세요.',
    };
  }

  let user: { email?: string | null; nickname?: string | null };
  try {
    const idToken = await deps.exchangeCode({
      provider: input.provider,
      code,
      redirectUri: pending.redirectUri,
      codeVerifier: pending.codeVerifier,
    });
    user = await deps.establishSession({
      provider: input.provider,
      idToken,
      nonce: pending.nonce,
    });
  } catch (error) {
    return {
      kind: 'failed',
      message:
        error instanceof ApiError && error.message
          ? error.message
          : '로그인하지 못했어요. 다시 시도해 주세요.',
    };
  }

  try {
    await deps.probeAdmin();
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      // 관리자가 아니다 — 세션을 남기지 않는다 (실패해도 쿠키는 서버가 지운다)
      await deps.endSession().catch(() => undefined);
      return { kind: 'forbidden', email: user.email ?? null };
    }
    // 판정 호출이 다른 이유로 실패하면 들여보낸다 — 보호 구역의 첫 화면이 인라인 오류로 다시 시도하게 한다
  }

  return { kind: 'done', next: pending.next, nickname: user.nickname ?? null };
}
