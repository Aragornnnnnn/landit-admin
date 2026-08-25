<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# landit-admin 에이전트 가이드

Landit 운영자용 내부 어드민. 사용자 웹(landit.im, 레포 landit-fe)과 분리된 별도 레포·별도 도메인(admin.landit.im)이다. 화면과 스펙은 Figma `🛠 어드민` 페이지를 따르고, 같은 내용이 `docs/`에 마크다운으로 있다 — **코드보다 문서가 기준이다.** 문서와 다르게 만들어야 하면 문서를 먼저 고친다.

- Figma: https://www.figma.com/design/3LwSPCntVV55PU1CIcXbVN/?node-id=1050-1576
- 백엔드: landit-be (`/api/v1/admin/*`, 스웨거 `https://api-develop.landit.im/swagger-ui`)

## 스택과 구조

Next.js 16 (App Router, TypeScript, Tailwind v4, shadcn/ui, TanStack Query, Vitest). 단일 앱 — 모노레포 아님.

`src`는 landit-fe(apps/web)와 **같은 3층**이다. `app`(라우트·화면) → `features`(도메인) → `shared`(전역 인프라). import는 위에서 아래로만 흐른다. 자세한 규칙은 [docs/structure.md](docs/structure.md).

```
src/
├── app/
│   ├── (public)/login/           로그인 (+ 관리자 아님)         ← _ui/ _model/ 콜로케이션
│   ├── (protected)/              셸(사이드바) 레이아웃 아래 모든 화면
│   │   ├── _ui/                  셸 컴포넌트(사이드바·드로어·상단바)
│   │   ├── page.tsx              대시보드
│   │   ├── feedbacks/{_ui,_model}/  letters/  letters/[id]/  users/  users/[id]/  app-versions/  scenario-test/
│   └── api/
│       ├── auth/                 social-login · logout — BE 토큰을 httpOnly 쿠키로
│       └── proxy/[...path]/      쿠키의 토큰을 Bearer로 붙여 BE로 전달 (유일한 BE 통로)
├── features/<도메인>/{api,model,ui,lib}   두 라우트 이상이 쓰는 것만 — 예: feedback(대시보드+피드백 화면), letter
├── shared/{api,auth,ui,monitoring,lib}
└── proxy.ts                      라우트 가드 — 세션 쿠키 없으면 /login (Next 16: 구 middleware)
```

새 파일의 자리는 이 순서로 정한다. 어드민은 화면 ≈ 도메인이라 대부분 1번에서 끝난다 — **처음엔 라우트에 붙이고, 공유가 생기면 그때 features로 내린다.**

1. **한 라우트에서만 쓰나?** → 그 라우트의 `_ui/`, `_model/`(필요하면 `_api/`). 두 번째 사용처가 생기는 순간 아래층으로 내린다. 미리 승격하지 않는다. 몇 개 라우트만 공유하면 그들을 담는 중첩 그룹의 `_ui/`, 그룹 전체면 그룹 루트 `_ui/`.
2. **두 라우트 이상이 쓰는 도메인 코드인가?** → `features/<도메인>/`. `api/` 요청 함수·응답 타입, `model/` 규칙·상태·쿼리 훅(규칙은 React 없는 순수 모듈 + 옆에 테스트), `ui/` 컴포넌트, `lib/` 보조 도구.
3. **여러 도메인이 쓰는 기술인가?** → `shared/`. 파일이 3개 이상 모이는 주제는 형제 폴더로 독립(`auth`, `monitoring`처럼), `shared/lib`엔 이름 붙일 주제가 없는 범용 유틸·훅만.

import 경로 — 같은 슬라이스 안은 상대 경로, 슬라이스·층을 넘으면 `@/` 절대 경로.

금지 조항.

