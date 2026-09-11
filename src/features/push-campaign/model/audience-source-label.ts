// 대상 출처의 말 — 이름과 ID·SQL 요약. 편집기의 대상 목록과 상세의 대상 구성 카드가 같이 쓴다
import type { AudienceDraft, AudienceSourceKind } from './audience';

export const AUDIENCE_SOURCE_LABEL: Record<AudienceSourceKind, string> = {
  sql: 'SQL',
  selected: '직접 선택',
  pasted: '붙여넣기',
  excluded: '제외',
};

const SHOWN_IDS = 3;

/** "#1284 · #1283 · #1279 · +2" */
export function idsSummary(ids: number[]): string {
  const shown = ids.slice(0, SHOWN_IDS).map((id) => `#${id}`);
  const rest = ids.length - shown.length;
  return rest > 0 ? `${shown.join(' · ')} · +${rest}` : shown.join(' · ');
}

export function audienceSourceSummary(
  draft: AudienceDraft,
  kind: AudienceSourceKind,
): string {
  switch (kind) {
    case 'sql':
      return draft.sql.trim().split('\n')[0] ?? '';
    case 'selected':
      return idsSummary(draft.selectedIds);
    case 'pasted':
      return idsSummary(draft.pastedIds);
    case 'excluded':
      return idsSummary(draft.excludedIds);
  }
}
