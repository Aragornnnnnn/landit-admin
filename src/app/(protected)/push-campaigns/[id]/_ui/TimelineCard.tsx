// 진행 카드 — 초안 생성 → 발송 → 완료. 끝난 단계 초록, 다음·진행 중 오렌지, 미정·취소 회색 (Figma 2177:354)
import { cn } from '@/shared/lib/cn';

import type { TimelineStep } from '../_model/detail-label';

const DOT: Record<TimelineStep['state'], string> = {
  done: 'bg-success',
  active: 'bg-primary',
  next: 'bg-primary',
  todo: 'bg-hairline',
  cancelled: 'bg-hairline',
};

export function TimelineCard({ steps }: { steps: TimelineStep[] }) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">진행</h2>
      <ol className="flex flex-col">
        {steps.map((step, index) => (
          <li key={step.label} className="flex gap-3">
            <span className="flex flex-col items-center">
              <span
                aria-hidden
                className={cn('mt-1.5 size-2.5 rounded-full', DOT[step.state])}
              />
              {index < steps.length - 1 && (
                <span aria-hidden className="w-0.5 flex-1 bg-hairline" />
              )}
            </span>
            <span className="flex flex-col gap-0.5 pb-4">
              <span
                className={cn(
                  'text-[13px] font-medium',
                  step.state === 'todo' || step.state === 'cancelled'
                    ? 'text-subtle'
                    : 'text-strong',
                )}
              >
                {step.label}
              </span>
              <span className="text-[12px] text-subtle">{step.when}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
