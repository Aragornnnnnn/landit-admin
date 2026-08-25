// 목록을 불러오는 동안의 자리 — 기본 5행 (docs/admin-spec.md "공통 상태").
// 언제 그릴지는 useDelayedPending이 정한다 — 200ms 안에 오는 응답엔 이게 아예 안 그려진다
import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/ui/skeleton';

interface ListSkeletonProps {
  rows?: number;
  className?: string;
}

const DEFAULT_ROWS = 5;

export function ListSkeleton({
  rows = DEFAULT_ROWS,
  className,
}: ListSkeletonProps) {
  return (
    <div
      // 진행 중임을 보조기기에도 알린다 — 시각적으로만 전하지 않게
      role="status"
      aria-label="불러오는 중"
      className={cn('flex flex-col gap-3', className)}
    >
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}
