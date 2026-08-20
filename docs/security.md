# 보안 설계

어드민이 지키는 것과 그 이유. 규칙 요약은 [AGENTS.md](../AGENTS.md) "보안 규칙", 인증 흐름은 [auth.md](auth.md). 이 문서가 바뀌면 그 둘도 같이 고친다.

## 위협 모델

어드민은 **전 사용자의 개인정보**(이메일·닉네임·피드백 원문·학습 기록)를 보고, **전 사용자에게 보이는 것**(공지·답장·앱 강제 업데이트 버전)을 바꾼다. 관리자 계정 하나 또는 세션 하나가 뚫리면 서비스 전체가 뚫린다.

| 위협            | 경로                                                                 | 방어                                                                                                                                      |
| --------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 세션 탈취       | XSS로 토큰 읽기, localStorage 덤프, 로그·Sentry에 남은 토큰          | 토큰은 `httpOnly` 쿠키에만 — JS가 못 읽는다. 로그·Sentry·URL에 토큰 금지                                                                  |
| CSRF            | 관리자가 로그인된 브라우저로 악성 페이지 방문 → 어드민 API 변경 요청 | `SameSite=Strict` + 프록시가 변경 요청의 `Sec-Fetch-Site`(없으면 `Origin`) 검사                                                           |
| 인가 우회       | 일반 사용자가 로그인해서 admin URL 직접 호출                         | BE `AdminAuthorizationFilter`(role=ADMIN, 403)가 유일한 인가. FE 가드는 UX                                                                |
| 캐시 누출       | 어드민 응답이 CDN·브라우저·Next 캐시에 남아 다음 사람에게            | 프록시 응답 `Cache-Control: no-store`, 서버 컴포넌트에서 어드민 데이터 fetch 금지(전부 클라이언트→프록시), Query 캐시는 로그아웃 시 clear |
| 저장형 XSS      | 편지 contentBlocks·피드백 원문에 스크립트                            | `dangerouslySetInnerHTML` 금지, 블록 타입별 컴포넌트, CSP `script-src 'self'`                                                             |
| 클릭재킹        | 어드민을 iframe에 넣어 클릭 유도                                     | `frame-ancestors 'none'` + `X-Frame-Options: DENY`                                                                                        |
| 오픈 리다이렉트 | `/login?next=https://evil`                                           | `next`는 같은 오리진 상대 경로만                                                                                                          |
| 공급망          | 탈취된 npm 패키지 버전, postinstall 스크립트                         | pnpm `minimumReleaseAge`(3일), `onlyBuiltDependencies` 명시 허용, lockfile frozen, CI `pnpm audit`                                        |
| 비밀 유출       | `NEXT_PUBLIC_`에 secret, `.env` 커밋, 소스맵 공개                    | 서버 전용 env, `.env*` gitignore, 브라우저 소스맵 off, Sentry 소스맵 업로드 후 삭제                                                       |
| 발견·정찰       | 검색 노출, 공개 레포에 위협 모델                                     | `noindex`+robots, 레포 private                                                                                                            |
| 실수            | 일괄 답장·발행·숨기기·강제 업데이트 오조작                           | AlertDialog에 대상 건수·내용 표시. BE 감사 로그(AdminAuditService)                                                                        |
| DDoS·봇         | 로그인 엔드포인트 폭주                                               | Vercel Firewall rate limit, 비상 시 Attack Challenge Mode                                                                                 |

## 세션

- 로그인 성공 시 route handler가 BE 토큰을 쿠키로 저장한다. 이름 `__Host-landit-admin-access` / `__Host-landit-admin-refresh`. 속성 `HttpOnly; Secure; SameSite=Strict; Path=/`. `__Host-` 접두사는 `Secure`·`Path=/`·`Domain` 없음을 브라우저가 강제한다.
- 만료는 BE 값(access 30분, refresh 14일)을 `Max-Age`로 그대로 쓴다. "로그인 유지" 없음.
- 갱신은 프록시가 서버에서 한다(401 → refresh 1회 → 재시도). 실패하면 쿠키 삭제 + 401 → 클라이언트가 `/login`으로.
- 로그아웃 = BE `/auth/logout`(refresh 무효화) + 두 쿠키 삭제 + TanStack Query 캐시 clear. 셋 중 하나만 하면 안 된다.
- 로컬 개발(`http://localhost`)은 `Secure` 쿠키가 안 붙는다 → 개발 환경에서만 `__Host-` 접두사 없이 `Secure` 생략. 프로덕션 코드 경로와 분기 조건을 테스트로 고정한다.

