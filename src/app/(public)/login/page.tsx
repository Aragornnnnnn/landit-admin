'use client';

// /login — searchParams(next)를 해석하고 카드를 조립한다. 로직은 _model, 화면은 _ui
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  readForbiddenNotice,
  type ForbiddenNotice,
} from '@/shared/auth/forbidden-notice';
import { safeNextPath } from '@/shared/auth/route-guard';

import { useSocialLogin } from './_model/useSocialLogin';
import { LoginCard } from './_ui/LoginCard';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get('next'));
  const { login, pending } = useSocialLogin(next);
  // 콜백이 남긴 "관리자 아님" 안내 — 읽으면서 지우므로 초기값으로 한 번만 읽는다
  const [forbidden, setForbidden] = useState<ForbiddenNotice | null>(() =>
    typeof window === 'undefined' ? null : readForbiddenNotice(),
  );

  return (
    <main className="flex min-h-dvh items-center justify-center bg-card px-6">
      <LoginCard
        pending={pending}
        forbidden={forbidden}
        onLogin={login}
        onDismissForbidden={() => setForbidden(null)}
      />
    </main>
  );
}
