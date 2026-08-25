'use client';

// /login — searchParams(next)를 해석하고 카드를 조립한다. 로직은 _model, 화면은 _ui
import { useSearchParams } from 'next/navigation';

import { safeNextPath } from '@/shared/auth/route-guard';

import { useForbiddenNotice } from './_model/useForbiddenNotice';
import { useSocialLogin } from './_model/useSocialLogin';
import { LoginCard } from './_ui/LoginCard';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get('next'));
  const { login, pending } = useSocialLogin(next);
  const { notice: forbidden, dismiss: dismissForbidden } = useForbiddenNotice();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-card px-6">
      <LoginCard
        pending={pending}
        forbidden={forbidden}
        onLogin={login}
        onDismissForbidden={dismissForbidden}
      />
    </main>
  );
}
