# 콘텐츠 제작 (배치 접수 · 라인업 확인 · Day 검수 · 승인 · 제작 규칙)

Figma — 화면: https://www.figma.com/design/7DPdamjAqv6akNN0aWjseq/Landit?node-id=4128-715 · 스펙: https://www.figma.com/design/7DPdamjAqv6akNN0aWjseq/Landit?node-id=4133-1119
라우트: /content-batches · /content-batches/[batchId] · /content-batches/[batchId]/drafts/[draftId] · /content-rules
API: `/api/v1/admin/content-batches*` · `/api/v1/admin/content-rules*` (아래 데이터)
BE: landit-be LAN-690·693·694·695·702 · `docs/tasks/LAN-690/design.md` 5절 · 실측 `quality-run-2026-10-18.md`
이슈: LAN-753(이 문서) · LAN-809(API·모델) · LAN-810(배치 목록·접수) · LAN-811(라인업) · LAN-812(Day 목록·승인) · LAN-813(Day 상세) · LAN-814(제작 규칙)

> 담당자가 Day 수와 캐릭터 비율만 넣으면 서버가 AI(생성 Claude Opus 5.5 · 검수 GPT-5.6)로 라인업 → Day마다 질문 9·표현 12·별점 5를 만들고, 규칙 검증기·기존 표현 중복 검사·독립 AI 검수를 거친다. 담당자는 **라인업 확인(1) → Day 검수·재생성(2) → 승인(3)** 세 번만 손을 댄다. 승인하면 표현 id가 예약되고 2차(이미지·음성)·3차(운영 DB 반영)로 넘어간다. 생성은 비동기라 목록·상세는 10초 폴링으로 상태를 갱신한다.

## 이력

- 2026-10-25 `[LAN-695]` #103~#108 — Figma 확정 전에 한 페이지(`/content-batches?batch=&draft=`)로 만든 1차. 접수·라인업 읽기·코멘트 재생성·진행·OK/FIX·재생성·승인이 동작한다.
- 2026-10-23 Figma 확정안이 나왔고, 2026-10-31 운영자 결정으로 **Figma 안으로 재구성한다**(LAN-753~814). 1차에서 살리는 것 — 되돌릴 수 없는 액션마다 확인창 + 비용 문구, 검수 결과의 "기록 없음 / 빈 배열(지적 없음) / 깨진 JSON" 구분, Day 상세 머리의 브리핑·대화 목표, 재생성 뒤 상태가 바뀌면 상세를 다시 읽는 처리, 기존 테스트.
- 주소는 1차의 `/content-batches`를 유지한다(릴리즈 v1.7.0에 이미 실림). Figma의 `/content/…`는 쓰지 않는다.

## 화면 변형

| 프레임                                      | node       | 설명                                                                                                                                              |
| ------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 데스크톱/콘텐츠 제작                        | `4128:716` | 배치 목록. 다음 Day 요약 줄 + 상태 Select + `새 배치 접수`. 배치 표 + 페이지.                                                                     |
| 데스크톱/콘텐츠 제작 / 새 배치 접수         | `4129:727` | Dialog(560). Day 수 · 캐릭터별 Day 수(합계 검증) · 메모 · autoProceed 체크 · 비용 안내 · [취소 · 접수].                                           |
| 데스크톱/콘텐츠 제작 / #8 라인업 확인       | `4129:939` | 배치 상세(LINEUP_READY). 요약 카드 + [라인업 재생성 · 진행] · 라인업 표 10행(행 클릭 편집) · 아래 2단(라인업 수정 안내 \| 재생성 코멘트).         |
| 데스크톱/콘텐츠 제작 / #6 Day 목록          | `4130:753` | 배치 상세(GENERATING 이후). 요약 카드 + [재시작 · 승인] · 안내 배너 · 검수 필터 칩 · Day 표 10행.                                                 |
| 데스크톱/콘텐츠 제작 / #6 Day 301 초안 상세 | `4131:766` | Day 상세. 왼쪽 제목 카드 · 탭(질문 9 · 표현 12 · 별점 5 · 라인업 행) · 질문 레벨 3열 · 표현 목록. 오른쪽 검증기 · AI 검수 · 담당자 검수 · 재생성. |
| 데스크톱/콘텐츠 제작 / 제작 규칙            | `4133:855` | scope 칩 + 상태 Select · 규칙 표 · 아래 등록 카드(scope Select + 규칙 문장 + 등록).                                                               |

모바일 프레임은 없다 — 1차는 **데스크톱 전용**. 1024px 미만에서는 표 대신 "이 화면은 데스크톱에서 써 주세요" 안내만 그린다(아래 "상태").

### Figma와 다르게 가는 것 (운영자 결정)

- 데스크톱 표의 줄무늬 행과 행 끝 `›`는 그리지 않는다 — [admin-spec "목록 행 다듬기"](../admin-spec.md)(2026-08-24·25 결정)가 우선. 행 구분은 hover만.
- 상단바 제목의 구분자는 Figma `›`가 아니라 기존 규칙 `/`(`콘텐츠 제작 / 배치 #8`, `콘텐츠 제작 / 배치 #8 / Day 초안`). Day 상세 제목은 `Day 초안`까지 — 경로의 `draftId`는 Day 번호가 아니라 제목을 경로만으로 못 만든다.
- 사이드바 메뉴 이름은 `콘텐츠 제작`. 그룹은 Figma의 새 그룹 "콘텐츠"가 아니라 2026-10-25에 생긴 **시나리오** 그룹에 둔다(시나리오 목록·테스트와 한 묶음). 아이콘은 시나리오 테스트 아이콘 재사용을 그만두고 전용 아이콘(셸 스타일 채움형)을 하나 그린다.
- API에 없는 값은 그리지 않는다 — 요청자 이름(`requestedBy`는 id라 `#id`), "라인업 65초"·"생성 Opus 5.5 / 검수 GPT-5.6"·"소요 36분" 같은 시간·모델 표기, Day 표의 `모델` 열.