- `utils.ts` `helpers.ts` `types.ts` `constants.ts` 금지 — 내용물 형태가 아니라 개념으로 파일을 가른다.
- 파일명 — 컴포넌트 `Pascal.tsx`, 훅 `useCamel.ts`, 나머지 `kebab-case.ts`. 테스트는 소스 옆 `*.test.ts(x)`.
- 서버 상태 훅(본체가 useQuery/useMutation 하나)은 `Query`/`Mutation` 접미사.
- `features` 간 가로 import 지양. 불가피하면 이유를 한 줄 주석으로.
- `page.tsx`는 파라미터 해석과 조립만. 로직은 model로.
- 함수 이름은 행위 동사구(`submitReply`, `publishLetter`). `handle~` `process~` 금지. 콜백 프롭은 `on{사건}`.

## 명령어

```bash
pnpm install          # Node 22, pnpm 10 (.nvmrc · packageManager)
pnpm dev              # http://localhost:3000
pnpm lint / typecheck / test / build / format
pnpm api:types        # 스웨거 → src/shared/api/schema.d.ts 재생성 (BE 계약이 바뀌면 먼저 실행)
```

## 작업 방식 — 스펙 주도

1. 화면 작업은 `docs/screens/<화면>.md`를 먼저 읽는다(없으면 Figma 스펙 섹션에서 만든다). 데이터·인터랙션·상태·검증이 거기 있다.
2. **TDD** — 새 로직·버그 수정은 테스트를 먼저 쓴다. 규칙은 [docs/testing.md](docs/testing.md) (Given/When/Then, 한국어 "~하면 ~한다", 갈림길만, 목은 경계만).
3. API 타입은 손으로 쓰지 않는다 — `schema.d.ts`에서 가져온다(`Schema<'이름'>`·`ResponseOf<경로, 메서드>` 헬퍼는 `schema-patch.ts`). 스웨거가 틀린 부분만 `schema-patch.ts`에 두고 BE 수정 후 지운다. springdoc은 required를 안 찍어서 생성 타입의 모든 필드가 optional이다 — 화면 코드에서 `!`로 뭉개지 말고 `parse.ts`를 지난 뒤 feature `api/`에서 실제 계약(필수 필드)을 좁힌 타입으로 한 번 감싼다.
4. 구현 후 Figma 스크린샷과 대조한다(데스크톱 1440 · 모바일 390). **UI는 Figma를 정확히 따른다** — 스펙 텍스트와 화면 프레임이 다르면 **프레임(그림)이 기준**이고, 그 차이는 `docs/`에 열린 질문으로 남긴다. 프레임에 없는 요소를 스펙 문장만 보고 만들지 않는다(예: 서버 카드의 `›`는 스펙 텍스트에만 있어 뺐다).
5. 화면 PR에는 구현 스크린샷과 Figma 원본을 `docs/images/screens/<화면>.png`·`<화면>.figma.png` 쌍으로 커밋하고 PR 본문에 나란히 넣는다(커밋 SHA 기반 blob URL — gh로는 이미지를 올릴 수 없다).
6. 이슈는 노션 `LAN-XX`. 브랜치 `feat/LAN-XX`, `main`·`develop` 직접 커밋 금지. 커밋 `{type}: 한국어 메시지`(앱 하나라 scope 없음). 나머지는 [CONTRIBUTING.md](CONTRIBUTING.md).

## 보안 규칙 (어기면 리뷰 반려)

어드민은 사용자 전체의 개인정보(이메일·닉네임·피드백 원문)를 보고, 전 사용자에게 보이는 콘텐츠(공지·답장·앱 강제 업데이트)를 바꾼다. 관리자 계정 하나가 뚫리면 서비스 전체가 뚫린다. 위협 모델과 근거는 [docs/security.md](docs/security.md).

**세션·토큰**

- access/refresh 토큰은 브라우저 JS에 절대 노출하지 않는다. `/api/auth/*` route handler가 `__Host-` 접두사 쿠키(`httpOnly; Secure; SameSite=Strict; Path=/`)로만 저장한다. localStorage·sessionStorage·zustand persist·`NEXT_PUBLIC_*`·URL·로그에 토큰 금지.
- 토큰 갱신은 서버(프록시 route handler)에서만 한다. 갱신 실패 = 쿠키 삭제 + 401 → 클라이언트는 `/login`으로.
- 로그아웃은 BE `/auth/logout`(refresh 무효화) + 쿠키 삭제 + TanStack Query 캐시 clear를 **반드시 함께** 한다. 캐시만 남으면 다음 계정에 이전 데이터가 보인다.
- "로그인 유지" 같은 장기 세션을 만들지 않는다. refresh 만료(BE 설정)가 세션 끝이다.

