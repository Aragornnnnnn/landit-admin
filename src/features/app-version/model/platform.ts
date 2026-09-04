// 앱 플랫폼 — 화면에 그리는 순서와 사람이 읽는 이름. 앱 버전 화면과 대시보드가 같이 쓴다
import type { Platform } from '../api/app-version';

export const PLATFORMS: Platform[] = ['IOS', 'ANDROID'];

export const PLATFORM_LABEL: Record<Platform, string> = {
  IOS: 'iOS',
  ANDROID: 'Android',
};
