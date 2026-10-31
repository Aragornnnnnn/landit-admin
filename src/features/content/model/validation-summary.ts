// 검증기·AI 검수·코멘트를 수로 요약한다 — Day 목록의 열과 Day 상세의 카드 제목이 같이 쓴다
import type { ContentReviewComment } from '../api/content-batch';
import type { ValidationLevel, ValidationReport } from '../api/draft-payload';

export type FindingCounts = Record<Lowercase<ValidationLevel>, number>;

/** 판정 수준별 수 — 검증 전이면 전부 0 */
export function summarizeFindings(
  report: ValidationReport | null | undefined,
): FindingCounts {
  const counts: FindingCounts = { pass: 0, warn: 0, fail: 0, unchecked: 0 };
  report?.findings.forEach((finding) => {
    const key = finding.level.toLowerCase() as keyof FindingCounts;
    if (key in counts) counts[key] += 1;
  });
  return counts;
}

/** 표현 탭 제목의 "표면 중복 n · 뜻 중복 n" — 표면은 실제로 겹친 후보만 센다(검사 기록은 12개 전부 있다) */
export function countDuplicates(report: ValidationReport | null | undefined) {
  const surface =
    report?.surfaceDuplicates.filter(
      (item) =>
        item.existingMatches.length > 0 || item.batchMatchIndexes.length > 0,
    ).length ?? 0;
  return { surface, semantic: report?.semanticDuplicates.length ?? 0 };
}

/** 열린 FIX(재생성에 들어갈 것)와 해결된 FIX — OK 코멘트는 세지 않는다 */
export function countFixComments(comments: ContentReviewComment[]) {
  const fixes = comments.filter((comment) => comment.verdict === 'FIX');
  const resolved = fixes.filter((comment) => comment.resolvedAt).length;
  return { open: fixes.length - resolved, resolved };
}