## 화면 구성

### 배치 목록 (/content-batches — `4128:716`)

- 상단 줄 — 왼쪽 `다음 Day {nextDay}` **Bold** + 보조 `· 발행 시나리오 {publishedScenarioCount}개 · 예약 중 {reservedDayCount}개 · 캐릭터 누적 chloe {n} / marco {n} / teddy {n}`(`next-day`), 오른쪽 Select `상태: 전체`. 주황 `새 배치 접수`는 콘텐츠 첫 줄 오른쪽 끝(상단바엔 액션을 두지 않는다 — 셸 규칙)
- 표(흰 카드 r20) — 열: 배치(60, `#8`) · Day(110, `321~330`) · 상태(130, 칩) · 캐릭터 비율(flex, `chloe 4 · marco 3 · teddy 3`) · 요청자(90, `#12`) · 접수(110) · 마지막 갱신(110) · 사유 / 비고(180)
  - 사유 / 비고: FAILED → `errorMessage`(빨강) · LINEUP_READY → `라인업 확인 대기` · REVIEW_READY → `검수 대기` · APPROVED 이후 → `에셋 생성 대기` · 그 외 `—`. Figma의 `Day 316 생성 중 (6/10 끝)`·`NEEDS_FIX 7 · OK 3`·`표현 id 8761~8880 예약`은 목록 응답에 Day 요약이 없어 **1차는 그리지 않는다**(상세에서만)
  - 행 클릭 → `/content-batches/{batchId}`
- 상태 Select — **클라이언트 필터**(BE 목록은 `page`·`size`만 받는다, 2026-10-31 확인). 선택지: 전체 · 접수 · 라인업 생성 중 · 라인업 확인 · 생성 중 · 검수 대기 · 승인 · 에셋 생성 중 · 에셋 검수 대기 · 에셋 준비 · 발행 · 실패. 쿼리스트링 `?status=`. 현재 페이지 안에서만 거른다(페이지 수는 서버 기준)
- 페이지 줄 — `shared/ui/Pagination`(size 20, `totalCount`). 한 장이면 안 그린다

### 새 배치 접수 (Dialog — `4129:727`)

- 제목 `새 배치 접수` · 설명 `다음 Day {nextDay}부터 연속으로 예약해요. 접수하면 바로 라인업 생성을 시작하고, 라인업을 확인한 뒤 Day 생성을 진행해요.`
- `Day 수 (1~30)` 숫자 입력(기본 10) + helper `Day {nextDay} ~ {nextDay+dayCount-1} 예약`
- `캐릭터별 Day 수 — 합이 Day 수와 같아야 해요` — chloe · marco · teddy 숫자 입력 3개 + 읽기 전용 `합계` 타일(`10 / 10 ✓` 초록, 다르면 `9 / 10` 빨강). 기본값은 Day 수를 3으로 나눠 누적(`characterCounts`)이 적은 캐릭터부터 나머지를 1씩 더 준다
- helper `누적 분포 chloe {n} · marco {n} · teddy {n} — {가장 많은 캐릭터}가 많으니 {나머지} 비중을 올리는 쪽을 권해요`
- `메모 (선택, 2,000자) — 프롬프트에 그대로 들어가요` 여러 줄 입력 + 카운터
- 체크박스 `라인업 확인 없이 바로 Day 생성 (autoProceed)` 기본 off
- 안내 타일(오렌지 연) `비용 안내: Day 1개 ≈ 7분 · 약 1.1달러(Opus 5.5 생성 + GPT 검수). {dayCount}개면 약 {dayCount×1.1}달러.`
- 버튼 `취소` · 주황 `접수`(합·범위가 맞을 때만 활성). 접수 중엔 닫히지 않는다. 성공 → 토스트 `배치 #{id}를 접수했어요` + `/content-batches/{id}`로 이동

### 배치 상세 — 라인업 확인 (/content-batches/[batchId], 배치 `REQUESTED`·`LINEUP_GENERATING`·`LINEUP_READY` — `4129:939`)

- 요약 카드 — `Day {start} ~ {end} · {dayCount}개` + 상태 칩 · 보조 `chloe {n} · marco {n} · teddy {n} · 접수 #{requestedBy} {MM.DD HH:mm} · 메모: {note}`. 오른쪽 `라인업 재생성`(outline) · 주황 `진행 — Day 생성 시작`. 둘 다 LINEUP_READY에서만 활성
- `REQUESTED`·`LINEUP_GENERATING` — 표 자리에 `라인업을 만들고 있어요 · 약 1분` 상태 카드. 10초 폴링
- 라인업 표(흰 카드) — 열: Day(60) · 제목 `(클릭해 수정)`(flex) · 카테고리(90) · 난이도(80) · 캐릭터(80) · 선발화(60, USER는 오렌지) · 겹침 경고 `(AI 자기 신고)`(260, 오렌지 `Day {n} — {reason}`, 없으면 `—`)
  - 행 클릭 → 그 행이 **인라인 편집 폼**으로 바뀐다: 제목(≤100) · 카테고리(기존 번호 Select 또는 `새 카테고리 이름` 입력 — 둘 중 하나) · 난이도(EASY·NORMAL·HARD) · 캐릭터(chloe·marco·teddy) · 선발화(AI·USER) · 줄거리(beats 2~5줄, 각 ≤200). 다른 행을 누르면 편집 중인 행은 닫히고 값은 유지된다
  - 겹침 경고 클릭 → 기존 Day(`/scenarios?q=Day {n}`, develop에서만)를 새 탭으로. 운영에선 링크 없이 글자만
