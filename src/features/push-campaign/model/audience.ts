// 대상 초안의 규칙 — ID 붙여넣기 해석, (SQL ∪ 직접 선택 ∪ 붙여넣기) − 제외 합산, 저장 본문 (docs/screens/push-campaigns.md "새 푸시").
// 편집기가 값을 고치고 여기 함수로 세고 검사한다. 상세는 저장된 캠페인을 이 형태로 되돌려 대상 구성 카드를 그린다
import type {
  PushAudienceType,
  PushCampaign,
  PushCampaignRequest,
} from '../api/push-campaign';

export interface AudienceDraft {
  type: PushAudienceType;
  /** 사용자 목록에서 체크한 ID */
  selectedIds: number[];
  /** 붙여넣어 인식한 ID — 직접 선택과 함께 userProfileIds로 간다 */
  pastedIds: number[];
  /** 발송 시 다시 실행할 SQL. 조회한 결과 ID는 화면 합산에만 쓴다 */
  sql: string;
  sqlIds: number[];
  excludedIds: number[];
}

export const EMPTY_AUDIENCE: AudienceDraft = {
  type: 'ALL',
  selectedIds: [],
  pastedIds: [],
  sql: '',
  sqlIds: [],
  excludedIds: [],
};

/**
 * 저장된 캠페인을 초안 형태로 — 상세의 대상 구성 카드와 "같은 내용으로 새 푸시"가 쓴다.
 * 저장된 userProfileIds는 직접 선택과 붙여넣기가 합쳐진 것이라 직접 선택으로 되돌린다
 */
export function toAudienceDraft(campaign: PushCampaign): AudienceDraft {
  return {
    type: campaign.audienceType,
    selectedIds: campaign.userProfileIds,
    pastedIds: [],
    sql: campaign.audienceSql ?? '',
    sqlIds: [],
    excludedIds: campaign.excludedUserProfileIds,
  };
}

export interface ParsedIds {
  ids: number[];
  recognized: number;
  duplicates: number;
  invalid: number;
}

/** "1284, 1283\n#1279 1201" → ID 목록. 쉼표·세미콜론·공백·줄바꿈이 구분자, 앞의 #은 뗀다. 양의 정수만 인식한다 */
export function parseIdList(text: string): ParsedIds {
  const seen = new Set<number>();
  let duplicates = 0;
  let invalid = 0;
  for (const token of text.split(/[\s,;]+/)) {
    if (!token) continue;
    const digits = token.replace(/^#/, '');
    const id = /^\d+$/.test(digits) ? Number(digits) : 0;
    if (id <= 0) invalid += 1;
    else if (seen.has(id)) duplicates += 1;
    else seen.add(id);
  }
  return { ids: [...seen], recognized: seen.size, duplicates, invalid };
}

/** 중복 없이 오름차순 — BE도 정규화하지만 같은 요청이 같은 본문이 되게 화면에서 먼저 맞춘다 */
export function unionIds(...lists: number[][]): number[] {
  return [...new Set(lists.flat())].sort((a, b) => a - b);
}

/** 지금 조건으로 몇 명인지 — 전체는 화면이 셀 수 없어 null(저장 후 audience-preview가 답한다) */
export function estimateAudienceCount(draft: AudienceDraft): number | null {
  if (draft.type === 'ALL') return null;
  const excluded = new Set(draft.excludedIds);
  return unionIds(draft.sqlIds, draft.selectedIds, draft.pastedIds).filter(
    (id) => !excluded.has(id),
  ).length;
}

export type AudienceSourceKind = 'sql' | 'selected' | 'pasted' | 'excluded';

/** 대상 목록에 그릴 출처 — 값이 있는 것만, 프레임 순서로 */
export function audienceSources(
  draft: AudienceDraft,
): { kind: AudienceSourceKind; count: number }[] {
  const rows: { kind: AudienceSourceKind; count: number }[] = [];
  if (draft.sql.trim()) rows.push({ kind: 'sql', count: draft.sqlIds.length });
  if (draft.selectedIds.length)
    rows.push({ kind: 'selected', count: draft.selectedIds.length });
  if (draft.pastedIds.length)
    rows.push({ kind: 'pasted', count: draft.pastedIds.length });
  if (draft.excludedIds.length)
    rows.push({ kind: 'excluded', count: draft.excludedIds.length });
  return rows;
}

/** 선택은 포함 출처가 하나는 있어야 한다 — 제외만 있는 요청은 BE가 400으로 거부한다 */
export function canSaveAudience(draft: AudienceDraft): boolean {
  if (draft.type === 'ALL') return true;
  return (
    draft.sql.trim().length > 0 ||
    draft.selectedIds.length > 0 ||
    draft.pastedIds.length > 0
  );
}

/** 저장 본문의 대상 부분 — 직접 선택·붙여넣기는 하나로 합치고, SQL은 문장만 보내 발송 시 재실행되게 한다 */
export function toAudienceRequest(
  draft: AudienceDraft,
): Pick<
  PushCampaignRequest,
  'audienceType' | 'userProfileIds' | 'audienceSql' | 'excludedUserProfileIds'
> {
  if (draft.type === 'ALL') {
    return {
      audienceType: 'ALL',
      userProfileIds: [],
      audienceSql: undefined,
      excludedUserProfileIds: [],
    };
  }
  return {
    audienceType: 'SELECTED',
    userProfileIds: unionIds(draft.selectedIds, draft.pastedIds),
    audienceSql: draft.sql.trim() || undefined,
    excludedUserProfileIds: unionIds(draft.excludedIds),
  };
}
