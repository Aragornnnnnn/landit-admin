// 콜백 흐름 검증 — state 대조, 교환→세션→관리자 판정 순서, 403이면 세션을 끝내고 forbidden, 취소는 조용히
import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api/api-error';

import {
  completeSocialLogin,
  type CallbackDeps,
} from './complete-social-login';

const pending = {
  provider: 'kakao' as const,
  nonce: 'nonce',
  state: 'state',
  redirectUri: 'https://admin.test/auth/kakao/callback',
  next: '/feedbacks',
};

const deps = (over: Partial<CallbackDeps> = {}): CallbackDeps => ({
  exchangeCode: vi.fn(async () => 'id-token'),
  establishSession: vi.fn(async () => ({
    email: 'sujin@gmail.com',
    nickname: '수진',
  })),
  probeAdmin: vi.fn(async () => undefined),
  endSession: vi.fn(async () => undefined),
  ...over,
});

const input = (
  over: Partial<Parameters<typeof completeSocialLogin>[0]> = {},
) => ({
  provider: 'kakao',
  code: 'code',
  state: 'state',
  error: null,
  pending,
  ...over,
});

describe('completeSocialLogin', () => {
  it('교환 → 세션 → 관리자 판정을 거쳐 pending.next로 보낸다', async () => {
    const d = deps();

    const outcome = await completeSocialLogin(input(), d);

    expect(outcome).toEqual({
      kind: 'done',
      next: '/feedbacks',
      nickname: '수진',
    });
    expect(d.exchangeCode).toHaveBeenCalledWith({
      provider: 'kakao',
      code: 'code',
      redirectUri: pending.redirectUri,
      codeVerifier: undefined,
    });
    expect(d.establishSession).toHaveBeenCalledWith({
      provider: 'kakao',
      idToken: 'id-token',
      nonce: 'nonce',
    });
    expect(d.probeAdmin).toHaveBeenCalled();
  });

  it('관리자 판정이 403이면 세션을 끝내고 이메일과 함께 forbidden을 돌려준다', async () => {
    const d = deps({
      probeAdmin: vi.fn(async () => {
        throw new ApiError('forbidden', 403, '/api/v1/admin/app-versions');
      }),
    });

    const outcome = await completeSocialLogin(input(), d);

    expect(outcome).toEqual({ kind: 'forbidden', email: 'sujin@gmail.com' });
    expect(d.endSession).toHaveBeenCalled();
  });

  it('관리자 판정이 403이 아닌 이유로 실패하면 들여보낸다 — 보호 구역이 다시 시도한다', async () => {
    const d = deps({
      probeAdmin: vi.fn(async () => {
        throw new ApiError('down', 502, '/api/v1/admin/app-versions');
      }),
    });

    await expect(completeSocialLogin(input(), d)).resolves.toEqual({
      kind: 'done',
      next: '/feedbacks',
      nickname: '수진',
    });
    expect(d.endSession).not.toHaveBeenCalled();
  });

  it('state가 다르면 교환을 시도하지 않는다 — CSRF', async () => {
    const d = deps();

    const outcome = await completeSocialLogin(input({ state: 'other' }), d);

    expect(outcome.kind).toBe('failed');
    expect(d.exchangeCode).not.toHaveBeenCalled();
  });

  it('pending이 없으면(다른 탭·저장소 비움) 실패 안내를 준다', async () => {
    const outcome = await completeSocialLogin(input({ pending: null }), deps());

    expect(outcome).toEqual({
      kind: 'failed',
      message: '로그인 요청 정보를 찾지 못했어요. 다시 시도해 주세요.',
    });
  });

  it.each(['access_denied', 'user_cancelled_authorize'])(
    '제공자 error=%s(사용자 취소)는 조용히 cancelled',
    async (error) => {
      await expect(
        completeSocialLogin(input({ error }), deps()),
      ).resolves.toEqual({ kind: 'cancelled' });
    },
  );

  it('BE 로그인이 실패 봉투를 주면 그 메시지로 failed', async () => {
    const d = deps({
      establishSession: vi.fn(async () => {
        throw new ApiError('검증 값이 달라요.', 401, '/api/auth/social-login');
      }),
    });

    await expect(completeSocialLogin(input(), d)).resolves.toEqual({
      kind: 'failed',
      message: '검증 값이 달라요.',
    });
  });
});

describe('completeSocialLogin — 실패 사유', () => {
  it('교환이 일반 Error로 실패해도 그 메시지를 살린다 — 설정 오류를 운영자가 볼 수 있게', async () => {
    const d = deps({
      exchangeCode: vi.fn(async () => {
        throw new Error('kakao client ID가 설정되지 않았어요.');
      }),
    });

    await expect(completeSocialLogin(input(), d)).resolves.toEqual({
      kind: 'failed',
      message: 'kakao client ID가 설정되지 않았어요.',
    });
  });
});