- 아래 2단 — 왼쪽 안내 카드 `라인업 수정`(`행을 클릭해 제목·카테고리·난이도·캐릭터·선발화·줄거리를 고쳐요. 저장은 예약 Day 전부를 한 번에 보내요. 캐릭터별 수가 접수 비중과 다르거나 카테고리가 없으면 저장되지 않아요. 새 카테고리는 이름으로 적어요.`) + `저장` 버튼(바뀐 행이 있을 때만 활성. 저장 안 한 변경이 있으면 `진행`·`라인업 재생성`은 비활성 + helper `먼저 저장해 주세요`). 오른쪽 `라인업 재생성 코멘트 (누적되어 다음 프롬프트에 들어가요)` 여러 줄 입력(≤2,000) + helper `재생성 중 실패하면 이 라인업이 그대로 남고 사유가 보여요` + `코멘트로 재생성`(코멘트가 있을 때만)
- `errorMessage`가 있으면 요약 카드 아래 빨간 배너

### 배치 상세 — Day 목록 (`GENERATING` 이후 — `4130:753`)

- 요약 카드 — `Day {start} ~ {end} · {dayCount}개` + 상태 칩 · 보조 `OK {n} · NEEDS_FIX {n} · 생성 중 {n} · 실패 {n} · 접수 #{requestedBy} {MM.DD HH:mm}`. 오른쪽 `재시작`(outline) · `승인 — 표현 id 예약`(주황)
  - 승인은 **배치 REVIEW_READY이고 모든 Day OK**일 때만 활성. 재시작은 **FAILED이거나, GENERATING인데 `updatedAt`이 16분 이상 전**일 때만 활성(요청 제한 5분 × 3 + 60초)
- 안내 배너(오렌지 연) — `승인은 Day {dayCount}개가 모두 OK일 때 켜져요. 승인하면 Day마다 표현 id 12개를 예약하고 2차 에셋 생성 단계로 넘어가요. 재시작은 배치가 FAILED이거나 heartbeat가 멈춘 GENERATING(마지막 갱신 16분 이상 전)일 때만 켜져요.`
- FAILED면 빨간 배너에 `errorMessage`. APPROVED 이후면 초록 배너 `승인됨 · 표현 id {min}~{max} 예약 · 에셋 생성 대기`(2차 화면 없음. 범위는 초안들의 `reservedExpressionIds`)
- 검수 필터 칩 — `다시 볼 것 {n}` · `전체 {n}` · `미검토 {n}` · `수정 {n}` · `OK {n}` + 보조 `다시 볼 것 = 재생성 뒤 아직 안 본 Day · 행 클릭 → Day 초안 상세`. 기본 선택은 `다시 볼 것`이 1개 이상이면 그것, 아니면 `전체`. 쿼리스트링 `?filter=`
  - 미검토 = REVIEW_READY, 수정 = NEEDS_FIX, OK = OK·APPROVED·PUBLISHED. 생성 중·실패는 `전체`에만
  - 다시 볼 것 = **로컬 기록**. 이 브라우저에서 재생성을 눌렀고, 그 뒤 Day 상태가 GENERATING을 벗어났는데, 그 이후로 상세를 연 적이 없는 Day. 상세를 열면 지워진다(`localStorage`, 키 `content-review:{draftId}`)
- Day 표 — 열: Day(60) · 제목(flex) · 상태(110, 칩) · 검증기(150, `FAIL {n} · WARN {n}` FAIL>0이면 빨강, UNCHECKED가 있으면 `· 검사 불가 {n}`) · AI 검수(90, `{n}건`) · 코멘트(110, 열린 FIX `FIX {n}` 오렌지 / 전부 해결 `해결 {n}` / 없음 `—`). Figma의 `갱신` 열은 배치 상세에도 초안 상세에도 Day별 시각이 없어 1차는 그리지 않는다(BE 요청)
  - 검증기·AI 검수·코멘트 수는 배치 상세 `days[]`에 없다 → **Day 상세를 병렬로 읽어 채운다**(`useQueries`, Day ≤30). 아직 안 온 칸은 `…`. 배치가 LINEUP 단계면 읽지 않는다. (BE에 요약 필드 요청 — 아래)
  - 생성 중인 Day는 상태 칩만, 나머지 칸은 `—`. 실패한 Day는 `errorMessage`를 제목 아래 빨강 한 줄
  - 행 클릭 → `/content-batches/{batchId}/drafts/{draftId}`
- 10초 폴링 — 배치가 GENERATING이거나 GENERATING인 Day가 있을 때

### Day 초안 상세 (/content-batches/[batchId]/drafts/[draftId] — `4131:766`)

2단 — 왼쪽(flex) 콘텐츠, 오른쪽(400) 검수 패널. 상단바 제목 `콘텐츠 제작 / 배치 #{batchId} / Day 초안`(경로엔 Day 번호가 없다 — Day 번호는 제목 카드에).

