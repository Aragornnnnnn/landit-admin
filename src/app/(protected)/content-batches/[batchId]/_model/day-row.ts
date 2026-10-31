// Day 표의 칸 — 배치 상세의 Day 요약엔 없는 검증기·AI 검수·코멘트 수를 초안 상세에서 센다 (BE 요약 필드가 오면 이 파일을 지운다)
import type { ContentDraft } from '@/features/content/api/content-batch';
import {
  readReviewDefects,
  readValidationReport,
} from '@/features/content/api/draft-payload';
import {
  countFixComments,
  summarizeFindings,
} from '@/features/content/model/validation-summary';

export interface DayRowCells {
  fail: number;
  warn: number;
  unchecked: number;
  defects: number;
  openFix: number;
  resolvedFix: number;
  /** 검증기가 돌았는가 — 아니면 수가 0이어도 "통과"가 아니다 */
  validated: boolean;
  reviewed: boolean;
}

/** 초안을 아직 못 읽었으면 null — 표는 `…`를 그린다 */
export function dayRowCells(
  draft: ContentDraft | undefined,
): DayRowCells | null {
  if (!draft) return null;
  const validation = readValidationReport(draft.validationResult);
  const review = readReviewDefects(draft.reviewResult);
  const findings = summarizeFindings(
    validation.state === 'ok' ? validation.value : null,
  );
  const fixes = countFixComments(draft.comments);
  return {
    fail: findings.fail,
    warn: findings.warn,
    unchecked: findings.unchecked,
    defects: review.state === 'ok' ? review.value.length : 0,
    openFix: fixes.open,
    resolvedFix: fixes.resolved,
    validated: validation.state === 'ok',
    reviewed: review.state === 'ok',
  };
}

/** 승인 배너의 "표현 id {min}~{max} 예약" — 예약된 초안이 하나도 없으면 null */
export function reservedIdRange(
  drafts: (ContentDraft | undefined)[],
): { min: number; max: number } | null {
  const ids = drafts.flatMap((draft) => draft?.reservedExpressionIds ?? []);
  if (ids.length === 0) return null;
  return { min: Math.min(...ids), max: Math.max(...ids) };
}
