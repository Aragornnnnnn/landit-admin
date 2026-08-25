// 미리보기가 말하는 것 — 지금 입력값이면 어떤 앱이 어떤 화면을 보게 되는지 (docs/screens/app-versions.md).
// 범위 문장이 곧 이 정책의 뜻이라, 화면이 아니라 여기서 만든다
import type { AppVersionDraft } from './app-version-draft';

/** 앱이 보여 줄 두 화면 */
export type UpdateKind = 'force' | 'soft';

/** 문구를 비웠을 때 앱이 대신 쓰는 말 — 어드민이 "빈칸 = 아무것도 안 뜸"으로 오해하지 않게 그대로 보여 준다 */
export const APP_DEFAULT_REASON: Record<UpdateKind, string> = {
  force: '새로운 기능을 사용하려면 업데이트가 꼭 필요해요',
  soft: '새로워진 기능을 만나보세요',
};

export const UPDATE_KIND_LABEL: Record<UpdateKind, string> = {
  force: '강제 업데이트',
  soft: '업데이트 권유',
};

/** 앱에 실제로 뜰 문구 — 비었으면 앱 기본 문구 */
export function previewReason(
  draft: AppVersionDraft,
  kind: UpdateKind,
): string {
  const written =
    kind === 'force' ? draft.forceUpdateReason : draft.softUpdateReason;
  return written.trim() || APP_DEFAULT_REASON[kind];
}

/**
 * 그 화면을 보게 되는 버전 범위.
 * 강제는 "1.3.0 미만", 권유는 "1.3.0 ~ 1.4.1" — 상한은 최신 바로 아래를 뜻한다(최신은 아무것도 안 뜬다)
 */
export function previewRangeLabel(
  draft: AppVersionDraft,
  kind: UpdateKind,
): string {
  const min = draft.minimumSupportedVersionName || '—';
  if (kind === 'force') return `${min} 미만`;
  const below = versionBelow(draft.versionName);
  return below ? `${min} ~ ${below}` : `${min} 이상`;
}

// "1.4.2" → "1.4.1". 마지막 자리가 0이면 한 칸 위를 줄일 수 없어 범위를 열어 둔다
function versionBelow(version: string): string | null {
  const parts = version.split('.').map(Number);
  if (parts.some(Number.isNaN) || parts.length === 0) return null;
  const last = parts[parts.length - 1];
  if (!last) return null;
  return [...parts.slice(0, -1), last - 1].join('.');
}
