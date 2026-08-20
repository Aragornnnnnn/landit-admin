# 폴더 구조

`src`의 코드 배치 규칙. landit-fe `apps/web`과 같은 3층이라 두 레포를 오가도 같은 자리에 같은 것이 있다. 요약은 [AGENTS.md](../AGENTS.md) "스택과 구조".

## 세 층

| 층          | 위치                     | 역할                                                                      |
| ----------- | ------------------------ | ------------------------------------------------------------------------- |
| **라우팅**  | `src/app/`               | 라우트·화면. 한 화면에서만 쓰는 UI·로직은 여기 콜로케이션한다             |
| **feature** | `src/features/{도메인}/` | 두 라우트 이상이 쓰는 도메인 코드. `api`·`model`·`ui`·`lib` 세그먼트      |
| **shared**  | `src/shared/`            | 여러 도메인이 쓰는 기술 — api 클라이언트, auth, ui 프리미티브, monitoring |

import는 `app → features → shared` 한 방향. shared는 features를, features는 app을 모른다.

## `app/` — 라우트

```
app/
├── layout.tsx                루트 — lang·metadata(noindex)·globals.css·QueryClientProvider·Toaster
├── robots.ts
├── (public)/
│   └── login/                page.tsx · _ui/(로그인 카드·관리자 아님) · _model/(로그인 흐름 훅)
│       └── auth/[provider]/callback/   소셜 로그인 콜백 (필요 시)
├── (protected)/
│   ├── layout.tsx            셸 — SidebarProvider·사이드바·상단바. 인증 판단은 proxy.ts가 이미 했다
│   ├── _ui/                  셸 컴포넌트(AppSidebar·MobileDrawer·TopBar·AccountMenu·ServerCard)
│   ├── _model/               내비 정의(경로·라벨·아이콘·배지 쿼리)
│   ├── page.tsx              대시보드 → _ui/ _model/
│   ├── feedbacks/            page.tsx · _ui/(테이블·카드·필터·상세 시트·답장 폼·일괄 답장 다이얼로그) · _model/(필터 파싱·선택 상태·쿼리 훅)
│   ├── letters/              page.tsx · new/page.tsx · [id]/page.tsx · _ui/ · _model/
│   ├── users/                page.tsx · [id]/page.tsx · _ui/ · _model/
│   ├── app-versions/         page.tsx · _ui/ · _model/
│   └── scenario-test/        page.tsx · _ui/ · _model/
└── api/
    ├── auth/social-login/route.ts    BE 토큰 → 쿠키
    ├── auth/logout/route.ts
    └── proxy/[...path]/route.ts      쿠키 → Bearer, 화이트리스트, CSRF, refresh, no-store
```

- 라우트 그룹은 **접근 조건**으로 가른다 — `(public)` 비로그인 접근 가능, `(protected)` 세션 쿠키 필요(`proxy.ts`가 리다이렉트).
- `_ui/` `_model/`(필요하면 `_api/`)는 그 라우트 전용. `_` 접두사라 라우팅에서 빠진다.
- 몇 개 라우트만 공유하면 그들을 감싸는 중첩 그룹의 `_ui/`, `(protected)` 전체면 `(protected)/_ui/`.
- `page.tsx`는 searchParams·params 해석과 조립만. 로직은 `_model/`로.
- `app/api`는 요청을 **받는** 쪽(route handler는 해석·위임만), features의 `api`는 요청을 **보내는** 코드.

## `features/{도메인}/` — 공유 도메인 코드

처음부터 만들지 않는다. **두 번째 사용처가 생기는 순간** 라우트의 `_model/`·`_ui/`에서 내린다. 예상되는 후보 —

- `features/feedback/` — 대시보드(미답변 수·최근 피드백)와 `/feedbacks`가 같이 쓰는 api·쿼리 키·상태 칩 매핑
- `features/letter/` — 대시보드(임시저장 수)와 `/letters`
- `features/app-version/` — 대시보드(앱 버전 2건)와 `/app-versions`

세그먼트.

