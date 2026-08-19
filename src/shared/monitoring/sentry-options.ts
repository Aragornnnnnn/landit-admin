// 서버·클라이언트가 공유하는 Sentry 초기화 옵션 — DSN이 없으면(로컬 기본) SDK가 조용히 꺼진다
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const sentryInitOptions = {
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  // 어드민은 관리자 식별 정보(IP·쿠키·헤더)를 이벤트에 자동으로 붙이지 않는다
  sendDefaultPii: false,
};
