// 규칙 필터 ↔ 쿼리스트링 — scope 칩 · 상태 Select. 목록은 필터 없이 한 번에 받아 화면이 거른다(칩마다 수를 보여 주기 위해) (docs/screens/content-batches.md "제작 규칙")
import {
  CONTENT_RULE_SCOPES,
  type ContentRule,
  type ContentRuleScope,
  type ContentRuleStatus,
} from '@/features/content/api/content-rule';

export type RuleStatusFilter = ContentRuleStatus | 'ALL';

export interface RuleFilter {
  /** 없으면 전체 */
  scope: ContentRuleScope | undefined;
  /** 기본 ACTIVE — 프롬프트에 들어가는 규칙이 먼저 보인다 */
  status: RuleStatusFilter;
}

/** Select 순서 */
export const RULE_STATUS_FILTERS: RuleStatusFilter[] = [
  'ACTIVE',
  'RETIRED',
  'ALL',
];

export const RULE_STATUS_FILTER_LABEL: Record<RuleStatusFilter, string> = {
  ACTIVE: '상태: ACTIVE',
  RETIRED: '상태: RETIRED',
  ALL: '상태: 전체',
};

export function readRuleFilter(params: {
  get(key: string): string | null;
}): RuleFilter {
  const scope = params.get('scope') ?? '';
  const status = params.get('status') ?? '';
  return {
    scope: CONTENT_RULE_SCOPES.includes(scope as ContentRuleScope)
      ? (scope as ContentRuleScope)
      : undefined,
    status: RULE_STATUS_FILTERS.includes(status as RuleStatusFilter)
      ? (status as RuleStatusFilter)
      : 'ACTIVE',
  };
}

/** 기본값은 적지 않는다 — 주소가 짧을수록 공유·비교가 쉽다 */
export function writeRuleFilter(filter: RuleFilter): string {
  const params = new URLSearchParams();
  if (filter.scope) params.set('scope', filter.scope);
  if (filter.status !== 'ACTIVE') params.set('status', filter.status);
  return params.toString();
}

function matchesStatus(rule: ContentRule, status: RuleStatusFilter): boolean {
  return status === 'ALL' || rule.status === status;
}

export function filterRules(
  rules: ContentRule[],
  filter: RuleFilter,
): ContentRule[] {
  return rules.filter(
    (rule) =>
      matchesStatus(rule, filter.status) &&
      (!filter.scope || rule.scope === filter.scope),
  );
}

export type ScopeChip = ContentRuleScope | 'ALL';

/** 칩의 수는 현재 상태 필터 안의 수 — 칩을 눌렀을 때 보일 행 수와 같다 */
export function countRulesByScope(
  rules: ContentRule[],
  status: RuleStatusFilter,
): Record<ScopeChip, number> {
  const counts = Object.fromEntries(
    ['ALL', ...CONTENT_RULE_SCOPES].map((key) => [key, 0]),
  ) as Record<ScopeChip, number>;
  rules.forEach((rule) => {
    if (!matchesStatus(rule, status)) return;
    counts.ALL += 1;
    counts[rule.scope] += 1;
  });
  return counts;
}

/** 출처 — 담당자 코멘트에서 승격했으면 그 코멘트, 아니면 시드 데이터거나 이 화면에서 직접 등록 */
export function ruleSourceLabel(rule: ContentRule): string {
  return rule.sourceCommentId !== null
    ? `코멘트 #${rule.sourceCommentId}`
    : '시드·직접';
}

/** 빈 상태 문구 — 원래 없는지, 조건 때문에 없는지 가른다 */
export function ruleEmptyLabel(filter: RuleFilter): string {
  if (filter.scope) return '이 scope에 규칙이 없어요';
  if (filter.status === 'RETIRED') return '은퇴한 규칙이 없어요';
  if (filter.status === 'ACTIVE') return '프롬프트에 들어가는 규칙이 없어요';
  return '등록된 규칙이 없어요';
}