**BE 통로·CSRF**

- BE 호출은 `/api/proxy/*` 하나로만. 브라우저가 BE 도메인을 직접 fetch하지 않는다(rewrites도 안 쓴다 — 쿠키 부착이 필요해서). Server Actions로 변경 요청을 보내지 않는다 — 인가·감사 로그가 BE 한 곳에 모이도록 프록시만 쓴다.
- 프록시는 `/api/v1/admin/*`·`/api/v1/auth/*` 화이트리스트 밖 경로와 허용 메서드 밖 요청을 거부한다.
- 쿠키 인증은 CSRF 표면이 생긴다. 프록시는 변경 요청(POST/PUT/PATCH/DELETE)에서 `Sec-Fetch-Site: same-origin`(없으면 `Origin`이 자기 오리진)이 아니면 거부한다. `SameSite=Strict`는 1차, 이 검사가 2차 방어다.
- 프록시 응답에는 `Cache-Control: no-store`. 어드민 데이터는 어떤 계층(브라우저·CDN·Next fetch 캐시·ISR)에도 캐시하지 않는다. 서버 컴포넌트에서 어드민 데이터를 fetch하지 않는다(전부 클라이언트 → 프록시).

**인가**

- 인가는 BE가 판정한다(`role=ADMIN`, 403). `proxy.ts` 라우트 가드와 "관리자 아님" 화면은 UX일 뿐 보호 수단이 아니다. FE에서 role을 판단해 뭔가를 허용하는 코드를 만들지 않는다.
- 로그인 `?next=` 리다이렉트는 같은 오리진의 상대 경로만 허용한다(오픈 리다이렉트 금지).

**입력·출력**

- 서버 데이터를 `dangerouslySetInnerHTML`로 넣지 않는다. 편지 contentBlocks는 블록 타입별 컴포넌트로만 렌더하고, 모르는 타입은 렌더하지 않는다.
- 이미지 업로드는 클라이언트에서 MIME·확장자·크기(10 MiB)를 사전 검증하고 BE presigned URL로만 올린다. presigned URL은 로그·상태에 남기지 않는다.
- 되돌릴 수 없는 작업(일괄 답장·발행·숨기기·앱 버전 저장)은 AlertDialog로 확인받고, 대상 건수·내용을 확인창에 보여준다.
- 오류 메시지는 BE `error.message`까지만 노출한다. 스택·내부 URL·요청 ID 외 상세는 UI에 안 보인다.

**비밀·환경**

- `NEXT_PUBLIC_` 접두사는 공개돼도 되는 값만(API host, 소셜 client id). client secret·기타 비밀은 서버 전용 env. `.env.local`은 gitignore, 실제 값은 Vercel 환경변수에만.
- 환경별로 BE를 분리한다. 프로덕션 배포만 프로덕션 BE를 본다. Preview·로컬은 develop BE.
- 로그(서버 console)에 `Authorization` 헤더·쿠키·이메일·닉네임·피드백 원문을 남기지 않는다. 외부 에러 수집기는 두지 않는다(내부 도구) — 붙이게 되면 요청 헤더·쿠키가 이벤트에 실리지 않게 먼저 막는다.

**헤더·외부 코드**

- 보안 헤더(CSP·HSTS·`frame-ancestors 'none'`·`X-Content-Type-Options`·`Referrer-Policy`·`Permissions-Policy`)는 `next.config.ts` headers()에 있다. 외부 스크립트·도메인을 추가하면 CSP를 같이 갱신하고 `docs/security.md`에 적는다.
- 외부 스크립트는 카카오·구글 로그인 SDK(로그인 페이지에서만)뿐이다. 분석·채팅 위젯·CDN 스크립트를 넣지 않는다.
- `robots.txt` Disallow all + metadata `noindex`. 어드민 URL은 검색에 안 잡힌다.