- 제목 카드 — `{languageVariant.title}` + 상태 칩 · 보조 `{characterId} · {difficulty} · 카테고리 {번호 또는 proposedCategory} · {firstSpeaker} 선발화` · 아래 두 줄 `브리핑`·`대화 목표`(1차에서 살림)
- 탭 — `질문 9` · `표현 12` · `별점 5` · `라인업 행`. 숫자는 실제 개수(생성 전이면 0)
- **질문 탭** — 카드 제목 `질문 9개 · 레벨 3열` + 보조 `질문 줄을 클릭하면 코멘트 칸에 [L1 Q2]처럼 참조가 들어간다`. LEVEL_1 / LEVEL_2_TO_3 / LEVEL_4_TO_5 세 열 나란히. 열마다 위에 `속마음({innerThoughtType}): {innerThought}` 회색 타일(Q1에만, 없으면 생략), 질문 줄 = `L1 Q1` 라벨(12px 회색) · 영어(Bold) · 해석 · `requiredResponseElement`(회색 작은 글씨)
  - 줄 클릭 → 선택 표시(오렌지 테두리) + 오른쪽 담당자 검수의 `대상 경로`에 `questions[LEVEL_1][2]`, 코멘트 끝에 `[L1 Q2] ` 삽입. **같은 줄을 다시 누르면 해제**(경로 비우고 참조 문자열 제거). 다른 줄을 누르면 경로는 바뀌고 참조는 추가된다. 레벨 라벨은 L1 · L2 · L4. 검수가 잠겨 있거나(아래 "OK·FIX" 조건 밖) 저장 중이면 줄 클릭도 막는다
  - **경로 규칙은 BE 검증기(`ContentDraftValidationService`)와 같다** — 질문은 `questions[{level}][{displayOrder}]`(1부터), 표현은 `expressions[{level}][{레벨 안 0부터}]`(검증기는 전체 순번 `expressions[{0부터}]`로도 적는다), 별점은 `starMessages[{starRating}]`(`1.0`~`3.0`). 코멘트 targetPath도 같은 규칙이라 프롬프트 안에서 검증기 path와 어긋나지 않는다
  - 검증기·AI 검수의 `path` 클릭 → 해당 줄로 스크롤 + 2초 하이라이트
- **표현 탭** — 카드 제목 `표현 12개 (레벨별 4개) · 표면 중복 {n} · 뜻 중복 {n}`(`validationResult.surfaceDuplicates`에서 겹침이 있는 수 · `semanticDuplicates` 수). 줄 = `{levelGroup} · Q{answerToQuestionDisplayOrder} · {expressionType}` 라벨 · `{targetExpressionText} = {baseExpressionMeaningText}` · 오른쪽 중복 배지(`E-DEDUP-KEY · 기존 #{id}` / `기존 '{text}'` / 뜻 중복 `#{duplicateOfId}`, 빨강 연). 줄 오른쪽 `▸`를 누르면 펼쳐서 `usageSummary`·대표 문장·연습 예문(펼침은 줄 클릭과 분리 — 예문만 보려다 참조가 들어가지 않게). 줄 클릭은 질문과 같은 참조 규칙 — 경로 `expressions[{levelGroup}][{레벨 안 순번 0~3}]`, 참조 `[E {전체 순번 1~12}]`. 같은 배치 안에서 겹치면 배지 `이 배치 #{n}`
- **별점 탭** — `★ {starRating}` · 문구. 참조 `[S {starRating}]`, 경로 `starMessages[{starRating}]`(검증기와 같다 — 순번이 아니라 별점 값)
- **라인업 행 탭** — 라인업 행 그대로(제목·카테고리·난이도·캐릭터·선발화·beats·겹침 경고). 읽기 전용(수정은 LINEUP_READY에서만 가능했다)
- 오른쪽 **검증기** 카드 — 제목 `검증기 · FAIL {n} · WARN {n} · 통과 {n}`(UNCHECKED가 있으면 `· 검사 불가 {n}`). FAIL(빨강 칩) → WARN(오렌지) → UNCHECKED(회색) 순으로 `{ruleId} · {path} · {message}`. PASS는 접어 둔다(`통과 {n}개 보기`). 아래 `사람만 볼 수 있는 항목 {n}개: {humanOnlyChecks 나열}`(항상 표시). `validationResult`가 null이면 `아직 검증 전이에요`
- **AI 검수** 카드 — 제목 `AI 검수 · 결함 {n}건`. 결함 = `{type}` 칩 + `{path}`(회색, 클릭 이동) + `{reason}` + `{ruleCode}`(있으면). 처음 4건만 보이고 `… {n}건 더 보기`. 각 결함 오른쪽 `규칙으로 승격` → 규칙 등록 Dialog(scope 기본값은 path로 추정: `questions`→QUESTION, `expressions`→EXPRESSION, `starMessages`→STAR_MESSAGE, 그 외 COMMON; 규칙 문장은 `reason`으로 미리 채움, `sourceCommentId` 없음 — AI 결함은 코멘트가 아니다). `reviewResult`가 null → `아직 검수 전이에요`, 빈 배열 → `결함 없음`, 깨진 JSON → `검수 결과를 읽지 못했어요`(통과로 보이지 않게)
- **담당자 검수** 카드 — `대상 경로 (선택)` 입력(줄 클릭으로 채워지고 직접 고칠 수 있다) · 코멘트 여러 줄 입력(≤2,000, 새로고침 대비 `sessionStorage` 임시 저장, 저장 성공 시 비움) · 버튼 `FIX 저장`(outline, 코멘트 있을 때만) · `OK`(초록) · helper `FIX는 코멘트 1개 이상 필수. 질문·표현 줄을 클릭하면 [L1 Q2]·[E 1] 참조가 들어가고 targetPath로 저장된다. OK면 열린 FIX 코멘트를 해결 처리한다.`
  - 아래 **코멘트 목록**(작성 순) — `{verdict}` 칩 · `{targetPath}` · 본문 · `{MM.DD HH:mm}` · 해결이면 `해결됨` 회색. FIX 코멘트 줄의 `규칙으로 승격` → 규칙 등록 Dialog(`sourceCommentId` 채움, 규칙 문장은 코멘트 본문)
  - OK·FIX는 배치가 `GENERATING`·`REVIEW_READY`이고 Day가 REVIEW_READY·NEEDS_FIX·OK일 때 활성 — 다른 Day를 아직 만드는 중이어도 끝난 Day는 검수할 수 있다(BE `ContentDraftReviewService` 가드와 같다). 그 외엔 비활성 + 이유 helper(`생성이 끝나면 검수할 수 있어요` / `실패한 Day는 다시 만든 뒤 검수해요` / `배치를 재시작한 뒤 검수할 수 있어요`(배치 FAILED) / `승인된 배치는 검수를 바꿀 수 없어요`). 코멘트 2,000자·경로 255자(BE `@Size`)를 넘으면 저장 버튼도 잠근다
  - OK·FIX 저장은 확인창 없이 바로(OK는 다시 FIX로 되돌릴 수 있다). 코멘트가 있는 OK는 코멘트도 함께 보낸다(`verdict: OK` + comments)
