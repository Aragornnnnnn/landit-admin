// Day 초안 payload를 화면 줄로 — 표현의 전체 순번·중복 배지, 검증기 정렬, 제목 카드 보조 문구, path → 줄 id (docs/screens/content-batches.md "Day 초안 상세")
import {
  CONTENT_LEVELS,
  type ContentLevel,
  type DraftExpression,
  type LineupRow,
  type ScenarioDraft,
  type ValidationFinding,
  type ValidationReport,
} from '@/features/content/api/draft-payload';
import {
  referenceOf,
  targetOfPath,
  type ReviewReference,
} from '@/features/content/model/review-reference';

export interface DuplicateBadge {
  kind: 'surface' | 'semantic';
  /** `E-DEDUP-KEY · 기존 #1948` / `기존 'hands down'` / `이 배치 #3` / `뜻 중복 #1950` (스펙 "표현 탭") */
  label: string;
}

export interface ExpressionRow {
  expression: DraftExpression;
  /** 전체 순번 1~12 — payload 순서. 검증기의 `expressions[3]`과 참조 `[E 4]`가 이 번호다 */
  ordinal: number;
  level: ContentLevel;
  /** 레벨 안 0~3 — BE targetPath `expressions[{level}][{index}]` */
  index: number;
  reference: ReviewReference;
  duplicates: DuplicateBadge[];
}

/** payload 순서를 지킨다 — surfaceDuplicates·semanticDuplicates의 index가 이 순서다 */
export function expressionRows(
  expressions: DraftExpression[],
  report: ValidationReport | null,
): ExpressionRow[] {
  const seen: Record<ContentLevel, number> = {
    LEVEL_1: 0,
    LEVEL_2_TO_3: 0,
    LEVEL_4_TO_5: 0,
  };
  return expressions.map((expression, position) => {
    const level = CONTENT_LEVELS.includes(expression.levelGroup)
      ? expression.levelGroup
      : 'LEVEL_1';
    const index = seen[level]++;
    const ordinal = position + 1;
    return {
      expression,
      ordinal,
      level,
      index,
      reference: referenceOf({ kind: 'expression', level, index, ordinal }),
      duplicates: duplicateBadges(position, report),
    };
  });
}

function duplicateBadges(
  position: number,
  report: ValidationReport | null,
): DuplicateBadge[] {
  if (!report) return [];
  const badges: DuplicateBadge[] = [];
  report.surfaceDuplicates
    .filter((item) => item.index === position)
    .forEach((item) => {
      item.existingMatches.forEach((match) =>
        badges.push({
          kind: 'surface',
          label: match.targetExpressionText
            ? `기존 '${match.targetExpressionText}'`
            : `E-DEDUP-KEY · 기존 #${match.id}`,
        }),
      );
      if (item.batchMatchIndexes.length > 0)
        badges.push({
          kind: 'surface',
          label: `이 배치 #${item.batchMatchIndexes.map((i) => i + 1).join(', #')}`,
        });
    });
  report.semanticDuplicates
    .filter((item) => item.index === position)
    .forEach((item) =>
      badges.push({
        kind: 'semantic',
        label: `뜻 중복 #${item.duplicateOfId}`,
      }),
    );
  return badges;
}

const LEVEL_ORDER: Record<ValidationFinding['level'], number> = {
  FAIL: 0,
  WARN: 1,
  UNCHECKED: 2,
  PASS: 3,
};

/** 검증기 카드 순서 — FAIL → WARN → UNCHECKED. PASS는 따로 접어 둔다 */
export function splitFindings(findings: ValidationFinding[]) {
  const shown = findings
    .filter((finding) => finding.level !== 'PASS')
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  const passed = findings.filter((finding) => finding.level === 'PASS');
  return { shown, passed };
}

/** 제목 카드 보조 — `chloe · EASY · 카테고리 여행 · AI 선발화`. 라인업 행이 없으면 시나리오 payload로, 둘 다 없으면 빈 문자열 */
export function draftMeta(
  scenario: ScenarioDraft | null,
  lineup: LineupRow | null,
  categoryName?: string,
): string {
  const core = scenario?.scenario;
  const characterId = lineup?.characterId ?? core?.characterId;
  if (!characterId) return '';
  const difficulty = lineup?.difficulty ?? core?.difficulty;
  const firstSpeaker = lineup?.firstSpeaker ?? core?.firstSpeaker;
  const categoryOrder =
    lineup?.categoryDisplayOrder ?? core?.categoryDisplayOrder;
  const category =
    lineup?.proposedCategory ??
    categoryName ??
    (categoryOrder != null ? `#${categoryOrder}` : null);
  return [
    characterId,
    difficulty,
    category ? `카테고리 ${category}` : null,
    firstSpeaker ? `${firstSpeaker} 선발화` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export type DraftTab = 'questions' | 'expressions' | 'stars' | 'lineup';

/** 줄 DOM id — 검증기·결함 path를 눌렀을 때 스크롤할 곳 */
export const rowElementId = (path: string) =>
  `draft-row-${path.replace(/[^A-Za-z0-9_-]/g, '_')}`;

/**
 * 검증기·결함 path → 줄의 저장 경로와 탭. 표현을 전체 순번으로 적은 경로(`expressions[3]`)는 줄 목록에서 레벨 경로로 바꾼다.
 * 가리키는 줄이 없으면(scenario.aiRole 등) null
 */
export function locateRow(
  path: string | null | undefined,
  rows: ExpressionRow[],
): { tab: DraftTab; path: string } | null {
  const target = targetOfPath(path);
  if (!target) return null;
  if (target.kind === 'question')
    return { tab: 'questions', path: referenceOf(target).path };
  if (target.kind === 'star')
    return { tab: 'stars', path: referenceOf(target).path };
  if ('level' in target)
    return { tab: 'expressions', path: referenceOf(target).path };
  // 검증기가 전체 순번으로 적은 표현 — 줄 목록에서 레벨 경로로
  const row = rows.find((candidate) => candidate.ordinal === target.ordinal);
  return row ? { tab: 'expressions', path: row.reference.path } : null;
}
