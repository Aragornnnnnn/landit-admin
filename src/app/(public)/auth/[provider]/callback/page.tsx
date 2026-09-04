'use client';

// 소셜 로그인 콜백 — 파라미터를 해석해 _model/complete-social-login에 넘기고 결과대로 라우팅한다
import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { writeAccountDisplay } from '@/shared/auth/account-display';
import { writeForbiddenNotice } from '@/shared/auth/forbidden-notice';
import { LOGIN_PATH, safeNextPath } from '@/shared/auth/route-guard';
import {
  clearPendingSocialLogin,
  readPendingSocialLogin,
} from '@/shared/auth/web-social-login';
import { reportWarning } from '@/shared/monitoring/report';
import { Button } from '@/shared/ui/shadcn/button';

import { completeSocialLogin } from './_model/complete-social-login';
import { loginGateway } from './_model/login-gateway';

export default function SocialLoginCallbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ provider: string }>;
  searchParams: Promise<{ code?: string; state?: string; error?: string }>;
}) {
  const { provider } = use(params);
  const { code, state, error } = use(searchParams);
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    // authorization code는 1회용이라 개발 모드 이펙트 2회 실행에도 교환은 한 번만 나가게 막는다
    if (started.current) return;
    started.current = true;

    const run = async () => {
      const outcome = await completeSocialLogin(
        {
          provider,
          code: code ?? null,
          state: state ?? null,
          error: error ?? null,
          pending: readPendingSocialLogin(),
        },
        loginGateway,
      );
      clearPendingSocialLogin();

      switch (outcome.kind) {
        case 'done':
          writeAccountDisplay(outcome.nickname);
          router.replace(safeNextPath(outcome.next));
          return;
        case 'forbidden':
          writeForbiddenNotice(outcome.email);
          router.replace(LOGIN_PATH);
          return;
        case 'cancelled':
          router.replace(LOGIN_PATH);
          return;
        case 'failed':
          reportWarning(`소셜 로그인 실패: ${outcome.message}`);
          setMessage(outcome.message);
      }
    };

    run();
  }, [provider, code, state, error, router]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-card px-6 text-center">
      {message ? (
        <>
          <p className="text-sm font-medium text-destructive">{message}</p>
          <Button variant="outline" onClick={() => router.replace(LOGIN_PATH)}>
            로그인으로 돌아가기
          </Button>
        </>
      ) : (
        <p className="text-sm font-medium text-muted-foreground">
          로그인 중이에요…
        </p>
      )}
    </main>
  );
}