| 세그먼트 | 내용                                                                                        |
| -------- | ------------------------------------------------------------------------------------------- |
| `api/`   | 요청 함수·응답 타입(타입은 `shared/api/schema.d.ts`에서 가져와 별칭만)                      |
| `model/` | 도메인 규칙·상태·쿼리 훅. 규칙은 React 없는 순수 모듈로 쓰고 옆에 테스트. 훅은 배선만       |
| `ui/`    | 도메인 컴포넌트                                                                             |
| `lib/`   | 도메인을 거드는 보조 도구. model과 헷갈리면 "기획 회의에서 언급될 내용인가"(그렇다 → model) |

`hooks`·`components`·`types`·`utils` 같은 형태 기반 이름은 만들지 않는다.

## `shared/` — 전역 인프라

```
shared/
├── api/         client.ts(api.get/post/…) · parse.ts(BE 응답 봉투) · api-error.ts · schema.d.ts(생성) · schema-patch.ts · query-client.ts
├── auth/        crypto.ts(PKCE·nonce) · web-social-login.ts · session-cookie.ts(이름·속성, 서버 전용) · clear-session.ts
├── ui/          shadcn 생성물(button·dialog·…) + 우리 프리미티브(EmptyState·InlineError·StatusChip·PageHeader)
├── monitoring/  report.ts(reportError·reportWarning)
└── lib/         이름 붙일 주제가 없는 범용 유틸·훅만
```

- 파일이 3개 이상 모이는 주제는 형제 폴더로 독립시킨다(`auth`·`monitoring`처럼). `shared/lib`은 최후의 자리.
- `shared/ui`의 shadcn 생성물은 리뷰 대상이 아니다(CodeRabbit path_filters 제외). 손대면 커밋 메시지에 이유를 적는다. shadcn 별칭(`components.json`)은 `ui`·`components`→`@/shared/ui`, `utils`→`@/shared/lib/cn`, `lib`·`hooks`→`@/shared/lib`. `shared/lib/use-mobile.ts`는 shadcn이 정한 이름이라 훅 파일명 규칙(`useCamel.ts`)의 예외다.
- 서버 전용 모듈(쿠키·프록시 헬퍼)은 `import 'server-only'`를 첫 줄에 둔다 — 클라이언트 번들에 섞이면 빌드가 깨지게.

## 파일 이름

| 종류      | 규칙                   | 예                                                           |
| --------- | ---------------------- | ------------------------------------------------------------ |
| 컴포넌트  | PascalCase             | `FeedbackTable.tsx` `AppSidebar.tsx`                         |
| 훅        | `use` + camelCase      | `useFeedbackListQuery.ts` `useReplyMutation.ts`              |
| 그 외     | kebab-case             | `session-cookie.ts` `feedback-filter.ts`                     |
| 테스트    | 소스 옆 `*.test.ts(x)` | `feedback-filter.test.ts`                                    |
| Next 예약 | 변형 금지              | `page.tsx` `layout.tsx` `loading.tsx` `error.tsx` `route.ts` |

- 서버 상태 훅(본체가 useQuery/useMutation 하나)은 `Query`/`Mutation` 접미사. 여러 쿼리를 지휘하는 훅은 제외.
- 함수는 행위 동사구(`submitReply`, `publishLetter`, `hideLetter`). `handle~`·`process~` 금지. 콜백 프롭은 `on{사건}`(`onSubmit`, `onSelectRow`).
- import 경로 — 같은 슬라이스 안은 상대 경로, 슬라이스·층을 넘으면 `@/`.

## 관통 규칙

1. shared → features import 금지. features 간 가로 import 지양(불가피하면 한 줄 주석).
2. 빈 폴더를 미리 만들지 않는다. 위 트리는 청사진이고 각 폴더는 그 화면을 만들 때 생긴다.
3. `index.ts` barrel export는 쓰지 않는다. 팀원이 늘면 slice별 공개 API·import 경계 ESLint를 그때 도입한다.
4. 반응형은 라우트 분기 없이 같은 데이터 컴포넌트가 breakpoint로 테이블/카드만 바꾼다 — 그래서 `FeedbackTable`과 `FeedbackCardList`는 같은 `_ui/`에 나란히 있고, 부모가 하나만 고른다.
