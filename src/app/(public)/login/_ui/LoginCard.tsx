'use client';

// 로그인 카드 — 카카오·Google 버튼, 안내 한 줄, (관리자 아님일 때) 권한 없음 안내 + 다른 계정으로 로그인 (docs/screens/login.md)
import { Loader2 } from 'lucide-react';

import type { ForbiddenNotice } from '@/shared/auth/forbidden-notice';
import type { WebSocialProvider } from '@/shared/auth/web-social-login';
import { cn } from '@/shared/lib/cn';

import { GoogleIcon, KakaoIcon } from './SocialIcons';

interface LoginCardProps {
  pending: WebSocialProvider | null;
  forbidden: ForbiddenNotice | null;
  onLogin: (provider: WebSocialProvider) => void;
  onDismissForbidden: () => void;
}

export function LoginCard({
  pending,
  forbidden,
  onLogin,
  onDismissForbidden,
}: LoginCardProps) {
  const disabled = pending !== null;

  return (
    <section
      aria-labelledby="login-title"
      className="flex w-full max-w-[420px] flex-col gap-7"
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[26px] leading-none font-extrabold tracking-tight text-foreground">
            landit
          </span>
          <span className="text-lg font-bold text-muted-foreground">
            어드민
          </span>
        </div>
        <h1 id="login-title" className="text-[15px] text-muted-foreground">
          관리자 계정으로 로그인해 주세요
        </h1>
      </header>

      <div className="flex flex-col gap-2.5">
        <ProviderButton
          label="카카오로 로그인"
          icon={<KakaoIcon />}
          loading={pending === 'kakao'}
          disabled={disabled}
          onClick={() => onLogin('kakao')}
          className="bg-kakao text-kakao-foreground hover:brightness-95"
        />
        <ProviderButton
          label="Google로 로그인"
          icon={<GoogleIcon />}
          loading={pending === 'google'}
          disabled={disabled}
          onClick={() => onLogin('google')}
          className="border border-border bg-card text-foreground hover:bg-muted"
        />
      </div>

      {forbidden && (
        <div
          role="alert"
          className="rounded-[10px] bg-chip px-3.5 py-2.5 text-xs leading-relaxed text-chip-foreground"
        >
          {forbidden.maskedEmail
            ? `${forbidden.maskedEmail} 계정은 `
            : '이 계정은 '}
          관리자 권한이 없어요. 관리자에게 권한을 요청해 주세요.
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        랜딧 앱과 같은 계정으로 로그인해요. 관리자 권한이 있는 계정만 들어올 수
        있어요.
      </p>

      {forbidden && (
        <button
          type="button"
          onClick={onDismissForbidden}
          className="self-start px-3.5 py-4 text-[15px] font-medium text-muted-foreground hover:text-foreground"
        >
          다른 계정으로 로그인
        </button>
      )}
    </section>
  );
}

function ProviderButton({
  label,
  icon,
  loading,
  disabled,
  onClick,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={loading}
      className={cn(
        'flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl px-3.5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {loading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : icon}
      {label}
    </button>
  );
}