- **재생성** 카드 — Select `범위: {라벨}`(ALL `전체` / `질문+표현 · 레벨 1` / `질문+표현 · 레벨 2~3` / `질문+표현 · 레벨 4~5` / `표현만 · 레벨 1` / … / `별점`) + helper `범위 밖 payload는 유지되고, 미해결 FIX 코멘트가 프롬프트에 들어가며 다시 만든 범위의 코멘트만 해결된다.` + 보조 `약 2분 · 0.3달러`(ALL은 `약 7분 · 1.1달러`) + 주황 `재생성`. AlertDialog로 확인(범위·비용·"기존 내용이 교체돼요"). 배치 REVIEW_READY이고 Day가 GENERATING이 아닐 때만
  - 재생성 성공 → Day GENERATING → 10초 폴링, 콘텐츠 영역은 이전 내용을 흐리게 두고 `다시 만들고 있어요 · {범위}` 배너. 끝나면(상태가 바뀌면) 상세를 다시 읽는다. "다시 볼 것" 기록은 재생성을 누른 시각에 남기고, 상세를 보는 중에 끝나면 그 자리에서 열람으로 처리한다(화면을 떠나 있었을 때만 Day 목록에 "다시 볼 것"이 뜬다)
- 상세를 열면 로컬 열람 기록(`다시 볼 것` 해제)

### 제작 규칙 (/content-rules — `4133:855`)

- 상단 줄 — scope 칩 `전체 {n}` · `COMMON {n}` · `LINEUP` · `QUESTION` · `EXPRESSION` · `STAR_MESSAGE` · `REVIEW` · `IMAGE`(2차에서 추가, 재생성 타입 기준) + Select `상태: ACTIVE`(ACTIVE · RETIRED · 전체). 쿼리스트링 `?scope=&status=`. 칩의 수는 현재 상태 필터 안의 수. 목록은 한 번에 받아(`GET content-rules`, 필터 없이) 클라이언트에서 거른다 — 칩 수를 함께 보여 주기 위해
- 표 — 열: 코드(80, `Q-30`) · 규칙 `(다음 AI 호출부터 프롬프트에 들어간다)`(flex, RETIRED는 회색) · 출처(130, `sourceCommentId`가 있으면 `코멘트 #{id}` / 없으면 `시드·직접`) · 상태(90, ACTIVE 초록 점 / RETIRED 점 없음) · 등록(70, `MM.DD`) · 액션(60, ACTIVE면 `은퇴` 빨간 글자 / RETIRED면 `—`)
  - `은퇴` → AlertDialog `{code}를 은퇴할까요?` · `프롬프트에서 빠지고 목록엔 이력으로 남아요. 되돌릴 수 없어요.` → PATCH. 409면 서버 메시지 토스트
- 아래 등록 카드 — 제목 `새 규칙 등록 — 코드는 scope 접두어 + 다음 번호(예: Q-32)로 자동 매겨진다` · 한 줄에 Select `scope: QUESTION` + 입력 `규칙 문장 (한국어, 한 문단)`(≤2,000) + 주황 `등록` · helper `같은 번호가 동시에 등록되면 409. 은퇴한 규칙은 프롬프트에서 빠지고 목록에 남는다.` 성공 → 토스트 `{code}로 등록했어요` + 목록 갱신 + 입력 비움
- Day 상세의 `규칙으로 승격` Dialog는 이 등록 폼과 같은 컴포넌트(scope · 규칙 문장 · 출처 코멘트 id 읽기 전용 표시)

## 정확한 카피