## 프록시 (`/api/proxy/[...path]`)

- 허용 경로: `/api/v1/admin/**`, `/api/v1/auth/logout`, `/api/v1/auth/token/refresh`(내부 사용). 그 외 404.
- 허용 메서드: GET · POST · PUT · PATCH · DELETE. 변경 메서드는 `Sec-Fetch-Site: same-origin`이어야 한다. 헤더가 없는(구형) 브라우저는 `Origin`이 자기 오리진과 같아야 한다. 둘 다 아니면 403.
- 전달 헤더: `Authorization: Bearer <access>`, `Content-Type`, `Accept`. 쿠키·기타 헤더는 BE로 보내지 않는다.
- 응답 헤더: `Cache-Control: no-store`, `Content-Type` 그대로. `Set-Cookie`는 refresh 갱신 때만 우리가 붙인다.
- 응답 body는 BE 것을 그대로 전달한다(성공·실패 봉투 모두). 토큰은 어떤 응답 body에도 넣지 않는다.
- 로그: 메서드·경로·상태·소요시간만. `Authorization`·쿠키·body 금지.

## 헤더 (`next.config.ts` headers)

| 헤더                        | 값                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`   | `default-src 'self'; script-src 'self' 'nonce-…' https://accounts.google.com https://t1.kakaocdn.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.cloudfront.net https://*.googleusercontent.com https://*.kakaocdn.net; font-src 'self'; connect-src 'self' https://*.ingest.sentry.io https://accounts.google.com https://kauth.kakao.com; frame-src https://accounts.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests` — 도메인 목록은 구현 시 실제 SDK 요구에 맞춰 확정하고 여기 갱신한다 |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `X-Frame-Options`           | `DENY`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `X-Content-Type-Options`    | `nosniff`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=(), payment=(), usb=()`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

- Next 16 인라인 스크립트는 nonce가 필요하다 — `proxy.ts`에서 요청마다 nonce를 만들어 CSP 헤더에 넣는 방식을 쓴다(구현 PR에서 `node_modules/next/dist/docs`의 CSP 가이드 확인). `'unsafe-inline'`을 script-src에 넣지 않는다.
- 외부 스크립트는 Sentry, 카카오·구글 로그인 SDK(로그인 페이지)뿐. 새로 추가하면 위 표와 `next.config.ts`를 함께 고친다.

## 환경·비밀

| 변수                                                                                               | 공개 여부          | 위치                            |
| -------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------- |
| `API_BASE_URL`                                                                                     | 서버 전용          | Vercel env(환경별)              |
| `NEXT_PUBLIC_API_HOST`                                                                             | 공개(표시용)       | Vercel env                      |
| `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID` · `NEXT_PUBLIC_KAKAO_JS_KEY` · `NEXT_PUBLIC_KAKAO_REST_API_KEY` | 공개(client id)    | Vercel env                      |
| `KAKAO_CLIENT_SECRET`                                                                              | **비밀**           | Vercel Sensitive env            |
| `NEXT_PUBLIC_SENTRY_DSN`                                                                           | 공개(전송 전용 키) | Vercel env                      |
| `SENTRY_AUTH_TOKEN` · `SENTRY_ORG` · `SENTRY_PROJECT`                                              | **비밀**           | Vercel Sensitive env(빌드 시만) |

- Preview·로컬은 develop BE, Production만 prod BE. Preview에서 prod BE를 가리키는 env를 만들지 않는다.
- Sentry `sendDefaultPii: false`, replay `maskAllText`. `reportError`/`reportWarning` extra에 사용자 식별 정보 금지.

## Vercel

- Deployment Protection: Preview는 Vercel Authentication 필수. Production도 켤지는 플랜·팀원 계정 여부로 결정(P5).
- Firewall: `/api/auth/*` IP당 rate limit, `/api/proxy/*` 비정상 트래픽 challenge. 비상 시 `vercel firewall attack-mode enable`.
- Git Fork Protection on. 비밀 env는 Sensitive.

## 후속 (지금 안 함, 필요해지면)

- 관리자 판정 API(`/auth/me`)가 생기면 로그인 직후 판정으로 교체 — 지금은 첫 admin 호출 403으로 판정
- 관리자 세션 만료를 사용자보다 짧게(BE 설정) — 운영해보고 결정
- IP 허용 목록(Trusted IPs, Enterprise) — 팀 규모상 보류
