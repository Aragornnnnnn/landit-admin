# 인증·세션·프록시

로그인부터 로그아웃까지 토큰이 어디를 지나가는지. 규칙의 근거는 [security.md](security.md), 화면은 [screens/login.md](screens/login.md).

## 한 줄 요약

브라우저는 토큰을 절대 보지 못한다. 카카오·구글 로그인으로 받은 `id_token`을 우리 route handler에 주면, route handler가 BE에서 access/refresh 토큰을 받아 `httpOnly` 쿠키로 심고, 이후 모든 BE 호출은 `/api/proxy/*`가 쿠키를 `Authorization: Bearer`로 바꿔 대신 보낸다.

## 등장인물

| 이름                          | 위치                              | 역할                                                                                                                      |
| ----------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 로그인 화면                   | `app/(public)/login` (클라이언트) | 카카오·구글 웹 로그인 시작·콜백 처리 → `id_token`·`nonce` 획득                                                            |
| `POST /api/auth/social-login` | route handler (서버)              | `id_token`을 BE `/api/v1/auth/social-login`에 전달 → 토큰 응답을 쿠키로 저장. 응답 body엔 `{ success, data: { user } }`만 |
| `POST /api/auth/logout`       | route handler (서버)              | BE `/api/v1/auth/logout` 호출 + 쿠키 삭제                                                                                 |
| `/api/proxy/[...path]`        | route handler (서버)              | 쿠키 → Bearer, 화이트리스트, CSRF 검사, 401 시 refresh 1회, `no-store`                                                    |
| `src/proxy.ts`                | Next 16 Proxy(구 middleware)      | 세션 쿠키 없이 `(protected)` 경로 접근 → `/login?next=` 리다이렉트. UX 가드                                               |
| `shared/api/client.ts`        | 클라이언트                        | `api.get/post/…` → `/api/proxy/…` 호출. 401 → `/login`, 403 → 관리자 아님 화면                                            |
| BE `AdminAuthorizationFilter` | landit-be                         | `/api/v1/admin/**`에서 role=ADMIN 아니면 403. **유일한 인가**                                                             |

## 시퀀스

### 로그인

```
브라우저(/login) ── 카카오/구글 웹 로그인(PKCE·nonce) ──▶ id_token
브라우저 ── POST /api/auth/social-login {provider, idToken, nonce} ──▶ route handler
route handler ── POST {API_BASE_URL}/api/v1/auth/social-login ──▶ BE
BE ──▶ {accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn, user}
route handler ──▶ Set-Cookie: __Host-landit-admin-access (Max-Age=accessTokenExpiresIn)
               ──▶ Set-Cookie: __Host-landit-admin-refresh (Max-Age=refreshTokenExpiresIn)
               ──▶ body: { success: true, data: { user } }   (토큰 없음)
브라우저 ── router.replace(next ?? '/')
소셜 로그인 응답 data.user.role ──▶ ADMIN → 들여보냄 / 그 외 → 로그아웃 + "관리자 아님" 화면
```

- 카카오·구글 로그인 코드는 landit-fe `shared/auth/web-social-login.ts`·`crypto.ts`를 옮긴다(PKCE·nonce·state 검증 포함). redirect URI는 `/auth/{provider}/callback`으로 고정하고 각 콘솔에 등록한다.
- 관리자 판정은 **로그인 응답의 `data.user.role`**로 한다(LAN-337). ADMIN이 아니거나 role이 없으면(옛 빌드 대비) 세션을 바로 끝내고 "관리자 아님" 화면 — 모르면 닫는 쪽이 안전하다. 화면 진입 후의 실제 인가는 여전히 BE(`AdminAuthorizationFilter`) 몫이다.

### 요청

```
클라이언트 ── api.get('/api/v1/admin/mailbox/feedbacks?…') ──▶ GET /api/proxy/api/v1/admin/mailbox/feedbacks?…
proxy ── 경로 화이트리스트 확인 · (변경 요청이면) Sec-Fetch-Site same-origin 확인
proxy ── Authorization: Bearer <access 쿠키> ──▶ BE
BE ──▶ 200 → proxy ──▶ 200 + Cache-Control: no-store (body 그대로)
BE ──▶ 401 → proxy ── POST /auth/token/refresh {refreshToken 쿠키} ──▶ BE
        ├ 성공 → 새 쿠키 Set-Cookie + 원 요청 재시도 1회 → 그 결과 전달 (재시도도 401이면 쿠키 삭제 + 401 — 루프 방지)
        └ 실패 → 두 쿠키 삭제 + 401 → 클라이언트 /login
BE ──▶ 403 → proxy ──▶ 403 → 클라이언트 "관리자 아님" 화면
```

