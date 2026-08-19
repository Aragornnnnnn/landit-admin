'use client';

// 전역 에러 바운더리 — 렌더 중 예외가 나면 흰 화면 대신 복구 화면을 보여주고 보고한다
import { useEffect } from 'react';

import { reportError } from '@/shared/monitoring/report';
import { Button } from '@/shared/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-8 text-center">
      <div>
        <h1 className="text-xl font-bold text-foreground">문제가 생겼어요</h1>
        <p className="mt-2 text-[15px] leading-[22px] text-muted-foreground">
          잠시 후 다시 시도해 주세요
        </p>
      </div>
      <Button onClick={reset}>다시 시도</Button>
    </main>
  );
}
