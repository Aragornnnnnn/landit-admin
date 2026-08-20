// 보여줄 것이 없을 때의 자리 — 한 줄 이유와 다음 행동을 준다 (docs/admin-spec.md "공통 상태").
// "원래 없는 것"과 "필터 때문에 없는 것"은 문구로 가른다 — 그 판단은 화면이 하고, 여기선 받은 문구를 그린다
import { cn } from '@/shared/lib/cn';

interface EmptyStateProps {
  /** 왜 비었는지 한 줄 — 예: "아직 받은 피드백이 없어요", "조건에 맞는 피드백이 없어요" */
  title: string;
  /** 다음에 뭘 하면 되는지 — 예: "검색어나 필터를 바꿔 보세요" */
  description?: string;
  /** 다음 행동 버튼 — 예: 필터 초기화 */
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 px-6 py-16 text-center',
        className,
      )}
    >
      <p className="text-[15px] font-medium text-body">{title}</p>
      {description && (
        <p className="text-[13px] text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
