'use client';

// 대상 카드 — 전체 / 선택 세그먼트와 예상 대상 (Figma 2177:285).
// 선택 대상의 목록·추가 패널은 다음 PR(대상 빌더)에서 붙는다 — 그때까지 선택은 고를 수 없다
import type { AudienceDraft } from '@/features/push-campaign/model/audience';
import { cn } from '@/shared/lib/cn';

interface AudienceSectionProps {
  audience: AudienceDraft;
  error?: string;
  onChange: (audience: AudienceDraft) => void;
}

const TYPES = [
  { value: 'ALL', label: '전체 사용자' },
  { value: 'SELECTED', label: '선택한 사용자' },
] as const;

export function AudienceSection({
  audience,
  error,
  onChange,
}: AudienceSectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">대상</h2>

      <div className="flex w-fit gap-1 rounded-xl bg-muted p-1">
        {TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            aria-pressed={audience.type === type.value}
            disabled={type.value === 'SELECTED'}
            onClick={() => onChange({ ...audience, type: type.value })}
            className={cn(
              'rounded-lg px-4 py-1.5 text-[14px] font-medium text-subtle transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              audience.type === type.value && 'bg-card text-strong shadow-sm',
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-[14px] bg-primary/10 px-[18px] py-4">
        <span className="flex flex-col gap-0.5">
          <span className="text-[12px] font-medium text-primary">
            예상 대상
          </span>
          <span className="text-[26px] leading-[1.2] font-bold text-strong">
            전체
          </span>
        </span>
        <span className="ml-auto text-[12px] text-subtle">
          발송할 때 다시 계산돼요
        </span>
      </div>

      {error && <span className="text-[12px] text-destructive">{error}</span>}
    </section>
  );
}
