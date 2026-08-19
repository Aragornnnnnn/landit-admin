// Sentry 브라우저 초기화 — 클라이언트 예외를 수집한다. DSN이 없으면(로컬 기본) 비활성
import * as Sentry from '@sentry/nextjs';

import { sentryInitOptions } from '@/shared/monitoring/sentry-options';

Sentry.init({
  ...sentryInitOptions,
  // 리플레이는 에러 세션만 — 평소엔 버퍼에만 녹화하고 에러가 나면 직전 구간을 첨부한다.
  // 텍스트·입력은 기본 마스킹(maskAllText·blockAllMedia) 그대로 — 사용자 이메일·피드백 원문 보호
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
