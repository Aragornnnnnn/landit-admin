// 숫자 타일 — 라벨 · 큰 값 · 보조. 예상 대상 카드와 발송 결과 카드가 같이 쓴다
import { cn } from '@/shared/lib/cn';

interface StatTileProps {
  label: string;
  value: string;
  sub?: string;
  /** 값 색 — 성공은 초록, 실패는 빨강 */
  tone?: string;
}

export function StatTile({ label, value, sub, tone }: StatTileProps) {
  return (
    <div className="flex min-w-[100px] flex-1 flex-col gap-1 rounded-[12px] bg-background px-4 py-3.5">
      <span className="text-[12px] font-medium text-subtle">{label}</span>
      <span
        className={cn('text-[22px] leading-[1.2] font-bold text-strong', tone)}
      >
        {value}
      </span>
      {sub && <span className="text-[11px] text-subtle">{sub}</span>}
    </div>
  );
}
