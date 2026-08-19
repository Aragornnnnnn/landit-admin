# landit-admin

Landit 운영자용 어드민. 피드백 답장, 공지·업데이트 편지 발행, 사용자 조회, 앱 버전 관리를 한다. 사용자 웹(landit.im)과 분리된 별도 서비스로 `admin.landit.im`에 배포한다.

- 화면·스펙: [Figma 🛠 어드민](https://www.figma.com/design/3LwSPCntVV55PU1CIcXbVN/?node-id=1050-1576) · 마크다운 판 [docs/admin-spec.md](docs/admin-spec.md)
- 백엔드: landit-be `/api/v1/admin/*` ([스웨거](https://api-develop.landit.im/swagger-ui))
- 사용자 웹: landit-fe

## 스택

Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · TanStack Query · Sentry · Vitest. 단일 앱(모노레포 아님).

## 요구사항

- Node.js 22 (`.nvmrc`). 하한은 Next.js 16 요구사항 20.9 — 미만이면 `pnpm install`이 실패한다
- pnpm 10 (`npm install -g pnpm`)

## 시작하기

```bash
pnpm install
cp .env.example .env.local     # 값 채우기 — 주석 참고
pnpm dev                       # http://localhost:3000
```

로그인은 카카오·구글 소셜 로그인이고, 관리자(role=ADMIN) 계정만 들어갈 수 있다. 관리자 지정은 백엔드 DB에서 한다.

## 검사

```bash
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm test         # Vitest
pnpm build        # 프로덕션 빌드
pnpm format       # Prettier 전체 포맷
pnpm api:types    # 스웨거 → src/shared/api/schema.d.ts 재생성
```

커밋 전에 husky가 lint-staged(Prettier)를 돌리고, PR마다 CI가 위 검사를 전부 돈다.

## 구조

```
src/
├── app/            라우트·화면. (public)/login · (protected)/* · api/{auth,proxy}
├── features/       두 라우트 이상이 공유하는 도메인 코드
├── shared/         api · auth · ui · monitoring · lib
└── proxy.ts        라우트 가드
docs/               스펙·보안·인증·구조·테스트 문서 — 코드보다 문서가 기준
```

배치 규칙은 [docs/structure.md](docs/structure.md), 에이전트용 전체 규칙은 [AGENTS.md](AGENTS.md).

## 보안 요약

- 토큰은 브라우저 JS에 노출되지 않는다 — `httpOnly` 쿠키에만 있고, BE 호출은 `/api/proxy/*` route handler가 쿠키를 Bearer로 바꿔 전달한다
- 인가(관리자 여부)는 백엔드가 판정한다. 프론트 가드는 UX일 뿐이다
- 보안 헤더(CSP·HSTS·frame-ancestors) · noindex · `Cache-Control: no-store` · Sentry PII 마스킹
- 되돌릴 수 없는 작업은 확인창을 거친다

자세한 위협 모델과 규칙은 [docs/security.md](docs/security.md).

## 컨벤션

브랜치·커밋·PR 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md). 이슈는 노션 `LAN-XX`.
