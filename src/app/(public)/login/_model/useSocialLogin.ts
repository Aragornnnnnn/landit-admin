'use client';

// 로그인 버튼 → 웹 OAuth 시작. 성공 경로는 페이지를 떠나므로 pending은 실패할 때만 풀린다
import { useState } from 'react';
import { toast } from 'sonner';

import { generateRandomHex } from '@/shared/auth/crypto';
import {
  startWebSocialLogin,
  type WebSocialProvider,
} from '@/shared/auth/web-social-login';
import { reportWarning } from '@/shared/monitoring/report';

export const LOGIN_FAILED_MESSAGE = '로그인하지 못했어요. 다시 시도해 주세요';

/**
 * 소셜 로그인 진행 상태. `login(provider)`로 시작하고, `pending`이 누른 버튼(둘 다 비활성 처리에 쓴다).
 *
 * @param next 로그인 후 돌아갈 경로 — 이미 safeNextPath로 검증된 값
 */
export function useSocialLogin(next: string) {
  const [pending, setPending] = useState<WebSocialProvider | null>(null);

  const login = async (provider: WebSocialProvider) => {
    if (pending) return;
    setPending(provider);
    try {
      await startWebSocialLogin(provider, generateRandomHex(16), next);
    } catch (error) {
      // 키 미설정·SDK 로드 실패 등 — 설정 문제라 경고로 남기고 사용자에겐 한 문구만
      reportWarning(error);
      toast.error(LOGIN_FAILED_MESSAGE);
      setPending(null);
    }
  };

  return { login, pending };
}