- BE refresh는 회전(rotation)형이다 — 같은 refresh 토큰으로 두 번 갱신하면 두 번째는 실패한다. 프록시는 옛 토큰을 키로 갱신 결과를 30초 기억해(`REFRESH_GRACE_MS`), 브라우저가 새 쿠키를 받기 전에 옛 토큰으로 들어온 형제 요청도 같은 새 토큰을 쓴다. 인스턴스 간(서버리스 여러 대) 경합은 "실패 → 재로그인"으로 감내한다(어드민 트래픽 규모에서 충분).

### 로그아웃

```
클라이언트 ── POST /api/auth/logout ──▶ route handler
route handler ── POST BE /auth/logout {refreshToken 쿠키} (실패해도 계속)
              ──▶ 두 쿠키 삭제(Max-Age=0)
클라이언트 ── queryClient.clear() ── router.replace('/login')
```

### 라우트 가드 (`proxy.ts`)

```
요청 ── (protected) 경로 && refresh 쿠키 없음 → 302 /login?next=<pathname>
요청 ── /login && refresh 쿠키 있음 → 302 /
그 외 → 통과 (+ CSP nonce 헤더)
```

- 쿠키 **존재**만 본다. 유효성은 BE가 판정한다(만료 쿠키로 들어와도 첫 프록시 호출이 401 → refresh 또는 /login).
- `next`는 `new URL`로 해석해 같은 오리진이고 공개 경로(`/login`·`/auth/*`)가 아닐 때만 허용. 아니면 `/`. 제어 문자(탭·개행)는 거부 — URL 파서가 지워 `//evil`로 읽힌다.

## 쿠키 속성

|           | 값                                                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 이름      | `__Host-landit-admin-access`, `__Host-landit-admin-refresh`                                                                                                     |
| 속성      | `HttpOnly; Secure; SameSite=Strict; Path=/` (`Domain` 없음 — `__Host-` 요구)                                                                                    |
| Max-Age   | BE 응답의 `*ExpiresIn` 초                                                                                                                                       |
| 로컬 개발 | `http://localhost`는 `Secure` 쿠키를 못 심는다 → `NODE_ENV !== 'production'`이면 접두사 없이 `landit-admin-access` + `Secure` 생략. 이 분기는 테스트로 고정한다 |

## 클라이언트가 아는 것

- 로그인 여부: 몰라도 된다. `(protected)`에 들어왔다는 것 자체가 `proxy.ts`를 통과했다는 뜻이고, 첫 쿼리 401이 세션 만료 신호다.
- 내 계정 표시(사이드바 이름): 콜백이 `user.nickname`(비민감)만 `sessionStorage`에 남기고(`account-display.ts`) 사이드바가 읽는다. `/auth/me` API가 생기면 서버에서 읽고 이 저장소는 지운다.

## 테스트로 고정할 것

- 프록시: 화이트리스트 밖 경로 404(`..%2F` 같은 세그먼트 안 구분자 포함) · 변경 요청에 `Sec-Fetch-Site: cross-site` 403 · 401→refresh→재시도 1회 · 재시도도 401이면 쿠키 삭제 · refresh 실패 시 쿠키 삭제 · 옛 토큰 재요청은 캐시된 새 토큰 사용 · 응답에 `no-store` · `Authorization`을 BE에만 붙이고 응답엔 없음 · `API_BASE_URL` 경로 prefix 유지
- social-login: 쿠키 속성(HttpOnly·Secure·SameSite·Path·Max-Age) · body에 토큰 없음 · 로컬 분기
- proxy.ts: 쿠키 없음 → `/login?next=` · `next` 오픈 리다이렉트·제어 문자·공개 경로 거부
- logout: BE 실패해도 쿠키는 지운다