| 자리               | 문구                                                                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 빈 목록            | 접수된 배치가 없어요 (+ 새 배치 접수)                                                                                                                                |
| 필터 빈 목록       | 조건에 맞는 배치가 없어요                                                                                                                                            |
| 접수 토스트        | 배치 #{id}를 접수했어요                                                                                                                                              |
| 라인업 저장 토스트 | 라인업을 저장했어요                                                                                                                                                  |
| 라인업 재생성      | 코멘트로 라인업을 다시 만들어요 · 약 1분                                                                                                                             |
| 진행 확인창        | 라인업을 확정하고 Day {dayCount}개를 만들까요? / Day마다 질문 9개·표현 12개·별점 5개를 만들어요. 약 {dayCount×7}분 · {dayCount×1.1}달러. 라인업은 더 고칠 수 없어요. |
| 진행 토스트        | Day 생성을 시작했어요 · 약 {dayCount×7}분                                                                                                                            |
| 재시작 확인창      | 배치 #{id}를 재시작할까요? / 멈춘 Day부터 생성을 이어가요. 끝난 Day는 그대로 둬요.                                                                                   |
| 승인 확인창        | Day {dayCount}개를 승인할까요? / 표현 id 12개씩 {dayCount×12}개를 예약하고 에셋 생성 단계로 넘어가요. 되돌릴 수 없어요.                                              |
| 승인 토스트        | 승인했어요 · 표현 id를 예약했어요 (예약 범위 {min}~{max}는 Day 목록의 승인 배너에 — 승인 응답엔 id가 없다)                                                           |
| 검수 토스트        | OK로 저장했어요 / FIX로 저장했어요                                                                                                                                   |
| 재생성 확인창      | Day {n} · {범위} — 다시 만들까요? / 기존 내용이 교체되고 미해결 FIX 코멘트가 프롬프트에 들어가요. 약 {n}분 · {n}달러.                                                |
| 재생성 토스트      | 다시 만들고 있어요 · {범위}                                                                                                                                          |
| 규칙 등록 토스트   | {code}로 등록했어요                                                                                                                                                  |
| 규칙 은퇴 토스트   | {code}를 은퇴했어요                                                                                                                                                  |
| 없는 배치 · 초안   | 배치를 찾을 수 없어요 / 이 배치에 없는 Day예요 (404)                                                                                                                 |
| 상태 가드 409      | 서버 `error.message` 그대로                                                                                                                                          |
| 모바일             | 이 화면은 데스크톱(1024px 이상)에서 써 주세요                                                                                                                        |

## 데이터

BE 계약은 `landit-be/docs/tasks/LAN-690/design.md` 5절. 모든 요청은 프록시 → `/api/v1/admin/…`. 타입은 `schema.d.ts`(`pnpm api:types`로 재생성 — LAN-702 `resume`, LAN-754 2차 API·`assetPayload`·`assetProgress`·`IMAGE` scope가 함께 들어온다. 2차 API는 이번 화면에서 쓰지 않는다).

| 항목          | 내용                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 다음 Day      | GET content-batches/next-day → nextDay, publishedScenarioCount, reservedDayCount, characterCounts{chloe,marco,teddy}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 접수          | POST content-batches {dayCount 1~30, characterRatio{chloe,marco,teddy}(합=dayCount), note ≤2000, autoProceed} → {batch, days[]}. 비중 불일치 400 · Day 충돌 409                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 목록          | GET content-batches?page&size → items[AdminContentBatchSummary], page, size, hasNext, totalCount. **status 파라미터 없음**(클라이언트 필터). 최근 접수 순                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 상세          | GET content-batches/{id} → batch{batchId, status, startDay, endDay, dayCount, characterRatio, note, autoProceed, requestedBy, errorMessage, createdAt, updatedAt}, days[{draftId, plannedDay, status, title, errorMessage, lineupRow}]. 없으면 404                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 라인업        | PUT …/{id}/lineup {rows[{day, title ≤100, categoryDisplayOrder 1~~1000 \| proposedCategory ≤100, difficulty, firstSpeaker, characterId, beats[2~~5, 각 ≤200]}]} — 예약 Day 전부 한 번씩(400), LINEUP_READY만(409). 겹침 경고는 보내지 않는다(AI 제안 유지)                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 라인업 재생성 | POST …/{id}/lineup/regenerate {comment ≤2000} → REQUESTED. LINEUP_READY만(409)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 진행          | POST …/{id}/proceed → GENERATING. LINEUP_READY만(409)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 재시작        | POST …/{id}/resume → FAILED 또는 멈춘 GENERATING만(409)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 승인          | POST …/{id}/approve → APPROVED. REVIEW_READY + 모든 Day OK + 질문 9·표현 12·별점 5 구조(409). Day마다 표현 id 12개 예약(`reservedExpressionIds`는 초안 상세에)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 초안          | GET …/{id}/drafts/{draftId} → draftId, batchId, plannedDay, status, lineupRow, scenarioPayload{scenario, languageVariant, questions[9]}, expressionPayload[12], starMessagePayload[5], validationResult{findings[{ruleId, level PASS\|WARN\|FAIL\|UNCHECKED, path, message}], surfaceDuplicates[{index, targetExpressionText, existingMatches[], batchMatchIndexes[]}], semanticDuplicates[{index, targetExpressionText, duplicateOfId, duplicateOfText, reason}], humanOnlyChecks[]}, reviewResult[{type, path, excerpt, reason, ruleCode}], reservedExpressionIds, errorMessage, comments[{commentId, targetPath, verdict, comment, resolvedAt, authorId, createdAt}]. 다른 배치의 draftId → 404 |
| 검수          | PUT …/drafts/{draftId}/review {verdict OK\|FIX, comments[{targetPath?, comment ≤2000}]}. FIX는 코멘트 1개 이상(400). 배치 GENERATING·REVIEW_READY · Day REVIEW_READY·NEEDS_FIX·OK만(409)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 재생성        | POST …/drafts/{draftId}/regenerate {scope "ALL" \| "QUESTIONS_AND_EXPRESSIONS:{level}" \| "EXPRESSIONS:{level}" \| "STAR_MESSAGES"} → Day GENERATING. 배치 REVIEW_READY · Day가 GENERATING 아님(409), 표기 오류 400                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 규칙          | GET content-rules?scope&status(둘 다 선택) → [{ruleId, ruleCode, scope, ruleText, sourceCommentId, status, createdAt}] 코드 순 · POST content-rules {scope, ruleText ≤2000, sourceCommentId?} → 코드 자동(C·L·Q·E·S·R·I + 다음 번호), 동시 등록 409, 없는 코멘트 404 · PATCH content-rules/{ruleId} {status: "RETIRED"}만(400), 이미 은퇴 409                                                                                                                                                                                                                                                                                                                                                      |

