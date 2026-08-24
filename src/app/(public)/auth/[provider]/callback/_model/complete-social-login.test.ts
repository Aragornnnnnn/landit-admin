// 콜백 흐름 검증 — state 대조, 교환→세션 순서, 로그인 응답 role이 ADMIN이 아니면 세션을 끝내고 forbidden, 취소는 조용히
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
    role: 'ADMIN',
  })),
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
  it('교환 → 세션을 거치고 role이 ADMIN이면 pending.next로 보낸다', async () => {
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
  });

  it('role이 USER면 세션을 끝내고 이메일과 함께 forbidden을 돌려준다', async () => {
    const d = deps({
      establishSession: vi.fn(async () => ({
        email: 'sujin@gmail.com',
        nickname: '수진',
        role: 'USER',
      })),
    });

    const outcome = await completeSocialLogin(input(), d);

    expect(outcome).toEqual({ kind: 'forbidden', email: 'sujin@gmail.com' });
    expect(d.endSession).toHaveBeenCalled();
  });

  it('응답에 role이 아예 없어도 관리자가 아니다 — 모르면 닫는 쪽이 안전하다', async () => {
    const d = deps({
      establishSession: vi.fn(async () => ({
        email: 'old@gmail.com',
        nickname: '옛빌드',
      })),
    });

    const outcome = await completeSocialLogin(input(), d);

    expect(outcome).toEqual({ kind: 'forbidden', email: 'old@gmail.com' });
    expect(d.endSession).toHaveBeenCalled();
  });

  it('로그아웃이 실패해도 forbidden 안내는 그대로 간다 — 쿠키는 서버가 지운다', async () => {
    const d = deps({
      establishSession: vi.fn(async () => ({ role: 'USER' })),
      endSession: vi.fn(async () => {
        throw new Error('down');
      }),
    });

    await expect(completeSocialLogin(input(), d)).resolves.toEqual({
      kind: 'forbidden',
      email: null,
    });
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
