// 제작 규칙 API — 목록·등록·은퇴. 규칙 화면과 Day 상세의 "규칙으로 승격"이 같이 쓴다 (docs/screens/content-batches.md "제작 규칙")
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export const CONTENT_RULES_PATH = '/api/v1/admin/content-rules';

export type ContentRule = Schema<'AdminContentRuleResponse'>;
export type ContentRuleScope = ContentRule['scope'];
export type ContentRuleStatus = ContentRule['status'];

/** 칩 순서 — 프롬프트에 들어가는 순서(공통 → 단계별 → 검수 → 2차 이미지) */
export const CONTENT_RULE_SCOPES: ContentRuleScope[] = [
  'COMMON',
  'LINEUP',
  'QUESTION',
  'EXPRESSION',
  'STAR_MESSAGE',
  'REVIEW',
  'IMAGE',
];

export interface ContentRuleRequest {
  scope: ContentRuleScope;
  ruleText: string;
  /** 담당자 FIX 코멘트에서 승격했을 때만. AI 결함은 코멘트가 아니라 없다 */
  sourceCommentId?: number;
}

/** 전부 한 번에 — 칩마다 수를 보여 주려면 필터 없이 받아 화면이 거른다 */
export function fetchContentRules() {
  return api.get<ContentRule[]>(CONTENT_RULES_PATH);
}

/** 코드는 BE가 scope 접두어 + 다음 번호로 매긴다. 같은 번호가 동시에 등록되면 409 */
export function createContentRule(body: ContentRuleRequest) {
  return api.post<ContentRule>(CONTENT_RULES_PATH, body);
}

/** 상태는 RETIRED만 받는다. 이미 은퇴면 409 */
export function retireContentRule(ruleId: number) {
  return api.patch<ContentRule>(`${CONTENT_RULES_PATH}/${ruleId}`, {
    status: 'RETIRED',
  });
}
