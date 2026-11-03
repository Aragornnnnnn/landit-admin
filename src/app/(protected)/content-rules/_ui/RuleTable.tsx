'use client';

// 규칙 표 — 코드 · 규칙 · 출처 · 상태 · 등록 · 은퇴. RETIRED 행은 회색, 은퇴는 ACTIVE에서만 (Figma 4133:855 · admin-spec "목록 행 다듬기")
import type { ContentRule } from '@/features/content/api/content-rule';
import { cn } from '@/shared/lib/cn';
import { formatMonthDay } from '@/shared/lib/format-time';
import { StatusChip } from '@/shared/ui/StatusChip';

import { ruleSourceLabel } from '../_model/rule-filter';

const CELL = {
  code: 'w-[80px] shrink-0',
  text: 'flex-1 min-w-px',
  source: 'w-[130px] shrink-0',
  status: 'w-[90px] shrink-0',
  createdAt: 'w-[70px] shrink-0',
  action: 'w-[60px] shrink-0',
};

interface RuleTableProps {
  rules: ContentRule[];
  /** 은퇴 요청 중 — 다른 행의 은퇴 버튼도 잠근다(등록 중엔 잠그지 않는다) */
  pending: boolean;
  onRetire: (rule: ContentRule) => void;
}

export function RuleTable({ rules, pending, onRetire }: RuleTableProps) {
  return (
    <section className="w-full rounded-[20px] bg-card pt-5 pb-1">
      <header className="flex items-baseline gap-2 px-5">
        <h2 className="text-[16px] font-bold text-strong">규칙</h2>
        <span className="text-[13px] text-subtle">{rules.length}</span>
      </header>
      <div className="w-full overflow-x-auto px-1">
        <div className="min-w-[900px]">
          <div
            role="row"
            className="flex w-full items-center gap-4 px-5 pt-3 pb-2 text-xs font-medium text-subtle"
          >
            <span className={CELL.code}>코드</span>
            <span className={CELL.text}>
              규칙 (다음 AI 호출부터 프롬프트에 들어간다)
            </span>
            <span className={CELL.source}>출처</span>
            <span className={CELL.status}>상태</span>
            <span className={CELL.createdAt}>등록</span>
            <span className={CELL.action}>
              <span className="sr-only">액션</span>
            </span>
          </div>

          <ul className="flex flex-col gap-0.5">
            {rules.map((rule) => {
              const retired = rule.status === 'RETIRED';
              return (
                <li
                  key={rule.ruleId}
                  className="flex w-full items-start gap-4 rounded-lg px-5 py-3 transition-colors hover:bg-hairline"
                >
                  <span
                    className={cn(
                      CELL.code,
                      'text-[14px] font-medium',
                      retired ? 'text-subtle' : 'text-strong',
                    )}
                  >
                    {rule.ruleCode}
                  </span>
                  <span
                    className={cn(
                      CELL.text,
                      'text-[14px] leading-[1.5] break-words',
                      retired ? 'text-subtle' : 'text-body',
                    )}
                  >
                    {rule.ruleText}
                  </span>
                  <span className={cn(CELL.source, 'text-[13px] text-subtle')}>
                    {ruleSourceLabel(rule)}
                  </span>
                  <span className={CELL.status}>
                    <StatusChip dot={retired ? undefined : 'done'}>
                      {rule.status}
                    </StatusChip>
                  </span>
                  <span
                    className={cn(CELL.createdAt, 'text-[13px] text-subtle')}
                  >
                    {formatMonthDay(rule.createdAt)}
                  </span>
                  <span className={cn(CELL.action, 'text-[13px]')}>
                    {retired ? (
                      <span aria-hidden className="text-subtle">
                        —
                      </span>
                    ) : (
                      <button
                        type="button"
                        aria-label={`${rule.ruleCode} 은퇴`}
                        disabled={pending}
                        onClick={() => onRetire(rule)}
                        className="font-medium text-destructive hover:underline disabled:opacity-50"
                      >
                        은퇴
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
