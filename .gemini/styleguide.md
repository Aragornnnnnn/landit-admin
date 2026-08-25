# landit-admin 코드 리뷰 기준

Landit 운영자용 어드민(Next.js 16 · TypeScript · Tailwind · shadcn/ui)이다. 관리자 계정 하나가 뚫리면 전 사용자의 개인정보와 전체 공지가 뚫리는 내부 도구라, 보안과 계약 정확성을 가장 먼저 본다.

## 리뷰 작성 방식

- **한국어로, 간결하고 직접적으로** 쓴다.
- 실제 결함·보안 문제·계약 위반·회귀 가능성처럼 **조치가 필요한 것만** 지적한다. 각 지적에는 근거와 영향을 함께 적는다.
- 취향 차이, CI가 이미 검사하는 포맷(Prettier·ESLint·타입체크), 요청 범위 밖 리팩터링은 제안하지 않는다.
- 확신이 없으면 단정하지 말고 질문으로 남긴다.

## 보안 (가장 중요 — 어기면 반드시 지적)

전체 규칙은 저장소의 `AGENTS.md` "보안 규칙", 근거는 `docs/security.md`에 있다.

- **토큰은 브라우저 JS에 절대 노출하지 않는다.** access/refresh 토큰은 `__Host-` 접두사 httpOnly 쿠키(`Secure; SameSite=Strict; Path=/`)로만 저장한다. localStorage·sessionStorage·전역 상태·`NEXT_PUBLIC_*`·URL·응답 body·로그에 토큰이 들어가면 지적한다.
- **BE 호출은 `/api/proxy/*` 하나로만.** 브라우저가 BE 도메인을 직접 부르거나, Server Action으로 변경 요청을 보내거나, 서버 컴포넌트에서 어드민 데이터를 fetch하면 지적한다.
- **인가는 BE가 판정한다.** 프론트 가드(`src/proxy.ts`, 화면 분기)는 UX일 뿐이다. FE에서 role을 해석해 무언가를 허용하는 코드는 지적한다.
- 프록시·auth route handler의 변경 요청은 same-origin 검사(`shared/security/same-origin.ts`)를 거쳐야 한다. 경로 화이트리스트·`Cache-Control: no-store`·401 재발급 1회 규칙이 약해지면 지적한다.
- `dangerouslySetInnerHTML` 금지. 서버 데이터(편지 contentBlocks 등)는 블록 타입별 컴포넌트로만 렌더한다.
- `?next=` 같은 리다이렉트 파라미터는 같은 오리진 상대 경로만 허용한다(오픈 리다이렉트).
- 로그·에러 메시지에 `Authorization`·쿠키·이메일·닉네임·피드백 원문이 들어가면 지적한다.
- 새 외부 도메인(스크립트·이미지·연결)을 쓰면 `shared/security/csp.ts`와 `docs/security.md`가 함께 갱신됐는지 확인한다.
- 되돌릴 수 없는 작업(일괄 답장·발행·숨기기·앱 버전 저장)에 AlertDialog 확인이 없으면 지적한다.

## API 계약

- 응답 타입은 손으로 쓰지 않는다 — 스웨거에서 생성한 `src/shared/api/schema.d.ts`에서 가져온다(`Schema<>`·`ResponseOf<>` 헬퍼는 `schema-patch.ts`).
- springdoc이 required를 표기하지 않아 생성 타입의 모든 필드가 optional이다. 화면 코드에서 `!`로 뭉개지 말고 feature `api/`에서 좁힌 타입으로 감쌌는지 본다.
- 연결된 백엔드(`Aragornnnnnn/landit-be`)의 endpoint·method·DTO·enum·nullability와 어긋나면 지적한다.

## 구조 (`docs/structure.md`)

- import 방향은 `app → features → shared` 한 방향. 역방향이나 feature 간 가로 import는 지적한다.
- 한 라우트에서만 쓰는 코드는 그 라우트의 `_ui/`·`_model/`에 둔다. 두 번째 사용처가 생길 때 `features/`로 내린다(미리 승격하지 않는다).
- `page.tsx`는 파라미터 해석과 조립만. 로직·HTTP 배선이 들어가면 지적한다.
- `utils.ts`·`helpers.ts`·`types.ts`·`constants.ts` 같은 형태 기반 파일명 금지.
- 파일명 — 컴포넌트 `Pascal.tsx`, 훅 `useCamel.ts`, 나머지 `kebab-case.ts`. 서버 상태 훅은 `Query`/`Mutation` 접미사.
- 함수 이름은 행위 동사구(`submitReply`). `handle~`·`process~` 금지. 콜백 프롭은 `on{사건}`.

## 코드 품질 — [Frontend Fundamentals](https://frontend-fundamentals.com/code-quality/)

- **가독성** — 같이 실행되지 않는 코드를 한 함수에 섞지 않는다. 복잡한 조건·매직 넘버에 이름을 붙인다. 위에서 아래로 읽히게 배치한다.
- **예측 가능성** — 같은 이름엔 같은 동작, 같은 종류의 함수는 같은 반환 형태(route handler 응답은 `apiSuccess`/`apiFailure` 봉투). 숨은 부수효과를 만들지 않는다.
- **응집도** — 함께 바뀌는 것은 한 자리에. 쿠키는 `shared/auth/session-cookie.ts`, CSRF는 `shared/security/same-origin.ts`, BE 배선은 `app/api/_model/backend.ts`.
- **결합도** — 책임은 하나씩. 한두 번의 중복은 섣부른 추상화보다 낫다(세 번째에 뽑는다). Props drilling은 훅을 쓰는 곳으로 내려 끊는다.

## 그 밖

- **수동 메모이제이션(`useCallback`/`useMemo`/`React.memo`) 금지** — React Compiler가 켜져 있다.
- 색·간격은 `globals.css` 토큰만 쓴다. 임의 hex는 지적한다(예외: 소셜 브랜드 색 토큰, `global-error.tsx` 인라인 — `AGENTS.md`에 기록됨).
- 새 로직·버그 수정에 테스트가 없으면 지적한다. 규칙은 `docs/testing.md`(Given/When/Then, 한국어 "~하면 ~한다", 갈림길만, 목은 경계만).
- 화면 변경은 `docs/screens/<화면>.md` 스펙과 일치해야 한다. 다르면 스펙을 먼저 고쳐야 한다.
- 새 의존성은 이유가 PR에 있어야 하고, `pnpm-workspace.yaml`의 `minimumReleaseAge`·`onlyBuiltDependencies`가 완화되면 지적한다.
