'use client';

// 검증기 카드 — FAIL → WARN → 검사 불가 순, PASS는 접어 둔다. path를 누르면 그 줄로 간다. 사람만 볼 수 있는 항목은 늘 띄운다 (Figma 4131:766)
import type {
  Reading,
  ValidationFinding,
  ValidationReport,
} from '@/features/content/api/draft-payload';
import { summarizeFindings } from '@/features/content/model/validation-summary';
import { cn } from '@/shared/lib/cn';

import { splitFindings } from '../_model/draft-content';

const LEVEL_CHIP: Record<ValidationFinding['level'], string> = {
  FAIL: 'bg-destructive text-white',
  WARN: 'bg-primary text-primary-foreground',
  UNCHECKED: 'bg-chip text-chip-foreground',
  PASS: 'bg-success/15 text-success',
};
const LEVEL_TEXT: Record<ValidationFinding['level'], string> = {
  FAIL: 'FAIL',
  WARN: 'WARN',
  UNCHECKED: '검사 불가',
  PASS: 'PASS',
};

interface ValidationCardProps {
  validation: Reading<ValidationReport>;
  onLocate: (path: string) => void;
}

export function ValidationCard({ validation, onLocate }: ValidationCardProps) {
  if (validation.state !== 'ok') {
    return (
      <Card title="검증기">
        <p className="text-[13px] text-subtle">
          {validation.state === 'missing'
            ? '아직 검증 전이에요'
            : '검증 결과를 읽지 못했어요'}
        </p>
      </Card>
    );
  }
  const report = validation.value;
  const counts = summarizeFindings(report);
  const { shown, passed } = splitFindings(report.findings);
  return (
    <Card
      title={`검증기 · FAIL ${counts.fail} · WARN ${counts.warn} · 통과 ${counts.pass}${counts.unchecked > 0 ? ` · 검사 불가 ${counts.unchecked}` : ''}`}
    >
      <ul className="flex flex-col gap-1.5">
        {shown.map((finding, index) => (
          <li key={index}>
            <FindingLine finding={finding} onLocate={onLocate} />
          </li>
        ))}
        {shown.length === 0 && (
          <li className="text-[13px] text-subtle">지적 없음</li>
        )}
      </ul>
      {passed.length > 0 && (
        <details className="text-[12px]">
          <summary className="cursor-pointer text-subtle">
            통과 {passed.length}개 보기
          </summary>
          <ul className="mt-1.5 flex flex-col gap-1">
            {passed.map((finding, index) => (
              <li key={index}>
                <FindingLine finding={finding} onLocate={onLocate} />
              </li>
            ))}
          </ul>
        </details>
      )}
      {counts.unchecked > 0 && (
        <p className="text-[12px] text-subtle">
          검사 불가 항목이 있어요 — OK 전에 담당자가 직접 봐 주세요
        </p>
      )}
      <p className="text-[12px] leading-[1.5] text-subtle">
        사람만 볼 수 있는 항목 {report.humanOnlyChecks.length}개
        {report.humanOnlyChecks.length > 0 &&
          `: ${report.humanOnlyChecks.join(' · ')}`}
      </p>
    </Card>
  );
}

function FindingLine({
  finding,
  onLocate,
}: {
  finding: ValidationFinding;
  onLocate: (path: string) => void;
}) {
  return (
    <span className="flex items-start gap-2 text-[12px] leading-[1.5]">
      <span
        className={cn(
          'mt-px shrink-0 rounded-full px-2 py-px text-[10px] font-bold',
          LEVEL_CHIP[finding.level],
        )}
      >
        {LEVEL_TEXT[finding.level]}
      </span>
      <span className="min-w-0 text-body">
        <span className="font-medium text-strong">{finding.ruleId}</span>
        {finding.path && (
          <>
            {' · '}
            <PathButton path={finding.path} onLocate={onLocate} />
          </>
        )}
        {finding.message && ` · ${finding.message}`}
      </span>
    </span>
  );
}

/** 검증기·AI 검수 공용 — 누르면 그 줄로 스크롤·하이라이트 */
export function PathButton({
  path,
  onLocate,
}: {
  path: string;
  onLocate: (path: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onLocate(path)}
      className="font-mono text-[11px] text-subtle underline-offset-2 hover:text-primary hover:underline"
    >
      {path}
    </button>
  );
}

export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-card px-5 py-4">
      <h3 className="text-[14px] font-bold text-strong">{title}</h3>
      {children}
    </section>
  );
}
