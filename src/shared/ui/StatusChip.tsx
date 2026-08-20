// 상태·유형을 나타내는 중립 칩 — 배경·글자는 항상 같고 점 색만 다르다 (docs/admin-spec.md "칩").
// 어떤 라벨에 어떤 점을 쓸지는 도메인이 정한다 — 이 컴포넌트는 그 결정을 모른다
import { cn } from '@/shared/lib/cn';

/** 점 색 — 진행 중은 오렌지, 끝난 것은 초록. 점이 없으면 생략한다 */
type ChipDot = 'progress' | 'done';

interface StatusChipProps {
  children: React.ReactNode;
  dot?: ChipDot;
  className?: string;
}

const DOT_COLOR: Record<ChipDot, string> = {
  progress: 'bg-primary',
  done: 'bg-success',
};

export function StatusChip({ children, dot, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] rounded-full bg-chip px-2.5 py-[3px] text-[11px] font-bold whitespace-nowrap text-chip-foreground',
        className,
      )}
    >
      {dot && (
        // 색만으로 뜻을 전하지 않는다 — 라벨이 늘 함께 있으므로 점은 장식으로 숨긴다
        <span
          aria-hidden
          data-dot={dot}
          className={cn('size-1.5 rounded-full', DOT_COLOR[dot])}
        />
      )}
      {children}
    </span>
  );
}
