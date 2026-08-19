# Sentry 에러 모니터링

landit-fe [monitoring.md](https://github.com/Aragornnnnnn/landit-fe/blob/develop/docs/monitoring.md)와 같은 규칙. 어드민에서 다른 점만 적는다.

## 원칙

- **도메인 코드는 Sentry를 직접 부르지 않는다.** 수동 보고는 [src/shared/monitoring/report.ts](../src/shared/monitoring/report.ts)의 두 함수로. `@sentry/nextjs` 직접 import는 `instrumentation*.ts`·`sentry-options.ts`·`next.config.ts`에만.
  - `reportError(error, extra?)` — 연산이 실패로 끝났다(답장 전송·발행·앱 버전 저장 실패). `ApiError`면 endpoint·status·code가 태그로 승격된다.
  - `reportWarning(failure, extra?)` — 비정상이지만 감내하고 계속한다(목록 조회 재시도 성공, 이미지 업로드 폴백 등).
- **PII를 보내지 않는다.** `sendDefaultPii: false`. `extra`에 이메일·닉네임·피드백 원문·토큰을 넣지 않는다. 리플레이는 에러 세션만(`replaysOnErrorSampleRate: 1.0`)이고 텍스트·미디어 기본 마스킹 그대로.
- **DSN이 없으면 SDK가 꺼진다.** 로컬은 기본 꺼짐. 전송을 테스트하고 싶을 때만 `.env.local`에 DSN.
- **환경 태그**는 `NEXT_PUBLIC_VERCEL_ENV`(production·preview·development)를 쓴다.

## 수집 경로

| 상황                            | 잡는 곳                                                |
| ------------------------------- | ------------------------------------------------------ |
| 페이지 렌더 중 예외             | `src/app/error.tsx` (reportError)                      |
| 루트 레이아웃까지 죽음          | `src/app/global-error.tsx` (인라인 스타일 최후 방어선) |
| 이벤트 핸들러·비동기 예외       | SDK 자동                                               |
| route handler(프록시·auth) 예외 | `src/instrumentation.ts` `onRequestError`              |
| 저장·발송 실패(catch로 처리)    | 각 mutation에서 reportError                            |

## 프로젝트·환경변수

Sentry org는 landit-fe·landit-be와 같은 `saynow`. 프로젝트는 `admin-develop`(Preview·로컬) / `admin-prod`(Production).

| 변수                                                  | 위치             | 용도                                |
| ----------------------------------------------------- | ---------------- | ----------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN`                              | Vercel 환경별    | 전송 대상. 없으면 SDK off           |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | Vercel Sensitive | 소스맵 업로드. 없으면 업로드만 스킵 |

소스맵은 업로드 후 산출물에서 삭제한다(`deleteSourcemapsAfterUpload`). `@sentry/cli` 바이너리 다운로드를 위해 `pnpm-workspace.yaml` `onlyBuiltDependencies`에 허용돼 있다.
