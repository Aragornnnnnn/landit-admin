// 앱 버전 정책 API — 경로·응답 타입·조회 함수. 앱 버전 화면과 대시보드가 같이 쓴다
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export type AppVersion = Schema<'AdminAppVersionResponse'>;
export type Platform = NonNullable<AppVersion['platform']>;

export const APP_VERSIONS_PATH = '/api/v1/admin/app-versions';

/** 플랫폼별 정책 전부 — 한 응답에 iOS·Android가 같이 온다 */
export function fetchAppVersions() {
  return api.get<AppVersion[]>(APP_VERSIONS_PATH);
}