상태 값.

- 배치: REQUESTED → LINEUP_GENERATING → LINEUP_READY(확인 1) → GENERATING → REVIEW_READY(확인 2) → APPROVED → (2차) ASSETS_GENERATING → ASSETS_REVIEW_READY → ASSETS_READY → (3차) PUBLISHED. FAILED는 Day 단계 실패·제출 거부일 때만. **첫 라인업이 끝까지 실패하면 배치와 Day 예약이 삭제돼 목록에서 사라진다**(사유는 서버 로그) — 폴링 중 404가 되면 목록으로 보내고 토스트
- Day: LINEUP → GENERATING → REVIEW_READY | NEEDS_FIX(검증 FAIL 또는 검수 결함) → OK / NEEDS_FIX(담당자) → APPROVED → PUBLISHED / FAILED. 재생성하면 GENERATING으로 돌아가고 범위 밖 payload는 유지
- 시각은 전부 LocalDateTime(오프셋 없음) — 다른 화면처럼 `new Date()`로 읽어 `MM.DD HH:mm`
- payload 세 개(`scenarioPayload`·`expressionPayload`·`starMessagePayload`)와 `validationResult`·`reviewResult`는 스웨거가 `unknown`/`string`으로 찍는다. feature `api/`에서 BE `dto/draft/*.java`·`dto/validation/*.java` 모양대로 좁힌 타입을 두고, 읽을 때 형태를 검사한다(깨진 값은 "읽지 못했어요", 통과로 보이지 않게 — 1차 결정 유지). 콘텐츠 탭도 같다 — 깨진 payload는 `{질문|표현|별점 문구} 데이터를 읽지 못했어요`와 탭 숫자 `!`, 없는 payload는 `아직 …이 없어요`

## 인터랙션 요약

| 요소              | 동작 · API                                                                                                        | 결과                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 새 배치 접수      | Dialog → POST                                                                                                     | 토스트 + 상세로 이동(LINEUP_GENERATING, 폴링)               |
| 상태 Select       | 클라이언트 필터                                                                                                   | `?status=`, 즉시                                            |
| 폴링              | 목록: 생성 중(REQUESTED·LINEUP_GENERATING·GENERATING) 배치가 있으면 10초 · 상세: 배치 또는 Day가 생성 중이면 10초 | 상태 칩 갱신. 끝나면 멈춘다                                 |
| 라인업 행 편집    | 행 클릭 → 인라인 폼 → `저장`(PUT 10행 전부)                                                                       | 클라이언트 검증은 행 단위 빨강, 서버 400은 카드 상단 메시지 |
| 코멘트로 재생성   | POST lineup/regenerate                                                                                            | REQUESTED → 폴링 → 새 라인업. 실패하면 이전 라인업 + 사유   |
| 진행              | AlertDialog → POST proceed                                                                                        | Day 목록 화면으로 바뀜(같은 라우트, 상태로 분기)            |
| 재시작            | AlertDialog → POST resume                                                                                         | GENERATING → 폴링                                           |
| 승인              | AlertDialog → POST approve                                                                                        | APPROVED 배너 + 표현 id 범위                                |
| 검수 필터 칩      | 서버 status + 로컬 열람 기록                                                                                      | `?filter=`                                                  |
| 질문·표현·별점 줄 | 클릭 → 참조 삽입 + targetPath(검증기 경로 규칙). 다시 클릭 → 해제. 검수 잠김·저장 중엔 무시                       | PUT review의 `comments[0].targetPath`                       |
| 검증기·결함 path  | 클릭 → 해당 줄로 스크롤·하이라이트                                                                                | —                                                           |
| OK / FIX          | PUT review                                                                                                        | Day 상태 갱신 · 코멘트 목록 갱신 · 배치 상세 무효화         |
| 재생성            | Select → AlertDialog → POST regenerate                                                                            | GENERATING → 폴링 → 끝나면 다시 읽고 "다시 볼 것" 기록      |
| 규칙으로 승격     | Dialog → POST content-rules                                                                                       | 토스트 `{code}로 등록했어요`                                |
| 규칙 등록 · 은퇴  | POST / AlertDialog → PATCH                                                                                        | 목록 갱신                                                   |

## 상태

| 상태      | 표시                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 배치 칩   | 담당자 차례만 오렌지 점 — LINEUP_READY `라인업 확인` · REVIEW_READY `검수 대기` · ASSETS_REVIEW_READY `에셋 검수 대기`. 진행 중은 검정 점 — REQUESTED `접수` · LINEUP_GENERATING `라인업 생성 중` · GENERATING `생성 중` · ASSETS_GENERATING `에셋 생성 중`. 끝난 것은 초록 점 — APPROVED `승인` · ASSETS_READY `에셋 준비` · PUBLISHED `발행`. FAILED `실패`(점 없음, 글자 빨강) |
| Day 칩    | LINEUP `라인업` · GENERATING `생성 중`(검정 점) · REVIEW_READY `미검토`(오렌지 점) · NEEDS_FIX `수정`(오렌지 점) · OK `OK`(초록 점) · APPROVED `승인`(초록 점) · PUBLISHED `발행`(초록 점) · FAILED `실패`(빨강 글자)                                                                                                                                                             |
| 검증기 칩 | FAIL 빨강 · WARN 오렌지 · UNCHECKED 회색 `검사 불가` · PASS 접어 둠. UNCHECKED가 있는 Day는 OK 전에 담당자가 직접 본다는 helper                                                                                                                                                                                                                                                   |
| 로딩      | 목록 스켈레톤 6행 · 상세 스켈레톤 · Day 표의 아직 안 온 칸은 `…`. 200ms 규칙                                                                                                                                                                                                                                                                                                      |
| 빈 상태   | 위 카피. 규칙 목록은 `이 scope에 규칙이 없어요`                                                                                                                                                                                                                                                                                                                                   |
| 오류      | 조회 실패 인라인 오류 + 다시 시도. 변경 실패는 토스트(BE `error.message`까지만). 404는 인라인 문구, 409는 토스트 뒤 현재 상태 다시 읽기                                                                                                                                                                                                                                           |
| 확인      | 진행·재시작·승인·재생성·규칙 은퇴는 AlertDialog(대상·비용·되돌릴 수 없음). 접수는 Dialog 자체가 확인. OK·FIX·라인업 저장·규칙 등록은 묻지 않는다                                                                                                                                                                                                                                  |
| 모바일    | 1024px 미만은 안내 문구만(표·3열이 들어가지 않는다). 사이드바 메뉴는 그대로 보인다                                                                                                                                                                                                                                                                                                |

