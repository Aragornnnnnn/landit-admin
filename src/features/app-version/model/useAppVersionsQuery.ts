'use client';

// 앱 버전 정책 읽기 — 앱 버전 화면과 대시보드 카드가 같은 키로 한 번만 받는다
import { useQuery } from '@tanstack/react-query';

import { fetchAppVersions } from '../api/app-version';

/** 저장 성공 시 무효화하는 키 — 화면과 대시보드가 함께 갱신된다 */
export const APP_VERSIONS_KEY = ['app-versions'] as const;

export function useAppVersionsQuery() {
  return useQuery({
    queryKey: APP_VERSIONS_KEY,
    queryFn: fetchAppVersions,
  });
}
