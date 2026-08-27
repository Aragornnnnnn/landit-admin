'use client';

// 지금 어느 서버를 보고 있는지 알리는 한 줄 — 셸이 가려지는 모바일 전체화면에서 쓴다.
// 데스크톱은 사이드바의 서버 카드가 같은 일을 하므로 여기서 다시 그리지 않는다
import { cn } from '@/shared/lib/cn';

import { useApiHost } from '../_model/api-host';
import { isDevelopServer } from '../_model/navigation';

export function ServerBadge({ className }: { className?: string }) {
  const apiHost = useApiHost();
  const develop = isDevelopServer(apiHost);

  return (
    <span
      className={cn(
        'flex items-center gap-1.5 text-[13px] text-subtle',
        className,
      )}
    >
      {/* 점 색이 환경을 가른다 — 개발은 초록(안전), 운영은 오렌지(조심). 사이드바 서버 표시와 같은 규칙 */}
      <span
        aria-hidden
        className={cn(
          'size-1.5 rounded-full',
          develop ? 'bg-success' : 'bg-primary',
        )}
      />
      {develop ? '개발 서버' : '운영 서버'}
    </span>
  );
}