**의존성**

- 새 의존성은 PR에 이유를 적는다. `pnpm audit --prod`가 CI에서 돈다. `.npmrc`의 `minimum-release-age`(공개 후 며칠 지난 버전만 설치)를 끄지 않는다. lockfile은 `--frozen-lockfile`.
- 빌드 스크립트(postinstall) 실행이 필요한 패키지는 `pnpm-workspace.yaml`의 `onlyBuiltDependencies`에 명시적으로 허용한다.

**보고**

- 실패 보고는 `shared/monitoring/report.ts`(`reportError`/`reportWarning`)로만 한다. 지금은 콘솔, 수집기를 붙이면 그 파일만 바꾼다.

## PR 쪼개기

PR = 노션 이슈 1개 = 한 문장으로 설명되는 변경. 코드 추가 500줄 이하(기계 생성 파일 — shadcn `ui/*`, `schema.d.ts`, lockfile — 은 예외로 두고 PR 설명에 "생성 파일, 리뷰 대상 아님"이라 적는다). 넘으면 쪼갠다.

세팅 단계 순서. 전부 `develop`으로 PR을 쌓는다(`main` 직접 커밋 없음). 셸(7)까지 순서대로 머지하고, 화면 PR(8~17)은 서로 안 겹치게 각자 맡아 병렬로 진행한다.

| #   | PR                   | 내용                                                                                                                                     |
| --- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | 초기 설정            | scaffold · 툴링(prettier·eslint·vitest·husky) · CI · PR 템플릿 · AGENTS/README/CONTRIBUTING · `.env.example`                             |
| 1   | 스펙 문서            | `docs/admin-spec.md` · `docs/screens/*.md` · `docs/security.md` · `docs/auth.md` · `docs/structure.md` · `docs/testing.md`. 코드 없음    |
| 2   | API 타입 생성        | `pnpm api:types` 스크립트 · `schema.d.ts` · `schema-patch.ts`                                                                            |
| 3   | 디자인 토큰 · shadcn | `globals.css` 토큰 · 폰트 · shadcn 초기화 + 컴포넌트                                                                                     |
| 4   | 보안 기반            | `next.config.ts` 헤더 · CSP · `monitoring/report.ts`                                                                                     |
| 5   | BFF 프록시           | `shared/api/{client,parse,api-error}` · `app/api/proxy/[...path]` (쿠키→Bearer · 화이트리스트 · CSRF 검사 · refresh · no-store) + 테스트 |
| 6   | 로그인·세션          | `app/api/auth/*` · `shared/auth/*`(PKCE·카카오·구글) · `proxy.ts` 가드 · `/login` 화면 · 관리자 아님 화면                                |
| 7   | 셸                   | 사이드바 · 모바일 드로어 · 상단바 · 공통 상태 UI(스켈레톤·빈 상태·인라인 오류·토스트·확인창)                                             |
| 8   | 대시보드             |                                                                                                                                          |
| 9   | 피드백 목록          | 필터·페이지·쿼리스트링·스켈레톤·빈 상태·모바일 카드                                                                                      |
| 10  | 피드백 상세·답장     | 행 클릭 상세 · 답장 · 확인창                                                                                                             |
| 11  | 피드백 일괄 답장     | 선택 액션 바 · Dialog/바텀시트 · 함께 답장                                                                                               |
| 12  | 공지·업데이트 목록   | 목록 · 행 메뉴 · 숨기기 확인                                                                                                             |
| 13  | 공지·업데이트 편집   | 새 편지 · 편집 · 미리보기 · 발행                                                                                                         |
| 14  | 공지 이미지 업로드   | presigned PUT · 사전 검증                                                                                                                |
| 15  | 사용자               | 목록 · 상세                                                                                                                              |
| 16  | 앱 버전              | 편집 · 미리보기 · 변경됨/저장 확인                                                                                                       |
| 17  | 시나리오 테스트      | develop 전용                                                                                                                             |
| 18  | Vercel               | env 문서 · 도메인 · Deployment Protection                                                                                                |

