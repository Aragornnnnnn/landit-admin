'use client';

// 지금 어느 서버를 보고 있는지 알리는 한 줄 — 셸이 가려지는 모바일 전체화면에서 쓴다.
// 데스크톱은 사이드바의 서버 카드가 같은 일을 하므로 여기서 다시 그리지 않는다
import { cn } from '@/shared/lib/cn';

import { useApiHost } from '../_model/api-host';
import { isDevelopServer } from '../_model/navigation';

export function ServerBadge({ className }: { className?: string }) {
  const apiHost = useApiHost();

  return (
    <span
      className={cn(
        'flex items-center gap-1.5 text-[13px] text-subtle',
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-subtle" />
      {isDevelopServer(apiHost) ? '개발 서버' : '운영 서버'}
    </span>
  );
}