## 검증

- 접수: Day 수 1~30 정수, 캐릭터별 0 이상 정수이고 합이 Day 수와 같음, 메모 ≤2,000
- 라인업 행: 제목 1~~100, 카테고리는 번호(1~~1000) 또는 새 이름(≤100) 중 하나, beats 2~~5줄 각 1~~200, 캐릭터 수 합이 접수 비중과 같음(행 단위가 아니라 표 전체 경고)
- 검수: FIX는 코멘트 1자 이상, 코멘트 ≤2,000, targetPath ≤255
- 규칙: 문장 1~2,000, scope 필수

## 구현 배치 (후속 이슈 기준)

- `features/content/` — `api/`(요청 함수 · 좁힌 타입 · payload 형태 검사) · `model/`(상태 라벨·점 · 가능 액션 판정 · 폴링 판정 · 검증기 요약 · scope 문자열 · 참조↔targetPath · 로컬 열람 기록 · 쿼리·뮤테이션 훅). 네 라우트가 같이 쓴다 (LAN-809)
- `app/(protected)/content-batches/` — 목록 `_ui/`·`_model/`(필터 ↔ 쿼리스트링) + 접수 Dialog (LAN-810)
- `app/(protected)/content-batches/[batchId]/` — `_ui/lineup/`(LAN-811) · `_ui/days/`(LAN-812) · `_model/`(라인업 초안 편집·검증, 검수 필터). page는 배치 상태로 둘 중 하나를 고른다
- `app/(protected)/content-batches/[batchId]/drafts/[draftId]/` — `_ui/`(질문 3열 · 표현 · 별점 · 검증기 · AI 검수 · 담당자 검수 · 재생성) · `_model/`(코멘트 초안 · 참조 삽입/해제 · 하이라이트) (LAN-813)
- `app/(protected)/content-rules/` — 목록 · 등록 폼(승격 Dialog와 공유) (LAN-814)
- 1차 `content-batches/_api·_model·_ui`는 단계별로 지운다 — 목록·접수·배치 액션은 LAN-810~812에서, Day 상세가 쓰는 보기·검수 컴포넌트는 LAN-813에서. 기존 테스트는 옮겨서 살린다

## BE 확인 사항 / 열린 질문

- **목록 `status` 필터 없음** — 클라이언트 필터로 간다(배치 수가 수십 개). 필요해지면 BE 이슈로 (2026-10-31 운영자 결정).
- **Day 요약에 검증·검수 수가 없다** — `AdminContentDraftSummary`에 `failCount`·`warnCount`·`uncheckedCount`·`defectCount`·`openFixCount`·`updatedAt`이 오면 Day 표를 위해 초안 ≤30개를 병렬로 읽는 일을 없앨 수 있다. BE 요청.
- **라인업의 카테고리 이름** — 라인업 행은 `categoryDisplayOrder` 번호만 준다. 이름은 `GET admin/scenarios`의 `categories`로 번호→이름을 붙이는데 이 API는 develop 전용이라 운영에선 번호만 보인다. `next-day` 또는 배치 상세에 카테고리 목록(번호·이름)을 실어 주면 좋겠다. BE 요청.
- `requestedBy`·`authorId`는 사용자 프로필 id — 화면은 `#id`. 이름이 필요하면 BE가 닉네임을 실어 줘야 한다.
- 재시작 16분 기준(요청 제한 5분 × 3 + 60초)은 BE `ContentGenerationRecoveryService`의 heartbeat 기준과 같은 값이어야 한다 — BE가 바꾸면 `features/content/model`의 상수를 같이 바꾼다.
- 2차(에셋)·3차(발행) 화면은 LAN-754 API 기준으로 별도 이슈. 승인 뒤는 "에셋 생성 대기" 배너까지. 그 화면의 버튼 규칙 메모(2026-10-31 운영자): **에셋 재생성·교체 버튼은 ASSETS_REVIEW_READY뿐 아니라 ASSETS_READY에서도 활성, 발행 버튼은 ASSETS_READY에서만.**
- 운영 ALB idle timeout 130초라 300초 AI 호출이 끊길 수 있다(landit-iac #64) — 끊기면 Day가 FAILED로 보이고 재시작으로 복구.
- 비용 안내 문구(Day 1개 ≈ 7분 · 1.1달러, 재생성 약 2분 · 0.3달러)는 실측 평균(design.md 9-1절). 상한·운영 모드(자동 호출 / 초안 가져오기)는 미정.