화면 PR 안에서도 500줄을 넘으면 `api+model(+테스트)` PR과 `ui+page` PR로 먼저 가른다. 스펙 문서(PR 1)가 먼저 머지돼 있어야 화면 PR 리뷰가 "스펙대로인가"로 끝난다.

## 컨벤션

코드 품질 기준은 [Frontend Fundamentals](https://frontend-fundamentals.com/code-quality/)(토스)를 따른다. 리뷰에서 "왜 이렇게 갈랐나"를 물을 때의 어휘다.

- **가독성** — 같이 실행되지 않는 코드는 한 함수에 섞지 않는다(제공자별·상태별로 가른다). 복잡한 조건·매직 넘버엔 이름을 붙인다(`REFRESH_GRACE_MS`, `isPublicPath`). 위에서 아래로 읽히게 — 호출 순서대로 배치하고 시점 이동을 줄인다.
- **예측 가능성** — 같은 이름엔 같은 동작(서버 `establishSocialSession` vs 콜백 `completeSocialLogin`처럼 다른 일은 다른 이름). 같은 종류의 함수는 같은 반환 형태(route handler 응답은 전부 `apiSuccess`/`apiFailure` 봉투). 숨은 부수효과를 만들지 않는다 — `api.get`이 401에 페이지를 이동시키는 건 문서화된 예외다.
- **응집도** — 함께 바뀌는 것은 한 자리에(쿠키 이름·속성은 `session-cookie.ts`, CSRF 판정은 `security/same-origin.ts`, BE 배선은 `app/api/_model/backend.ts`). 라우트 전용 로직은 그 라우트의 `_model/`.
- **결합도** — 책임은 하나씩(페이지는 조립만, 흐름은 `_model`, HTTP 배선은 gateway). 한두 번의 중복은 섣부른 추상화보다 낫다 — 세 번째가 생길 때 뽑는다. Props drilling은 훅을 쓰는 곳으로 내려 끊는다.

- 포맷·import 순서는 Prettier가 처리한다(`.prettierrc`). 수동 정렬 금지.
- **수동 메모이제이션(useCallback/useMemo/React.memo) 금지** — React Compiler가 켜져 있다.
- 색·간격은 `globals.css` 토큰만 쓴다(사용자 웹과 동일, 페이지 배경만 `#F9FAFB`). 임의 hex 금지. 예외 둘 — 소셜 브랜드 색은 토큰으로 등록해 쓴다(`--kakao`, `SocialIcons`의 규정 색), `global-error.tsx`는 스타일시트 없이 그려져야 해서 토큰 값을 인라인으로 베낀다(값을 바꾸면 같이 바꾼다). 색은 회색·검정 + 오렌지(주 행동·선택·처리중), 빨강은 파괴적 행동·오류에만.
- 반응형은 라우트 분기 없이 같은 데이터 컴포넌트가 breakpoint로 테이블/카드만 바꾼다. 목록 필터·페이지·열린 상세는 쿼리스트링에 둔다.
- 공통 상태(로딩 스켈레톤·빈 상태·인라인 오류·토스트·확인창)는 `docs/admin-spec.md`의 규칙을 따른다.

## 주의사항

- **Next 16은 학습 데이터와 다르다.** 코드 쓰기 전 `node_modules/next/dist/docs/`에서 해당 API를 확인한다. `middleware.ts`는 `proxy.ts`로 바뀌었다.
- 관리자 판정은 소셜 로그인 응답의 `data.user.role`로 한다(LAN-337). ADMIN이 아니면 콜백이 세션을 끝내고 "관리자 아님" 화면을 보여준다 — 별도 판정 호출이 없다.
- `plan.md` `checklist.md` `context-notes.md`는 에이전트 작업 문서라 gitignore다. 결정을 내리면 `context-notes.md`에 이유와 함께 남긴다.
