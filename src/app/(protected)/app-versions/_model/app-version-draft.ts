// 앱 버전 정책의 규칙 — 무엇을 고치면 앱이 어떻게 바뀌는지 (docs/screens/app-versions.md).
// 필드는 API 이름이 아니라 "앱에서 일어나는 결과"로 묶는다 — 강제 업데이트 / 업데이트 권유 / 기록
import type { Schema } from '@/shared/api/schema-patch';

export type AppVersion = Schema<'AdminAppVersionResponse'>;
export type Platform = NonNullable<AppVersion['platform']>;

export const PLATFORMS: Platform[] = ['IOS', 'ANDROID'];
export const PLATFORM_LABEL: Record<Platform, string> = {
  IOS: 'iOS',
  ANDROID: 'Android',
};

export interface AppVersionDraft {
  /** 강제 업데이트 */
  minimumSupportedVersionName: string;
  forceUpdateReason: string;
  /** 업데이트 권유 */
  versionName: string;
  buildNumber: string;
  softUpdateReason: string;
  /** 기록 — 판정에는 쓰이지 않는다 */
  releaseNote: string;
  releasedAt: string;
}

export const EMPTY_APP_VERSION_DRAFT: AppVersionDraft = {
  minimumSupportedVersionName: '',
  forceUpdateReason: '',
  versionName: '',
  buildNumber: '',
  softUpdateReason: '',
  releaseNote: '',
  releasedAt: '',
};

export function toAppVersionDraft(version: AppVersion): AppVersionDraft {
  return {
    minimumSupportedVersionName: version.minimumSupportedVersionName ?? '',
    forceUpdateReason: version.forceUpdateReason ?? '',
    versionName: version.versionName ?? '',
    buildNumber:
      version.buildNumber === undefined ? '' : String(version.buildNumber),
    softUpdateReason: version.softUpdateReason ?? '',
    releaseNote: version.releaseNote ?? '',
    releasedAt: toLocalInput(version.releasedAt),
  };
}

export const isSameVersionDraft = (a: AppVersionDraft, b: AppVersionDraft) =>
  JSON.stringify(a) === JSON.stringify(b);

/** "1.4.3" 같은 형태만 받는다 — 앱이 이 값을 자기 버전과 숫자로 비교한다 */
const VERSION_PATTERN = /^\d+\.\d+(\.\d+)?$/;

/** 저장을 막아야 하는 이유. 없으면 null — 잘못된 값이 나가면 앱 전체가 잘못된 화면을 본다 */
export function validateAppVersionDraft(draft: AppVersionDraft): string | null {
  if (!VERSION_PATTERN.test(draft.minimumSupportedVersionName))
    return '최소 지원 버전은 1.3.0 같은 형태로 적어 주세요';
  if (!VERSION_PATTERN.test(draft.versionName))
    return '최신 버전은 1.4.2 같은 형태로 적어 주세요';
  if (draft.buildNumber && !/^\d+$/.test(draft.buildNumber))
    return '빌드 번호는 숫자만 적어 주세요';
  if (!draft.releasedAt) return '배포일을 적어 주세요';
  if (compareVersions(draft.minimumSupportedVersionName, draft.versionName) > 0)
    return '최소 지원 버전이 최신 버전보다 높아요';
  return null;
}

/** 저장 확인 창에 쓸 한 문장 — 이 저장이 앱에서 무슨 일을 일으키는지 */
export function saveImpactSentence(draft: AppVersionDraft): string {
  return `${draft.minimumSupportedVersionName} 미만은 강제 업데이트를, ${draft.versionName} 미만은 업데이트 권유를 보게 돼요.`;
}

/** 버전 문자열 비교 — 1.10.0이 1.9.0보다 높다(문자열 비교면 반대가 된다) */
export function compareVersions(left: string, right: string): number {
  const parts = (value: string) => value.split('.').map(Number);
  const a = parts(left);
  const b = parts(right);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const diff = (a[index] ?? 0) - (b[index] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

/** PATCH 본문 — 빌드 번호는 비어 있으면 보내지 않는다(선택 값) */
export function toAppVersionRequest(draft: AppVersionDraft) {
  return {
    versionName: draft.versionName.trim(),
    buildNumber: draft.buildNumber ? Number(draft.buildNumber) : undefined,
    minimumSupportedVersionName: draft.minimumSupportedVersionName.trim(),
    forceUpdateReason: draft.forceUpdateReason.trim(),
    softUpdateReason: draft.softUpdateReason.trim(),
    releaseNote: draft.releaseNote,
    releasedAt: new Date(draft.releasedAt).toISOString(),
  };
}

// datetime-local 입력이 읽을 수 있는 형태(YYYY-MM-DDTHH:mm)로 — 초·시간대는 버린다
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return '';
  const two = (value: number) => String(value).padStart(2, '0');
  return `${at.getFullYear()}-${two(at.getMonth() + 1)}-${two(at.getDate())}T${two(at.getHours())}:${two(at.getMinutes())}`;
}
