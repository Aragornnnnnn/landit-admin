// 이 파일은 `pnpm api:types`가 스웨거(https://api-develop.landit.im/v3/api-docs)에서 생성한다. 손으로 고치지 말고 재생성한다.
// 스웨거가 틀린 부분은 ./schema-patch.ts에서 덮어쓴다.
export interface paths {
    "/api/v1/me/push-devices/{installationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 앱 설치 푸시 상태 동기화
         * @description 로그인·계정 전환·Token 갱신 시 호출합니다. 활성 등록 시 현재 계정의 설치 ID 없는 다른 활성 Token을 비활성화합니다. 아직 전환하지 않은 다른 기기도 새 API로 등록해야 수신을 재개합니다. 설치 ID가 연결된 다른 기기와 다른 계정의 Token은 유지합니다. pushEnabled=false이면 해당 설치만 비활성화하고 구형 Token은 정리하지 않습니다.
         */
        put: operations["update"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/nickname": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 사용자 닉네임 변경
         * @description 마이페이지에서 사용자가 원할 때 자신의 닉네임을 변경합니다. 앞뒤 공백을 제거한 값을 저장하며, 1자 이상 20자 이하의 글자·숫자·단어 사이 공백만 허용합니다. 이모지, 밑줄이나 마침표 같은 기호, 제어 문자, 보이지 않는 문자는 거절합니다. 다른 사용자와 같은 닉네임도 허용하고, 현재와 같은 값을 보내도 200으로 응답합니다. 가입 때 저장된 기본 닉네임에는 이 규칙을 적용하지 않습니다.
         */
        put: operations["updateNickname"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/locale": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 사용자 표시 언어 조회
         * @description 로그인·앱 시작 시 저장된 언어와 selectionRequired를 확인합니다. true이면 locale은 호환용 임시 기본값이므로 첫 언어 선택 화면을 표시합니다. false이면 기기 언어가 바뀌어도 저장된 locale을 유지하며 자동 PUT을 호출하지 않습니다. 기존 사용자는 현재 저장 언어를 유지하고 선택 화면을 다시 표시하지 않습니다.
         */
        get: operations["getLocale"];
        /**
         * 사용자 표시 언어 선택
         * @description 최초 언어 선택 화면에서 사용자가 선택한 ko 또는 ja를 저장합니다. 저장 성공 시 selectionRequired=false와 확정한 locale을 반환합니다. 로그인·앱 시작·기기 언어 변경에 따른 자동 동기화에는 사용하지 않습니다. 콘텐츠·AI 응답·발음 코칭은 저장된 적용 언어를 따릅니다. 기존 세션과 이미 준비된 비동기 작업은 당시 저장된 언어를 유지합니다.
         */
        put: operations["updateLocale"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/learning-level": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 사용자 학습 수준 조회
         * @description 인증된 사용자가 선택한 1부터 5까지의 학습 수준을 조회합니다.
         */
        get: operations["getLearningLevel"];
        /**
         * 사용자 학습 수준 변경
         * @description 온보딩에서 선택한 1부터 5까지의 학습 수준을 저장합니다.
         */
        put: operations["updateLearningLevel"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/expo-push-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Expo Push Token 상태 변경
         * @description 현재 사용자의 Expo Push Token을 등록·갱신하거나 비활성화합니다.
         */
        put: operations["update_1"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/alarm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 사용자 일일 알람 설정 조회
         * @description 매일 기기 현지 시간에 반복할 알람 1개의 설정을 조회합니다. 실제 예약과 전면 표시는 클라이언트가 처리합니다.
         */
        get: operations["getAlarm"];
        /**
         * 사용자 일일 알람 설정 변경
         * @description 사용자당 알람 1개의 설정 전체를 저장하거나 변경합니다. time은 00:00~23:59의 HH:mm 형식이며,
         *     비활성화 시에도 유지할 시각을 함께 전달해야 합니다. 서버는 시간대를 변환하거나 알람을 예약하지 않습니다.
         *     클라이언트는 저장된 설정으로 기존 기기 예약을 취소·재예약해야 합니다.
         *     성공 응답은 서버 설정 저장을 의미하며 기기 예약이나 전면 표시 성공을 보장하지 않습니다.
         */
        put: operations["updateAlarm"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/accent-locale": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 사용자 현재 영어 억양 조회 */
        get: operations["getAccentLocale"];
        /**
         * 사용자 영어 억양 변경
         * @description 온보딩에서 선택한 미국, 영국, 호주 영어 억양을 저장합니다.
         */
        put: operations["updateAccentLocale"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/referral-processing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** 레퍼럴 지급 보류 또는 재개 */
        put: operations["processing"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/referral-policy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 현재 레퍼럴 정책 */
        get: operations["current"];
        /**
         * 레퍼럴 정책 버전 생성
         * @description inviterLimit은 UNLIMITED(value=null), INVITE_COUNT(등록 순서상 최초 N명), TOTAL_AMOUNT(가입·결제 초대인 보상의 평생 누적 원 금액) 중 선택합니다. 생략하면 기존 한도를 유지합니다. 피초대인 보상은 한도에 포함하지 않습니다. 새 한도는 기존 관계의 미지급 보상에도 적용하고 잔여 금액만 부분 지급합니다. 기존 지급액은 보존하며 환불·복구로 한도가 초기화되지 않습니다.
         */
        put: operations["update_2"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/trial-reminder-settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 무료 체험 알림 채널 설정 조회 */
        get: operations["settings"];
        /**
         * 무료 체험 알림 채널 설정 변경
         * @description DB에 채널별 ON/OFF를 저장하고 예약 등록 및 발송 직전에 확인합니다. 서버 재시작은 필요 없으며 이미 외부에 접수된 알림은 취소되지 않습니다.
         */
        put: operations["update_3"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/lineup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 라인업 행 수정
         * @description LINEUP_READY 배치의 라인업 행을 저장한다. rows는 배치가 예약한 Day를 모두 한 번씩 담아야 한다(400). 다른 상태면 409.
         */
        put: operations["updateLineup"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/drafts/{draftId}/review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Day 검수 저장
         * @description OK는 Day를 OK로 바꾸고 열린 FIX 코멘트를 해결 처리한다. FIX는 코멘트가 하나 이상 필요하며(400) Day를 NEEDS_FIX로 둔다. 생성이 끝나지 않은 Day면 409.
         */
        put: operations["review"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/drafts/{draftId}/assets/replace": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Day 이미지 에셋 교체 업로드 (2차)
         * @description 콘텐츠 이미지 presign API(POST /api/v1/admin/content-images/presign)로 올린 content/inbox/{uuid}.webp를 대상 자리의 최종 키로 복사하고 상태를 REPLACED로 둔다. 이미지 대상(THUMBNAIL·EXPRESSION_IMAGE)만 받으며(400) 배치가 ASSETS_REVIEW_READY가 아니면 409. Day의 담당자 확인은 지워진다.
         */
        put: operations["replaceAsset"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/drafts/{draftId}/assets/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Day 에셋 확인 (2차)
         * @description 모든 에셋이 완성(DONE·REPLACED)된 Day만 확인할 수 있다(아니면 409). 배치의 모든 Day가 확인되면 배치가 ASSETS_READY로 바뀐다. 배치가 ASSETS_REVIEW_READY가 아니면 409.
         */
        put: operations["confirmAssets"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sessions/{sessionId}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 사용자 발화 제출
         * @description 사용자 메시지를 저장하고 다음 AI 메시지 또는 종료 메시지를 생성한다. 정상 완료한 시나리오는 이후 복습할 수 있다. 신규 환급 참여자의 정상 완료에만 reward를 제공한다. clientMessageId를 유지한 재전송은 최초 영수증을 반환하며 completionId로 중복 안내를 방지한다. 첫 진단 시나리오에서 해당 답변 작성·녹음 전/중 가이드를 열었다면 guideViewed=true를 보낸다. 생략 또는 false이면 기존 평가를 유지하며, 재전송에는 같은 열람 여부를 유지한다. /api/v1/me/rewards/completions/{completionId}로 대기 결과를 재조회한다.
         */
        post: operations["submitMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sessions/{sessionId}/feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 대화 최종 피드백 생성 및 조회
         * @description 완료된 세션의 요약 피드백과 메시지별 피드백을 생성하거나 조회한다. 유료 도입 후 무료 사용자는 첫 시나리오의 첫 완료 세션만 메시지별 피드백을 받고, 그 외 세션은 messageFeedbacks가 비고 detailFeedbackLocked가 true다. 결제 후 다시 조회하면 전부 내려간다. userLevelAssessment에는 기존 비동기 사용자 수준 평가 상태·결과를 포함한다. growthFeedback은 직전 완료 시나리오와 비교할 근거가 없으면 null이다. hasPreviousSameScenarioCompletion은 현재 세션 시작 시각까지 동일 시나리오의 이전 완료 이력이 있는지이며, 비교 결과가 비어 있어도 true일 수 있다. 재조회해도 해당 세션 시작 시각을 기준으로 판단한다. expressionReuse.pending은 분석 대기 여부이며, 완료 후 items가 비어 있으면 FE에서 카드를 숨긴다.
         */
        post: operations["getOrCreateFeedback"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scenarios/{scenarioId}/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 시나리오 세션 시작
         * @description 현재 제공 중인 시나리오 또는 복습 권한이 있는 시나리오로 SCENARIO 타입 학습 세션을 시작한다.
         */
        post: operations["startScenarioSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reviews/{reviewId}/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 복습 시작·재개
         * @description 최초 시작에서 유료화 시각과 현재 구독을 검사합니다. 재요청으로 시작·만료 시각이 연장되지 않습니다. 완료된 복습은 완료 상태를 반환합니다.
         */
        post: operations["start"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reviews/{reviewId}/answers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 복습 답안 제출
         * @description currentQuestionId에 제출합니다. 허용 정답 배열과 토큰 값·순서·개수가 일치하면 정답입니다. 첫 오답은 큐 뒤로 이동하고 정답 또는 두 번째 오답이면 문제가 종료됩니다. 모든 문제가 종료되면 COMPLETED이며 currentQuestionId는 null입니다. 두 번째 오답도 correct는 false입니다. 네트워크 재시도는 같은 submissionId와 내용을 사용합니다.
         */
        post: operations["answer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/referrals/registration": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 온보딩 초대 코드 등록
         * @description 신규 가입자의 PENDING 상태에서만 등록한다. 같은 코드 재전송은 멱등하다. 현재 미리보기의 policyVersion을 보내며 변경 시 409로 재확인한다. 등록 시 두 단계 정책을 고정하고 가입 보상을 적립한다. 등록 전 결제는 소급하지 않는다.
         */
        post: operations["register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/referrals/registration/skip": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 온보딩 초대 코드 건너뛰기
         * @description 온보딩에서 건너뛰면 반드시 호출한다. 이후 등록할 수 없으며 재전송은 멱등하다.
         */
        post: operations["skip"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/referrals/code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 내 초대 코드 발급
         * @description 8자리 대문자 영문·숫자 코드를 멱등하게 반환한다. 이전 형식 코드는 새 코드로 교체한다.
         */
        post: operations["issue"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/nps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * NPS 제출
         * @description 서비스 전반 만족도 점수와 선택 의견을 저장한다.
         */
        post: operations["submit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/paywall/dismiss": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 페이월 이탈 (할인 부여 중단)
         * @description 요청 바디 없이 호출합니다. 2026-10 상품 개편으로 5분 할인 부여를 중단해 promo는 항상 null입니다. 구버전 앱 호환을 위해 경로와 응답 형식만 유지하며, 호출해도 서버에 아무것도 기록하지 않습니다.
         */
        post: operations["dismissPaywall"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/mailbox/feedbacks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 피드백 등록
         * @description 문의·버그 제보·기능 제안·응원 메시지를 등록한다.
         */
        post: operations["submitFeedbackWithImages"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/free-talk/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 지난 프리톡 목록 조회
         * @description 인증된 사용자의 완료된 프리톡을 완료 시각 최신순으로 페이지 조회한다.
         */
        get: operations["getSessions"];
        put?: never;
        /**
         * 프리톡 세션 시작
         * @description AI 선시작 또는 사용자 선시작 프리톡 세션을 생성한다. 발화 한도 기본값은 KST 하루 누적 120분이다. 세션 시작·발화·종료 결정·표현 재시도는 계정별 요청 한도를 공유한다 (기본 일일 1,000회, 고정 1분 구간당 20회).
         */
        post: operations["startSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/free-talk/sessions/{sessionId}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 프리톡 발화 제출
         * @description 사용자 발화를 저장하고 AI 후속 메시지, 종료 확인 또는 시간 제한 종료를 반환한다. 0ms 발화도 요청 한도에 포함하며, 저장된 응답을 반환하는 재전송은 추가 차감하지 않는다. AI 호출 실패 시 발화 시간은 반환하지만 요청 횟수는 유지한다.
         */
        post: operations["submitMessage_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/free-talk/sessions/{sessionId}/expressions/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 맞춤 표현 생성 재시도 */
        post: operations["retryExpressions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/free-talk/sessions/{sessionId}/exit-decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 프리톡 종료 의사 결정
         * @description 종료를 확정하면 마무리 메시지와 함께 세션을 완료하고, 취소하면 대화를 계속한다.
         */
        post: operations["decideExit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/free-talk/sessions/{sessionId}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 프리톡 직접 완료
         * @description 진행 중이거나 종료 확인 대기 중인 세션을 즉시 완료한다. 이미 완료된 세션도 200을 반환한다. 서버에 저장된 발화까지 보존하고 마무리 AI 발화는 생성하지 않는다. 동시 발화 요청은 서버의 발화 저장과 완료 잠금 순서로 결정되며 완료 후 새 발화는 거부한다. 응답 후 summary를 조회하고 pending이면 다시 조회한다. 종료 사유는 DIRECT_COMPLETION이며 작별 종료 USER_ENDED, 시간 소진 TIME_LIMIT_REACHED와 구분한다.
         */
        post: operations["completeSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expressions/{expressionId}/pronunciation/sentence-analysis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 문장 발화 음성파일 제출
         * @description 대표 예문을 읽은 녹음을 분석해 점수와 단어별 발음·강세 판정, 코칭 문구를 반환한다. 판정 기준은 사용자의 AI 튜터 억양을 따른다.
         */
        post: operations["analyzeSentence"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expressions/{expressionId}/learning-finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 원어민 표현 학습 완료
         * @description 시나리오는 순차 잠금, 프리톡은 세션 연결 검증 후 완료를 기록한다.
         */
        post: operations["finishLearning"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/token/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 토큰 갱신
         * @description 유효한 refresh token을 회전하고 새 토큰을 발급한다.
         */
        post: operations["refresh"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/social-login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 소셜 로그인
         * @description OIDC ID Token과 nonce를 검증하고 서비스 토큰을 발급한다. 기존 사용자는 이메일만 최신 값으로 갱신하고, 닉네임은 제공자 이름으로 덮어쓰지 않는다. 닉네임은 가입 때 한 번 저장되며 이후에는 닉네임 변경 API로만 바뀐다. 신규 사용자는 Accept-Language의 선호 순서에서 ko/ja를 선택한다. 둘 다 없으면 언어 선택이 필요하다. 로그인 후 GET /api/v1/me/locale의 selectionRequired를 확인한다. 기존 사용자의 저장 언어는 유지한다.
         */
        post: operations["socialLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 로그아웃
         * @description 전달받은 refresh token을 폐기하고 installationId가 있으면 해당 설치의 푸시를 중지한다.
         */
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{userProfileId}/subscription-grants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 사용자 수동 권한 이력 */
        get: operations["history"];
        put?: never;
        /**
         * 상품 무료 이용 권한 부여
         * @description 요청 UUID로 멱등 처리합니다. 유효한 수동 권한 중복 부여는 거절합니다. 기존 유료 결제는 보존합니다.
         */
        post: operations["grant"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/scenarios/{scenarioId}/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 관리자 테스트용 시나리오 세션 시작
         * @description develop 환경에서 진행 순서와 하루 제한 없이 활성 시나리오 테스트 세션을 시작한다.
         */
        post: operations["start_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/referral-rewards/{id}/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 지급 근거 재확인 */
        post: operations["retryReward"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/referral-billing-events/{id}/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 결제 수신 재처리 */
        post: operations["retryEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/push-campaigns": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 푸시 캠페인 목록 조회
         * @description 예약 여부와 상태를 AND 조건으로 필터링하고 생성 시각·ID 내림차순으로 조회한다. 응답은 items와 페이지 정보다. scheduledAt은 UTC이며 화면에서는 Asia/Seoul로 변환하고 페이지는 page + 1로 표시한다.
         */
        get: operations["list"];
        put?: never;
        /**
         * 푸시 캠페인 생성
         * @description ALL(기본값) 또는 SELECTED다. SELECTED는 수동 userProfileIds와 선택적 audienceSql의 합집합에서 excludedUserProfileIds를 뺀다. 1000명 캠페인 제한은 없고 내부 DB 처리는 1000개씩 나눈다. SQL은 발송 시 다시 실행한다. 개별 클릭과 ID 붙여넣기는 같은 userProfileIds 배열로 전송한다. 대상 조건과 내용은 생성 후 수정할 수 없다.
         */
        post: operations["create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/push-campaigns/{campaignId}/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 관리자 본인 테스트 발송 */
        post: operations["test"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/push-campaigns/{campaignId}/send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 캠페인 발송
         * @description 저장된 ALL 또는 SELECTED 범위 중 활성 사용자·활성 Token에 발송한다.
         */
        post: operations["send"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/push-campaigns/{campaignId}/schedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 캠페인 예약
         * @description +09:00 오프셋을 명시한다. 최초 예약은 1분 이후여야 한다. SCHEDULE_PENDING은 외부 등록 확인 전 상태로 같은 시각으로 재시도한다. 발송은 분 단위 정밀도다.
         */
        post: operations["schedule"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/push-campaigns/{campaignId}/cancel-schedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 캠페인 예약 취소 */
        post: operations["cancelSchedule"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/push-campaigns/audience-query": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 대상 SQL 미리보기
         * @description user_profile_id 한 컬럼의 SELECT/읽기 CTE만 허용한다. 시간 제한 10초, 기본 결과 제한 10만 행을 넘으면 전체 조회 실패다. SQL은 감사 로그에 남기지 않는다.
         */
        post: operations["queryAudience"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/popups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 관리자 팝업 목록 조회 */
        get: operations["list_1"];
        put?: never;
        /**
         * 관리자 팝업 등록
         * @description 이미지는 기존 content-images/presigned-url로 업로드한 imageUrl을 사용할 수 있습니다. 시각은 Z 또는 +09:00 등 시간대를 포함해야 하며 마이크로초 정밀도로 저장합니다.
         */
        post: operations["create_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/email-tests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 관리자 이메일 테스트 접수
         * @description 체험 알림 ON/OFF와 무관하게 입력 주소로 테스트 메일을 발송합니다. SES 접수 여부는 작업 조회 API에서 확인합니다.
         */
        post: operations["test_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/mailbox/replies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 피드백 일괄 답장 */
        post: operations["sendReplies"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/mailbox/letters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 공지·업데이트 목록 */
        get: operations["getLetters"];
        put?: never;
        /**
         * 공지·업데이트 초안 생성
         * @description locale(ko/ja, 생략 시 ko)로 기본 언어를 지정한다. translations에 다른 언어 콘텐츠를 함께 등록하면 하나의 공지로 동시에 게시된다.
         */
        post: operations["createLetter"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/mailbox/direct-letters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 직접 편지 발송 목록
         * @description DIRECT 발송만 sentAt DESC, letterId DESC로 조회한다. 한 번의 발송은 한 항목이며 recipientCount는 탈퇴 수신자를 포함한다. page × size는 2147483647 이하여야 하며 잘못된 페이지 조건은 400 VALIDATION_FAILED다.
         */
        get: operations["getDirectLetters"];
        put?: never;
        /**
         * 특정 사용자에게 직접 편지 발송
         * @description 활성 사용자 1~100명에게 DIRECT 편지를 즉시 발송한다. 저장 완료 후 수신자에게 편지 상세로 연결되는 푸시 알림을 요청한다. 중복 ID는 400 INVALID_REQUEST, 잘못된 입력은 400 VALIDATION_FAILED, 존재하지 않거나 탈퇴한 수신자는 404 RESOURCE_NOT_FOUND다. 수신자 하나라도 유효하지 않으면 전체 발송을 취소한다. 같은 요청을 다시 보내면 새 편지가 생성된다.
         */
        post: operations["sendDirectLetter"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/expressions/pronunciation-assets/import-tts-from-s3": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 관리자 발음 TTS 매니페스트 S3 임포트 (2단계)
         * @description S3의 TTS 매니페스트를 내려받아 문장·표현·단어별 음성 URL을 기존 자산에 붙인다. 기준 데이터 임포트(1단계)가 먼저 실행돼 있어야 한다.
         */
        post: operations["importTts"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/expressions/pronunciation-assets/import-reference-from-s3": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 관리자 발음 기준 데이터 S3 임포트 (1단계)
         * @description S3의 locale별 기준 데이터 JSON을 내려받아 (표현, 억양) 단위로 발음 표기 데이터를 upsert한다. manifestKey는 AI 파이프라인이 업로드한 파일 키를 그대로 사용한다.
         */
        post: operations["importReference"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 제작 규칙 목록
         * @description scope·status로 거를 수 있다. 둘 다 생략하면 전체(은퇴 포함)를 코드 순으로 돌려준다.
         */
        get: operations["list_2"];
        put?: never;
        /**
         * 제작 규칙 등록(코멘트 승격)
         * @description scope 접두어 + 다음 번호로 코드를 매기고 ACTIVE로 등록한다. 다음 AI 호출부터(진행 중 배치 포함) 들어간다. sourceCommentId가 있으면 그 코멘트에서 승격한 것으로 남긴다(없는 코멘트면 404). IMAGE는 I 접두어를 쓰며 에셋 기능 비활성 시 409.
         */
        post: operations["create_2"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-images/presigned-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 콘텐츠 이미지 업로드 URL 발급 */
        post: operations["createPresignedUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 콘텐츠 제작 배치 목록 */
        get: operations["list_3"];
        put?: never;
        /**
         * 콘텐츠 제작 배치 생성
         * @description 시작 Day는 서버가 정한다. 캐릭터별 Day 수의 합은 dayCount와 같아야 한다.
         */
        post: operations["create_3"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 실패·멈춘 배치 Day 생성 재시작
         * @description FAILED 배치와 heartbeat가 멈춤 기준(요청 제한 × 3 + 60초)을 넘긴 GENERATING 배치만 GENERATING으로 되돌려 Day 생성을 다시 제출한다. 끝난 Day는 그대로 두고 FAILED·GENERATING·LINEUP Day만 빠진 단계부터 만든다. 다른 상태면 409.
         */
        post: operations["resume"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/proceed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 라인업 확정 → Day 생성 시작
         * @description LINEUP_READY 배치만 GENERATING으로 바꾸고 Day 생성을 제출한다. 다른 상태면 409.
         */
        post: operations["proceed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/lineup/regenerate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 코멘트로 라인업 재생성
         * @description LINEUP_READY 배치를 REQUESTED로 돌리고 코멘트를 누적해 라인업 생성을 다시 제출한다. 다른 상태면 409.
         */
        post: operations["regenerateLineup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/drafts/{draftId}/regenerate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Day 재생성
         * @description scope가 ALL이면 전부, QUESTIONS_AND_EXPRESSIONS:{level}이면 그 레벨 질문 3개와 표현 4개, EXPRESSIONS:{level}이면 그 레벨 표현 4개, STAR_MESSAGES면 별점 문구만 다시 만든다. 미해결 FIX 코멘트가 프롬프트에 들어간다. 배치가 REVIEW_READY가 아니거나 Day가 생성 중이면 409, scope 표기가 틀리면 400.
         */
        post: operations["regenerate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/drafts/{draftId}/assets/regenerate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Day 에셋 재생성 (2차)
         * @description target이 가리키는 에셋만 PENDING으로 되돌리고 배치를 ASSETS_GENERATING으로 바꿔 다시 만든다. note는 이미지 프롬프트에만 붙는다. 표기: ALL, THUMBNAIL, QUESTION_AUDIO:{level}:{order}, EXPRESSION_IMAGE:{expressionId}:{REPRESENTATIVE|PRACTICE_3|PRACTICE_4}, PRONUNCIATION:{expressionId}. 배치가 ASSETS_REVIEW_READY가 아니면 409, 표기가 틀리면 400, 이 Day에 없는 대상이면 404. Day의 담당자 확인은 지워진다. 에셋 기능 비활성 시 409.
         */
        post: operations["regenerateAsset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/assets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 에셋 생성 시작·재시작 (2차)
         * @description APPROVED 배치의 에셋 생성을 시작해 ASSETS_GENERATING으로 바꾼다. 에셋 단계에서 실패한 FAILED 배치와 heartbeat가 멈춤 기준을 넘긴 ASSETS_GENERATING 배치는 재시작으로 받고 완성된 에셋은 건너뛴다. 그 외 상태면 409. 끝나면 실패 에셋이 있어도 ASSETS_REVIEW_READY가 되고 batch.errorMessage에 요약이 남는다. 에셋 기능 비활성 시 409.
         */
        post: operations["startAssets"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 배치 승인 + 표현 id 예약
         * @description REVIEW_READY 배치의 모든 Day가 OK일 때 APPROVED로 바꾸고 Day마다 writing_expression id 12개를 예약한다. OK가 아닌 Day가 있거나 다른 승인과 id가 겹치면 409.
         */
        post: operations["approve"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sessions/{sessionId}/end": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * 세션 중도 종료
         * @description 진행 중인 학습 세션을 INTERRUPTED 상태로 종료한다.
         */
        patch: operations["endSession"];
        trace?: never;
    };
    "/api/v1/admin/popups/{popupId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * 관리자 팝업 부분 수정
         * @description 생략한 필드는 유지합니다. linkUrl: null은 링크를 제거하며 다른 필드의 null은 거부합니다. excludedUserIds/excludedAudiences는 각각 []로 숨김을 전체 해제할 수 있습니다. enabled: false로 노출을 중단할 수 있습니다. 시작 시각은 종료 시각보다 빨라야 합니다.
         */
        patch: operations["update_4"];
        trace?: never;
    };
    "/api/v1/admin/mailbox/letters/{letterId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * 공지·업데이트 수정
         * @description translations는 생략하면 유지하고, 전달하면 전체 교체한다. 빈 배열은 추가 번역을 제거한다. 게시 상태·고정·숨김 대상·읽음 기록은 언어 간 공유한다.
         */
        patch: operations["updateLetter"];
        trace?: never;
    };
    "/api/v1/admin/content-rules/{ruleId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * 제작 규칙 은퇴
         * @description status는 RETIRED만 받는다(400). 이미 은퇴한 규칙이면 409. 행은 이력으로 남고 프롬프트에서만 빠진다.
         */
        patch: operations["changeStatus"];
        trace?: never;
    };
    "/api/v1/admin/app-versions/{platform}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** 관리자 앱 버전 정책 수정 */
        patch: operations["update_5"];
        trace?: never;
    };
    "/api/v1/sessions/{sessionId}/messages/{messageId}/inner-thought": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 사용자 메시지 속마음 조회
         * @description 속마음 생성 상태와 완료된 속마음 결과를 조회한다.
         */
        get: operations["getInnerThought"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sessions/{sessionId}/level-assessment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 세션 텍스트 수준 평가 조회
         * @description 비동기 수준 평가 상태와 완료된 영역별 평가 결과를 조회한다. 신규 영역·종합 점수는 1~100이며 scoreMax=100이다. 과거 평가는 원래 1~5 점수와 scoreMax=5를 유지한다. 학습 레벨과 displayLevel은 1~5이며 confidence는 관찰 비율이다. LANDIT_SUBSCRIPTION_LAUNCHED_AT 미설정, 현재 시각이 도입 시각 전이거나 도입 전 완료 세션이면 HTTP 200과 success=true, data=null, error=null을 반환한다. FE는 polling을 종료한다. 현재 시각이 도입 시각에 도달하면 서버 재시작 없이 수준 평가를 활성화한다. 도입 이후 최초 유효 평가만 기존/기본 수준을 대체하고 INITIALIZED를 반환한다. 이후 현재 레벨 상한보다 4점 이상 높은 충분한 평가가 2회 연속이면 한 단계 승급한다. 레벨 1~4의 승급 기준은 각각 24·44·64·84점이며 자동 강등은 없다. changeType은 INITIALIZED, PROMOTED, UNCHANGED, NOT_APPLIED이며 과거 v1.2 평가 조회에는 DEMOTED가 남아 있을 수 있다. previousLevel과 currentLevel로 변경 전후 수준을 제공한다. Fallback·근거 부족·최신 설정 이후 도착한 오래된 평가는 적용하지 않는다. 영역 confidence는 정답 확률이 아닌 가중 관찰 비율이다.
         */
        get: operations["getLevelAssessment"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scenarios": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 시나리오 전체 조회
         * @description 카테고리별 시나리오 목록과 사용자별 일일 접근 상태, 신규·재도전 구분, 별점, 시작 메시지 미리보기를 조회한다.
         */
        get: operations["listScenarios"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scenarios/{scenarioId}/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 시나리오 전체 완료 회차 히스토리 조회
         * @description 사용자 ID는 로그인 토큰에서 식별한다. 완료한 모든 회차를 endedAt 내림차순, 동률이면 sessionId 내림차순으로 반환한다. 진행 중·중도 종료 회차는 제외하며, 비활성 콘텐츠의 과거 기록도 조회한다. 각 회차의 messages는 messageSequence 오름차순이다. 기록이 없거나 존재하지 않는 시나리오 ID이면 sessions는 빈 배열이다. 저장된 완료 피드백이 없으면 feedback은 null이며 AI 생성은 실행하지 않는다. feedback.hasPreviousSameScenarioCompletion은 각 회차 시작 시각까지 동일 시나리오의 이전 완료 이력이 있는지다. 이후 완료한 기록은 과거 회차의 판단에 포함하지 않는다. 기존 정책으로 잠긴 상세 피드백은 messageFeedbacks가 빈 배열이고 detailFeedbackLocked가 true다. 과거 평가 문맥을 복원할 메시지나 시작 안내가 없으면 evaluationContext는 null이다.
         */
        get: operations["getHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scenarios/daily": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 날짜별 시나리오 조회
         * @description 오늘 배정된 시나리오 또는 과거 학습 인정일의 시나리오를 조회한다. 새 정책 세션은 시작일, 기존 세션은 완료일을 인정일로 사용한다. date를 생략하면 Asia/Seoul 기준 오늘을 조회한다.
         */
        get: operations["getDailyScenario"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scenarios/calendar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 시나리오 캘린더 조회
         * @description 기준 날짜가 포함된 창의 모든 칸을 반환한다. WEEK은 그 날짜가 속한 주(일요일 시작) 7칸이며 이웃 달 날짜가 섞일 수 있다. MONTH은 그 달 1일부터 말일까지만 반환한다. 학습 인정일에는 완료 시나리오 ID와 썸네일이 담긴다. 새 정책 세션은 시작일, 기존 세션은 완료일이다. 미완료 오늘 칸은 배정된 시나리오 ID만 담기고 그 외 칸은 비어 있다.
         */
        get: operations["getCalendar"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reviews/{reviewId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 복습 상태 조회
         * @description READY는 시작 전, IN_PROGRESS는 진행 중, COMPLETED는 완료, EXPIRED는 만료입니다. 완료 결과는 구독 만료 후에도 조회합니다.
         */
        get: operations["get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/referrals/rewards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 내 레퍼럴 지급 근거
         * @description recipientRole=INVITER로 내가 친구를 초대해 얻은 보상을 조회한다. 필터는 페이지 구분 전에 적용하며 다음 before에는 마지막 항목 id를 보낸다. 표시 금액은 creditedWon이며 stage와 createdAt으로 문구·날짜를 구성한다. 보류·검토·환불·한도 초과 0원 내역도 포함하므로 status와 reason을 함께 확인한다.
         */
        get: operations["rewards"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/referrals/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 초대 코드와 보상 조건 확인
         * @description 로그인 후 8자리 코드를 확인하고 온보딩 등록 요청에 code와 policyVersion을 전달한다. 대소문자를 구분하지 않는다. 정책 변경 시 409로 재확인한다.
         */
        get: operations["preview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/referrals/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 내 레퍼럴 조회
         * @description 초대 인원, 초대인 적립 순액(inviterCreditedWon), 현재 한도와 사용량·잔여량을 반환한다. 한도 사용액은 환불로 줄지 않아 적립 순액과 다를 수 있다. 무제한이면 value/used/remaining은 null이다. 초대인 적립 순액은 검토 중 보존액을 포함하며 별도 지갑·출금 가능액이 아니다. 통합 적립액과 환급 가능액은 /api/v1/me/rewards에서 조회한다.
         */
        get: operations["me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/popups/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 현재 노출 팝업 조회
         * @description enabled이며 startsAt <= 현재 시각 < endsAt인 팝업을 조회합니다. 로그인 사용자의 개별 ID 또는 현재 구독 유형에 해당하는 숨김 대상을 제외한 뒤 priority 내림차순, popupId 내림차순으로 하나를 선택합니다. 비인증 요청에는 사용자·구독 유형 숨김 설정이 없는 팝업만 반환합니다. 대상이 없으면 HTTP 200과 data: null을 반환합니다. 인증 없이 호출할 수 있습니다.
         */
        get: operations["getActive"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/subscription": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 사용자 구독 상태 조회
         * @description RevenueCat 웹훅으로 갱신된 서버 기준 구독 상태를 조회합니다. premium이 true면 프리미엄 혜택이 적용 중입니다. isTrial이 true면 연간 구독의 7일 무료 체험 중이며 expiresAt이 체험 종료 시각입니다. 대시보드에서 부여한 프로모션 권한은 periodType이 PROMOTIONAL이고 isTrial은 false입니다. 시나리오 대화는 구독과 관계없이 무료이고, 무료 사용자의 상세 피드백 잠금은 피드백 응답의 detailFeedbackLocked로 판단합니다. promo는 할인 부여 중단으로 항상 null입니다. price·currency는 최신 실제 결제 금액·통화이며 없으면 null입니다. productId와 store는 프리미엄이 켜져 있을 때만 값이 있습니다.
         */
        get: operations["getSubscription"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/subscription/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 사용자 구독 결제 이력 조회
         * @description RevenueCat 웹훅으로 저장한 결제 이력을 occurredAt 내림차순으로 최근 50개까지 조회합니다. 페이지는 없습니다. 체험·프로모션·해지처럼 결제가 없는 이벤트는 price가 0이고, environment가 SANDBOX면 테스트 결제입니다.
         */
        get: operations["getSubscriptionEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/streak": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 현재 스트릭 조회
         * @description 현재 연속 학습 일수, KST 기준 오늘 날짜와 정상 완료 여부를 조회한다. 신규 환급 참여자는 rewardSummary로 현재 잔액·이전 회차 환급 예정액·남은 기회를 받는다. 결제 회차 도착 전에는 PENDING이며 금액과 remainingDays가 null이다. 기존 상품 이용자는 새 환급 필드를 받지 않는다.
         */
        get: operations["getCurrentStreak"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/streak/calendar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 월별 스트릭 달력 조회
         * @description KST 기준 오늘 날짜, 현재 스트릭 통계와 조회 월의 완료 날짜를 조회한다. 환급 참여자에게 rewardSummary와 월의 모든 날짜별 rewardDays를 추가한다. 부분 적립과 무활동 초기화액은 구분하며 미래·판정 대기 금액은 null이다. 기존 activeDates의 의미는 유지한다. 구독 만료 후에도 본인의 과거 기록을 조회할 수 있다. year와 month를 모두 생략하면 KST 현재 월을 조회하고, 지정할 때는 둘 다 전달해야 한다.
         */
        get: operations["getCalendar_1"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/rewards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 통합 적립과 환급 현황
         * @description 100일 챌린지 현황과 만료 이후 출금 가능한 금액·상태, 재구매 가능 여부를 반환한다. 결제 확인 시 구매일 KST 00시부터 완료한 학습도 적립한다. 오늘의 시나리오 완료는 하루 한 번 구매 시 확정한 상품 정가의 100분의 1을 적립하며 표현·스몰톡은 적립하지 않는다. 미완료일에도 누적액을 보존하며 만료 자정부터 출금 가능한 금액을 제공한다. 실제 지급 완료가 아니다. balanceWon은 학습과 레퍼럴의 통합 적립액이다. 레퍼럴은 구매 전에도 보존하고 본인의 최초 적격 100일 회차 만기 후 함께 환급한다. current.balanceWon과 pendingRefundWon, withdrawableWon에도 합산한다. develop 프로필에서만 샌드박스 회차에도 레퍼럴을 연결해 표시하며, 샌드박스는 출금 가능액에서 제외한다. 학습 상한 maximumWon은 그대로이며 학습 50000원과 레퍼럴 3000원은 총 53000원이다. 무료 사용자의 preview는 과거 오늘의 시나리오 완료까지 포함하여 하루 500원을 기한 없이 누적한 표시용 금액이다. 챌린지 구매 후에는 preview=null이며 만료 후에도 숨긴다. 출금·환급액과 이력에 합산하지 않는다.
         */
        get: operations["summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/rewards/preview/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 무료 적립 기록
         * @description 소급분과 오늘 적립분을 포함한 날짜 내림차순 기록이다. date는 KST yyyy-MM-dd, amountWon은 저장된 표시용 금액이다. 보상 현황의 preview가 null이면 빈 목록을 반환한다. limit은 1~100이며 기본 40이다. nextCursor는 마지막 날짜이며 다음 페이지는 해당 날짜 이전 기록을 반환한다. 마지막 페이지는 null이다. 실제 환급액이나 출금액이 아니며 조회는 적립·재정산을 수행하지 않는다.
         */
        get: operations["previewHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/rewards/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 통합 적립 상세 내역
         * @description 시각·문자열 ID 역순. 시나리오·레퍼럴 적립과 만기를 모든 회차에서 조회한다. EARN의 activityType은 SCENARIO, REFERRAL_SIGNUP, REFERRAL_PURCHASE다. 구매 대기 적립의 cycleId는 null이다. 0원 완료·미확정·검토 중 회차와 적립은 제외한다. 같은 시각에는 레퍼럴, 학습 완료, 만기 순서다. 잔액은 해당 회차 기준이며 보정 후에도 ID는 유지한다. 지연 확정 내역은 첫 페이지부터 갱신한다. 조회는 재정산하지 않으며 날짜 마감은 주기 정산 후 반영된다.
         */
        get: operations["history_1"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/rewards/cycles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 학습 보상 회차 목록
         * @description 회차 ID 역순 커서 페이지. limit은 1~50이다.
         */
        get: operations["page"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/rewards/cycles/{cycleId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 학습 보상 회차 상세
         * @description 구매/만료 시각, 고정 최대액과 날짜별 달성/마감/적립 내역을 반환한다.
         */
        get: operations["detail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me/rewards/completions/{completionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 완료별 학습 보상
         * @description 완료 응답이 PENDING이면 이 경로로 재조회한다. 금액 null은 미확정, 0은 확정된 추가 적립 없음이다. 구매일의 결제 전 완료도 결제 확인 후 조회할 수 있다. 최초 완료 응답은 불변이며 이 조회만 최신 계산을 반환한다. 다른 사용자의 완료는 404다.
         */
        get: operations["completion"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/mailbox/unread-count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 안 읽은 편지 개수 조회
         * @description 읽지 않은 편지 개수를 반환한다.
         */
        get: operations["getUnreadCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/mailbox/sent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 보낸 피드백 목록 조회
         * @description 인증된 사용자가 등록한 피드백을 최신순으로 조회한다.
         */
        get: operations["getSentFeedbacks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/mailbox/sent/{feedbackId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 보낸 피드백 상세 조회
         * @description 등록한 피드백의 본문과 처리 상태를 조회한다.
         */
        get: operations["getSentFeedback"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/mailbox/received": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 받은 편지 목록 조회
         * @description 저장된 사용자 언어(ko/ja)의 콘텐츠가 있는 공지·업데이트와 본인이 수신한 답장·직접 편지(DIRECT)를 최신순으로 조회한다.
         */
        get: operations["getReceivedLetters"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/mailbox/received/{letterId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 받은 편지 상세 조회
         * @description 저장된 사용자 언어의 공지·업데이트와 본인이 수신한 답장·직접 편지(DIRECT)를 조회하고 읽음 처리한다. 해당 언어 콘텐츠가 없으면 404를 반환한다. DIRECT는 bodyText로 표시하며 피드백 인용 필드는 null이다.
         */
        get: operations["getReceivedLetter"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/mailbox/feedbacks/{feedbackId}/attachments/{attachmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 문의 첨부 이미지 조회
         * @description 작성자 또는 관리자 Bearer 인증이 필요하다. 다른 사용자는 404를 반환한다. 응답은 API JSON 래퍼가 아닌 이미지 바이트이며 캐시하지 않는다.
         */
        get: operations["getFeedbackAttachment"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/free-talk/topics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 프리톡 추천 주제 조회
         * @description 활성 프리톡 추천 주제 중 무작위로 최대 5개를 뽑아 반환한다. 주제 구성과 displayOrder는 요청마다 달라진다.
         */
        get: operations["getTopics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/free-talk/sessions/{sessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 지난 프리톡 상세 조회
         * @description 인증된 사용자가 완료한 프리톡의 세션 정보와 전체 대화를 조회한다. 사용자 메시지에는 턴 교정(correction)과 교정 처리 상태(correctionStatus)가 함께 내려가고, correctionCount는 교정이 있는 사용자 메시지 수다. correction이 null이고 correctionStatus가 COMPLETED면 고칠 것이 없는 턴, PREPARING이면 생성 중이라 재조회가 필요한 턴, FAILED면 교정을 만들지 못한 턴이다. 생성 중인 교정은 서버가 스스로 끝낸다. AI가 판정을 돌려주지 못했거나 서버가 재시작되면 최대 3회까지 다시 시도하고, 그래도 만들지 못하면 FAILED로 확정하므로 PREPARING이 끝없이 남지 않는다. 한 번 COMPLETED나 FAILED가 된 교정은 다시 바뀌지 않는다. AI 메시지는 세 필드가 모두 null이다. correction.memoryTag는 장기기억을 근거로 한 교정에만 "9/13 스몰톡에서 말한 헬스장" 형식(한국어 고정)으로 내려주고, 라벨을 만들지 못했으면 "9/13 스몰톡에서 말한 내용"으로 채운다. 기억을 근거로 쓰지 않은 교정은 null이다. 태그는 교정과 함께 저장한 값이라 그 기억이 나중에 바뀌어도 달라지지 않는다. reusedExpression은 사용자가 이전에 학습을 마친 표현을 그 메시지에서 다시 썼을 때만 내려준다. matchedText는 content 안에 대소문자까지 그대로 들어 있는 구절이라 그 위치에 밑줄을 그으면 된다. 한 메시지에서 여러 표현을 썼어도 하나만 내려주고, 다시 쓴 표현이 없거나 AI 메시지면 null이다. 세션 종료 후 expressionGenerationStatus가 PREPARING인 동안은 아직 판정 전이라 null일 수 있다. 교정은 진행 중인 대화의 응답에는 포함되지 않는다. 구독이 만료된 사용자도 본인이 완료한 세션은 조회할 수 있다.
         */
        get: operations["getSession"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/free-talk/sessions/{sessionId}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 오늘의 스몰톡 요약 조회
         * @description 완료된 스몰톡의 종료 후 요약(S7b)을 반환한다. 점수·별점은 없다. 총평(headline·comparison·growth·correctionCount)은 이 세션의 턴 교정이 모두 끝난 뒤 한 번 계산해 저장하고, 그 뒤에는 조회할 때마다 같은 값을 돌려준다. 계산 전이면 pending이 true이고 총평 필드는 모두 null이다. 교정이 끝나기를 세션 종료 후 30초까지 기다리고, 그 뒤에는 끝나지 않은 교정을 빼고 확정하므로 pending이 끝없이 남지 않는다. 그렇게 빠진 교정이 나중에 끝나면 지난 프리톡 상세에는 보이지만 이 요약의 correctionCount·growth에는 반영되지 않는다. 그렇게 교정을 빼고 확정할 때는 남은 교정이 같은 패턴일 수 있으므로 growth의 "오늘은 맞게 썼다"(succeeded true)는 주장하지 않고, 또 틀린 근거가 있을 때만 growth를 둔다. headline과 comparison은 확정 뒤 항상 있고(첫 스몰톡은 comparison.previous가 모두 0), growth는 직전 스몰톡에서 교정받은 패턴(많이 틀린 순 최대 3개) 중 하나가 이번에 다시 나왔을 때만 있다. growth의 구절(previousWrongSpan·currentSpan)은 각 문장에 대소문자까지 그대로 정확히 한 번 들어 있으며 특정하지 못했으면 null이다. reusedExpressions와 followUp은 종료 후 비동기 작업의 결과라 각자 pending을 가진다. 표현 작업이 실패로 끝나면 reusedExpressions는 pending 없이 빈 목록이다. 장기기억 작업이 시작된 지(워커가 아직 집지 않았으면 세션 종료 후) 5분이 지나도 끝나지 않으면 서버가 실패로 확정하므로 followUp.pending도 끝없이 남지 않고, 그때 followUp의 질문 세 필드는 null이다. 미완료 세션은 409(SESSION_NOT_COMPLETED)다(지난 프리톡 상세 조회는 같은 경우 404를 준다). 구독이 만료된 사용자도 본인이 완료한 세션은 조회할 수 있다.
         */
        get: operations["getSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expressions/{scenarioId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 시나리오별 원어민 표현 전체 조회
         * @description 표현 목록과 사용자별 완료 여부, 순서 잠금 상태, 무료 체험 표현 여부(freeTrial)를 반환한다. 무료 사용자는 freeTrial=true인 표현 1개만 학습할 수 있다.
         */
        get: operations["getExpressions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expressions/{expressionId}/practice": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 원어민 표현 학습 추가 예문 조회
         * @description 눈으로 익히는 추가 예문 2건과 직접 푸는 작문 문제 2건(영어·한국어 각 1건)을 조회한다. writingSentenceAcceptedAnswers는 허용 정답의 2차원 토큰 배열이다. 한국어는 복수 정답을, 영어와 추가 정답이 없는 예문은 기존 정답 하나를 담는다. 기존 writingSentenceWords와 writingSentenceWordChoices도 함께 유지한다.
         */
        get: operations["getExtraPracticeExamples"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/expressions/{expressionId}/learning-start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 원어민 표현 학습 시작
         * @description 선택한 표현의 뜻, 설명과 대표 예문에 사용자의 학습 완료 여부를 더해 조회한다.
         */
        get: operations["getOneExpressionToStartLearning"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/app-versions/check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 앱 버전 업데이트 확인 */
        get: operations["check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 관리자 사용자 목록 조회
         * @description 사용자 기본 정보를 가입일 최신순으로 페이지 조회한다. 필터는 AND 조건이며 생략하면 전체를 조회한다. 검색어는 앞뒤 공백을 제거하고 이메일·닉네임 대소문자 없는 부분 일치 또는 숫자 ID 완전 일치로 검색한다. %, _, !는 와일드카드가 아닌 문자로 검색한다. 푸시 동의는 서버 저장값으로, 실시간 기기 권한이나 활성 Token 보유 여부를 의미하지 않는다. totalCount와 totalPages는 필터 적용 결과 기준이다. page는 0부터 시작하며 결과가 없으면 totalPages는 0이다.
         */
        get: operations["list_4"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{userProfileId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 관리자 사용자 상세 조회
         * @description 사용자 프로필과 최소 학습 요약을 조회한다.
         */
        get: operations["detail_1"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/signup-statistics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 관리자 가입 통계 조회
         * @description Asia/Seoul 기준 월요일 00:00과 매월 1일 00:00을 경계로 집계한다. 이번 주·달은 asOf까지, 지난 주·달은 시작 포함·끝 제외 기간이다. 사용자 목록과 동일하게 탈퇴·정지·관리자 프로필을 포함하며 미래 시각은 제외한다.
         */
        get: operations["statistics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/subscription/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 무료 부여 상품 목록
         * @description 실제 청구·자동 갱신·환급 권리를 생성하지 않습니다.
         */
        get: operations["products"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/scenarios": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 관리자 테스트용 시나리오 목록 조회
         * @description develop 환경에서 활성 상태인 시나리오 콘텐츠만 관리자 테스트 목록으로 조회한다.
         */
        get: operations["list_5"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/referral-rewards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 관리자 레퍼럴 지급 내역 */
        get: operations["rewards_1"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/referral-policy/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 레퍼럴 정책 변경 이력 */
        get: operations["history_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/referral-billing-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 레퍼럴 결제 수신 상태 */
        get: operations["events"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/push-campaigns/{campaignId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 푸시 캠페인 상세 조회 */
        get: operations["detail_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/push-campaigns/{campaignId}/audience-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 캠페인 예상 대상 조회 */
        get: operations["preview_1"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/nps-responses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 관리자 NPS 목록 조회
         * @description NPS 응답을 제출 시각 최신순으로 페이지 조회하고 작성자 정보를 함께 반환한다.
         */
        get: operations["list_6"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/notifications/jobs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 알림 작업 상태 조회 */
        get: operations["job"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/mailbox/feedbacks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 피드백 검색 */
        get: operations["getFeedbacks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/mailbox/feedbacks/{feedbackId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 피드백 상세 조회 */
        get: operations["getFeedback"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/mailbox/direct-letters/{letterId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 직접 편지 발송 상세
         * @description 탈퇴 수신자도 포함한다. readAt은 최초 읽음 시각이며 미열람이면 null이다. 관리자 조회는 읽음 상태를 변경하지 않는다. 없거나 DIRECT 발송이 아니면 404 RESOURCE_NOT_FOUND다.
         */
        get: operations["getDirectLetter"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/expressions/pronunciation-assets/coverage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 관리자 발음 평가 자산 커버리지 조회
         * @description 활성 표현 전체를 기준으로 억양별 기준 데이터·음성 보유 수와 빠진 표현 ID 목록을 반환한다.
         */
        get: operations["coverage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 콘텐츠 제작 배치 상세 */
        get: operations["detail_3"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/{batchId}/drafts/{draftId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Day 초안 상세
         * @description 시나리오·표현·별점 payload, 검증기 결과, AI 검수 결함, 담당자 코멘트를 돌려준다. 배치에 그 초안이 없으면 404.
         */
        get: operations["draftDetail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content-batches/next-day": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 다음 Day와 기존 시나리오 현황
         * @description 발행된 마지막 Day와 미발행 배치가 예약한 마지막 Day 중 큰 값 + 1을 다음 Day로 돌려준다.
         */
        get: operations["nextDay"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/app-versions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 관리자 앱 버전 정책 목록 */
        get: operations["list_7"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/accent-locales": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 영어 억양 선택지 조회 */
        get: operations["getAccentLocales"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * 회원 탈퇴
         * @description 회원 행과 문의·첨부파일은 유지하고 닉네임을 '탈퇴한 사용자'로 덮어쓴다. 이메일·프로필 이미지·소셜 식별 원본과 refresh token을 정리하고, 장기기억을 삭제하며 계정 소유의 모든 푸시 Token을 비활성화한다.
         */
        delete: operations["withdraw"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{userProfileId}/subscription-grants/{grantId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * 수동 이용 권한 회수
         * @description 지정한 부여 건만 회수하며 유료 결제는 유지합니다.
         */
        delete: operations["revoke"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        PushDeviceUpdateRequest: {
            /** @enum {string} */
            platform: "IOS" | "ANDROID";
            expoPushToken?: string;
            pushEnabled: boolean;
            expoPushTokenValid?: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseVoid: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: unknown;
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 공통 오류 응답 객체 */
        ErrorResponse: {
            /**
             * @description 애플리케이션 오류 코드
             * @example RESOURCE_NOT_FOUND
             */
            code?: string;
            /**
             * @description 사용자 언어별 오류 메시지. 인증 시 저장 언어, 미인증 시 Accept-Language를 따른다. 기본값은 한국어이며 일본어는 코드별 안내를 제공한다.
             * @example 요청한 리소스를 찾을 수 없습니다.
             */
            message?: string;
        };
        /** @description 사용자 닉네임 변경 요청 */
        UserNicknameUpdateRequest: {
            /**
             * @description 새 닉네임. 앞뒤 공백 제거 후 1자 이상 20자 이하의 글자·숫자·공백만 허용. 이모지와 기호 불가
             * @example 랜딧러버
             */
            nickname: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseUserNicknameResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["UserNicknameResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 저장된 사용자 닉네임 */
        UserNicknameResponse: {
            /**
             * @description 저장된 닉네임
             * @example 랜딧러버
             */
            nickname?: string;
        };
        UserLocalePreference: {
            /** @enum {string} */
            locale: "ko" | "ja";
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseUserLocalePreferenceResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["UserLocalePreferenceResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        UserLocalePreferenceResponse: {
            /** @enum {string} */
            locale: "ko" | "ja";
            selectionRequired: boolean;
        };
        /** @description 사용자 학습 수준 변경 요청 */
        UserLearningLevelUpdateRequest: {
            /**
             * Format: int32
             * @description 1부터 5까지의 학습 수준
             * @example 3
             */
            learningLevel: number;
        };
        ExpoPushTokenUpdateRequest: {
            /** @enum {string} */
            platform: "IOS" | "ANDROID";
            expoPushToken: string;
            enabled: boolean;
            expoPushTokenFormatValid?: boolean;
        };
        /** @description 사용자 일일 알람 설정 변경 요청 */
        UserAlarmUpdateRequest: {
            /**
             * @description 기기 현지 시간 기준 시각. 비활성화할 때도 전달합니다.
             * @example 07:30
             */
            time: string;
            /**
             * @description 알람 활성화 여부
             * @example true
             */
            enabled: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseUserAlarmResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["UserAlarmResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 사용자 일일 알람 설정. 실제 기기 예약 성공 여부와는 별개입니다. */
        UserAlarmResponse: {
            /**
             * @description 기기 현지 시간 기준 HH:mm 시각. 미설정이면 null
             * @example 07:30
             */
            time?: string | null;
            /**
             * @description 저장된 알람 활성화 여부
             * @example true
             */
            enabled?: boolean;
        };
        /** @description 사용자 영어 억양 변경 요청 */
        UserAccentLocaleUpdateRequest: {
            /**
             * @description 선택한 영어 억양
             * @example EN_GB
             * @enum {string}
             */
            accentLocale: "EN_US" | "EN_AU" | "EN_GB";
        };
        ReferralProcessingRequest: {
            /** Format: int64 */
            expectedRevision?: number;
            paused?: boolean;
            reason: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseReferralPolicyState: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ReferralPolicyState"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 가입·결제의 초대인 보상에 합산 적용하는 평생 한도 */
        ReferralInviterLimit: {
            /** @enum {string} */
            type: "UNLIMITED" | "INVITE_COUNT" | "TOTAL_AMOUNT";
            /** Format: int64 */
            value?: number;
        };
        ReferralPolicy: {
            /** Format: int64 */
            version?: number;
            signup?: components["schemas"]["ReferralStage"];
            purchase?: components["schemas"]["ReferralStage"];
            products?: components["schemas"]["ReferralProduct"][];
            inviterLimit?: components["schemas"]["ReferralInviterLimit"];
            /** Format: int64 */
            createdBy?: number;
            /** Format: date-time */
            createdAt?: string;
            reason?: string;
        };
        ReferralPolicyState: {
            policy?: components["schemas"]["ReferralPolicy"];
            /** Format: int64 */
            revision?: number;
            paused?: boolean;
        };
        ReferralProduct: {
            appId: string;
            store: string;
            productId: string;
            displayName: string;
            purchaseType: string;
        };
        ReferralStage: {
            enabled?: boolean;
            /** @enum {string} */
            target: "NONE" | "INVITER" | "INVITEE" | "BOTH";
            /** Format: int64 */
            inviterWon?: number;
            /** Format: int64 */
            inviteeWon?: number;
        };
        ReferralPolicyUpdateRequest: {
            /** Format: int64 */
            expectedRevision?: number;
            signup: components["schemas"]["ReferralStage"];
            purchase: components["schemas"]["ReferralStage"];
            products: components["schemas"]["ReferralProduct"][];
            inviterLimit?: components["schemas"]["ReferralInviterLimit"];
            reason: string;
        };
        TrialReminderSettings: {
            pushEnabled: boolean;
            emailEnabled: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseTrialReminderSettings: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["TrialReminderSettings"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 라인업 행 수정 요청 */
        AdminContentLineupRowRequest: {
            /** Format: int32 */
            day?: number;
            title: string;
            /** Format: int32 */
            categoryDisplayOrder?: number;
            proposedCategory?: string;
            /** @enum {string} */
            difficulty: "EASY" | "NORMAL" | "HARD";
            /** @enum {string} */
            firstSpeaker: "AI" | "USER";
            characterId: string;
            beats: string[];
        };
        /** @description 라인업 수정 요청 */
        AdminContentLineupUpdateRequest: {
            rows: components["schemas"]["AdminContentLineupRowRequest"][];
        };
        AdminContentAssetProgress: {
            /** Format: int32 */
            total: number;
            /** Format: int32 */
            done: number;
            /** Format: int32 */
            failed: number;
            /** Format: int32 */
            qaFailed: number;
            confirmed: boolean;
        };
        AdminContentBatchResponse: {
            batch: components["schemas"]["AdminContentBatchSummary"];
            days: components["schemas"]["AdminContentDraftSummary"][];
        };
        AdminContentBatchSummary: {
            /** Format: int64 */
            batchId: number;
            /** @enum {string} */
            status: "REQUESTED" | "LINEUP_GENERATING" | "LINEUP_READY" | "GENERATING" | "REVIEW_READY" | "APPROVED" | "ASSETS_GENERATING" | "ASSETS_REVIEW_READY" | "ASSETS_READY" | "PUBLISHED" | "FAILED";
            /** Format: int32 */
            startDay: number;
            /** Format: int32 */
            endDay: number;
            /** Format: int32 */
            dayCount: number;
            characterRatio: components["schemas"]["ContentCharacterRatio"];
            note: string | null;
            autoProceed: boolean;
            /** Format: int64 */
            requestedBy: number;
            errorMessage: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        AdminContentDraftSummary: {
            /** Format: int64 */
            draftId: number;
            /** Format: int32 */
            plannedDay: number | null;
            /** @enum {string} */
            status: "LINEUP" | "GENERATING" | "REVIEW_READY" | "OK" | "NEEDS_FIX" | "APPROVED" | "PUBLISHED" | "FAILED";
            title: string | null;
            errorMessage: string | null;
            /** @description 라인업 행 JSON(design.md 5절 모양). 라인업 전이면 null */
            lineupRow?: unknown;
            /** @description 에셋 진행 수. 에셋 생성 전이면 null */
            assetProgress?: components["schemas"]["AdminContentAssetProgress"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminContentBatchResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminContentBatchResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        ContentCharacterRatio: {
            /** Format: int32 */
            chloe?: number;
            /** Format: int32 */
            marco?: number;
            /** Format: int32 */
            teddy?: number;
        };
        /** @description Day 검수 저장 요청 */
        AdminContentDraftReviewRequest: {
            /** @enum {string} */
            verdict: "OK" | "FIX";
            comments?: components["schemas"]["AdminContentReviewCommentRequest"][];
        };
        /** @description 검수 코멘트 */
        AdminContentReviewCommentRequest: {
            /** @example expressions[LEVEL_4_TO_5][1] */
            targetPath?: string;
            /** @example 질문에 이미 나온 말을 표현으로 뽑았다. */
            comment: string;
        };
        AdminContentDraftDetail: {
            /** Format: int64 */
            draftId: number;
            /** Format: int64 */
            batchId: number;
            /** Format: int32 */
            plannedDay: number | null;
            /** @enum {string} */
            status: "LINEUP" | "GENERATING" | "REVIEW_READY" | "OK" | "NEEDS_FIX" | "APPROVED" | "PUBLISHED" | "FAILED";
            lineupRow?: unknown;
            scenarioPayload?: unknown;
            /** @description 표현 12개 목록 */
            expressionPayload?: string;
            /** @description 별점 문구 5개 목록 */
            starMessagePayload?: string;
            validationResult?: unknown;
            /** @description AI 검수 결함 목록. 통과면 빈 배열 */
            reviewResult?: string;
            reservedExpressionIds?: number[];
            errorMessage: string | null;
            comments: components["schemas"]["AdminContentReviewCommentResponse"][];
            /** @description 에셋 payload(썸네일·질문 음성·표현 이미지·발음 자산 URL과 상태). 에셋 생성 전이면 null */
            assetPayload?: unknown;
            assetProgress?: components["schemas"]["AdminContentAssetProgress"];
        };
        AdminContentReviewCommentResponse: {
            /** Format: int64 */
            commentId: number;
            targetPath: string | null;
            /** @enum {string} */
            verdict: "OK" | "FIX";
            comment: string | null;
            /** Format: date-time */
            resolvedAt: string | null;
            /** Format: int64 */
            authorId: number;
            /** Format: date-time */
            createdAt: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminContentDraftDetail: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminContentDraftDetail"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 에셋 교체 업로드 요청 */
        AdminContentAssetReplaceRequest: {
            /** @example THUMBNAIL */
            target: string;
            /** @example content/inbox/0c1d2e3f-4a5b-4c6d-8e9f-0a1b2c3d4e5f.webp */
            objectKey: string;
        };
        /** @description 사용자 발화 제출 요청 */
        SessionMessageSubmitRequest: {
            /** @description 사용자 메시지 본문 */
            content?: string;
            /**
             * @description 입력 타입
             * @enum {string}
             */
            inputType?: "VOICE" | "TEXT" | "GENERATED";
            /** @description 재전송 시 유지할 클라이언트 메시지 UUID. 구버전 요청은 생략 가능 */
            clientMessageId?: string;
            /** @description 첫 시나리오의 해당 답변 작성·녹음 전/중 가이드 열람 여부. 재전송 시 유지 */
            guideViewed?: boolean;
        };
        /** @description 첫 시나리오의 답변 가이드 */
        AnswerGuide: {
            /**
             * @description 그대로 따라 말할 수 있는 영어 답변
             * @example I want to go to Gyeongju. I like history.
             */
            content?: string;
            /**
             * @description 반말로 제공하는 한국어 뜻
             * @example 경주에 가고 싶어. 역사를 좋아해.
             */
            translatedContent?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseSessionMessageSubmitResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["SessionMessageSubmitResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 다음 AI 메시지 응답 */
        NextMessageResponse: {
            /**
             * Format: int64
             * @description 메시지 ID
             */
            messageId?: number;
            /**
             * Format: int32
             * @description 턴 번호
             */
            turnNumber?: number;
            /**
             * Format: int32
             * @description 세션 히스토리 안 메시지 순서
             */
            messageSequence?: number;
            /** @description 발화 주체 */
            role?: string;
            /** @description 메시지 본문 */
            content?: string;
            /** @description 기준 locale 번역 */
            translatedContent?: string;
            /** @description TTS로 변환할 동적 메시지 */
            ttsText?: string;
            /** @description 이어서 재생할 고정 질문 텍스트 */
            fixedQuestionText?: string | null;
            /** @description 이어서 재생할 고정 질문 음원 URL */
            questionAudioUrl?: string;
            /** @description 다음 질문의 답변 가이드. 종료 메시지와 미설정 질문은 null */
            answerGuide?: components["schemas"]["AnswerGuide"];
        };
        RewardActivity: {
            activityType?: string;
            /** Format: int64 */
            earnedWon?: number;
            completed?: boolean;
            /** Format: int32 */
            targetCount?: number;
            /** Format: int32 */
            completedCount?: number;
            /** Format: int64 */
            nextEarnableWon?: number;
            /**
             * Format: int64
             * @description 오늘의 시나리오 미완료 시 구매 시 확정한 상품 정가의 100분의 1, 완료 또는 마감 시 0원
             */
            remainingWon?: number;
        };
        RewardCompletion: {
            /**
             * Format: int64
             * @description 완료별 고유 ID. 재요청에도 유지하며 프론트 중복 안내 방지에 사용
             */
            completionId?: number;
            /** Format: int64 */
            cycleId?: number;
            activityType?: string;
            /**
             * Format: date
             * @description 학습 인정 날짜. 새 정책 세션은 시작일, 기존 세션은 완료일
             */
            learningDate?: string;
            /**
             * @description 미확정 PENDING은 금액 null, 확정 0원은 NO_ADDITIONAL_REWARD
             * @enum {string}
             */
            status?: "EARNED" | "NO_ADDITIONAL_REWARD" | "PENDING";
            reason?: string;
            /**
             * Format: int64
             * @description 이번 완료로 받은 정수 원. 미확정이면 null
             * @example 100
             */
            earnedWon?: number;
            /**
             * Format: int64
             * @description 해당 완료 직후 회차 잔액. 최초 영수증은 고정, 재조회는 최신 보정 금액
             */
            balanceWon?: number;
            /**
             * Format: int64
             * @description 학습 인정 날짜의 전체 적립액
             * @example 300
             */
            todayEarnedWon?: number;
            /**
             * Format: int64
             * @description 학습 인정 날짜의 실제 한도
             * @example 300
             */
            todayMaximumWon?: number;
            /** @description 오늘의 시나리오 완료 여부. PENDING은 미달성 확정을 뜻하지 않음 */
            todayFullyAchieved?: boolean;
            activities?: components["schemas"]["RewardActivity"][];
            /** Format: date-time */
            computedAt?: string;
            /** Format: int64 */
            calculationVersion?: number;
            currency?: string;
        };
        /** @description 사용자 발화 제출 응답 */
        SessionMessageSubmitResponse: {
            /**
             * Format: int64
             * @description 세션 ID
             */
            sessionId?: number;
            /** @description 제출된 사용자 메시지 */
            submittedMessage?: components["schemas"]["SubmittedMessageResponse"];
            /** @description 다음 AI 메시지 */
            nextMessage?: components["schemas"]["NextMessageResponse"];
            /** @description 세션 진행도 */
            progress?: components["schemas"]["SessionProgressResponse"];
            reward?: components["schemas"]["RewardCompletion"];
        };
        /** @description 세션 진행도 응답 */
        SessionProgressResponse: {
            /**
             * Format: int32
             * @description 현재 턴 번호
             */
            currentTurnNumber?: number;
            /**
             * Format: int32
             * @description 현재 턴의 메시지 순서
             */
            currentMessageSequenceNumber?: number;
            /**
             * Format: int32
             * @description 고정 질문 개수
             */
            totalQuestionCount?: number;
            /** @description 세션 완료 여부 */
            completed?: boolean;
        };
        /** @description 제출된 사용자 메시지 응답 */
        SubmittedMessageResponse: {
            /**
             * Format: int64
             * @description 메시지 ID
             */
            messageId?: number;
            /**
             * Format: int32
             * @description 턴 번호
             */
            turnNumber?: number;
            /**
             * Format: int32
             * @description 세션 히스토리 안 메시지 순서
             */
            messageSequence?: number;
            /** @description 발화 주체 */
            role?: string;
            /**
             * @description 메시지별 피드백 처리 상태. 정상 접수 시 PREPARING
             * @enum {string}
             */
            feedbackProcessingStatus?: "PREPARING" | "COMPLETED" | "FAILED";
            /**
             * @description 상대 역할 속마음 처리 상태
             * @enum {string}
             */
            innerThoughtProcessingStatus?: "PREPARING" | "COMPLETED" | "FAILED";
            /** @description 상대 역할의 속마음 */
            innerThought?: string;
            /** @description 속마음 유형 */
            innerThoughtType?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseSessionFeedbackResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["SessionFeedbackResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        Details: {
            strength?: string;
            improvement?: string;
        };
        DomainScore: {
            /** @description 공개 응답에서 항상 숫자로 제공하는 영역 점수. scoreMax 척도를 따르며 미관찰·실패는 0. 가이드 의존은 100점 척도에서 21~40점이며 독립 근거와 구분한다 */
            score?: number;
            /** @description 관찰 근거 비율. 정답 확률이 아님 */
            confidence?: number;
        };
        EvaluationContextResponse: {
            /** @enum {string} */
            type?: "AI_MESSAGE" | "SCENARIO_OPENING_INSTRUCTION";
            content?: string;
            translatedContent?: string;
        };
        Item: {
            /** Format: int64 */
            expressionId?: number;
            text?: string;
            meaning?: string;
            sourceLabel?: string;
            /** Format: int64 */
            messageId?: number;
            quotedSentence?: string;
            matchedText?: string;
        };
        MessageFeedbackResponse: {
            /** Format: int64 */
            messageFeedbackId?: number;
            /** Format: int64 */
            messageId?: number;
            /** Format: int32 */
            turnNumber?: number;
            userMessage?: string;
            evaluationContext?: components["schemas"]["EvaluationContextResponse"];
            /** @enum {string} */
            feedbackType?: "GOOD" | "NEEDS_IMPROVEMENT";
            baseLocaleAnalogy?: string;
            positiveFeedback?: string;
            feedbackDetail?: string;
            correctionExpression?: string;
            correctionReason?: string;
            benchmarkMessage?: string;
        };
        ScenarioExpressionReuseSummary: {
            pending?: boolean;
            items?: components["schemas"]["Item"][];
        };
        ScenarioGrowthCard: {
            /** @enum {string} */
            pattern?: "TENSE" | "SUBJECT_VERB_AGREEMENT" | "VERB_FORM" | "ARTICLE" | "PLURAL" | "PRONOUN" | "PREPOSITION" | "NEGATION" | "QUESTION_FORM";
            patternLabel?: string;
            succeeded?: boolean;
            /** Format: date */
            previousDate?: string;
            previousSentence?: string;
            previousWrongSpan?: string;
            currentSentence?: string;
            currentSpan?: string;
        };
        SessionFeedbackResponse: {
            /** Format: int64 */
            sessionId?: number;
            /** Format: int32 */
            nativeScore?: number;
            starRating?: number;
            highlightMessage?: string;
            summaryMessage?: string;
            messageFeedbacks?: components["schemas"]["MessageFeedbackResponse"][];
            /**
             * @description 상세 피드백 잠금 여부. 유료 도입 후 무료 사용자는 첫 시나리오의 첫 완료 세션만 메시지별 피드백을 받고, 그 외 세션은 messageFeedbacks가 비고 이 값이 true다. 결제 후 다시 조회하면 false와 함께 전부 내려간다.
             * @example false
             */
            detailFeedbackLocked?: boolean;
            /** @description 비동기 사용자 수준 평가 상태와 결과. 평가 비활성 세션이면 null */
            userLevelAssessment?: components["schemas"]["SessionLevelAssessmentResponse"];
            /** @description 직전 완료 시나리오와 비교할 근거가 없으면 null */
            growthFeedback?: components["schemas"]["ScenarioGrowthCard"];
            /** @description pending이면 분석 중, 완료 후 items가 비어 있으면 FE에서 카드를 숨긴다 */
            expressionReuse?: components["schemas"]["ScenarioExpressionReuseSummary"];
            /**
             * @description 현재 세션 시작 시각까지 같은 사용자가 동일 scenarioId를 완료한 이력이 있으면 true다. 현재 세션과 진행 중·중도 종료 세션은 제외한다. 언어·질문 레벨이 달라도 동일 시나리오이면 포함한다. 과거 총평도 해당 세션 시작 시각을 기준으로 판단하며, 성장 비교나 표현 재사용 결과의 존재 여부와는 독립적이다.
             * @example false
             */
            hasPreviousSameScenarioCompletion?: boolean;
        };
        SessionLevelAssessment: {
            situationPerformance?: components["schemas"]["DomainScore"];
            grammar?: components["schemas"]["DomainScore"];
            vocabulary?: components["schemas"]["DomainScore"];
            discourse?: components["schemas"]["DomainScore"];
            interactionPragmatics?: components["schemas"]["DomainScore"];
            /** @description 관찰된 영역의 가중치를 재정규화한 종합 점수. scoreMax로 척도를 구분하며 미평가 시 null */
            assessedScore?: number;
            /**
             * Format: int32
             * @description 학습 레벨. 정상 모델 평가에서 전부 가이드 의존이면 시작 수준 2, 영어 미관찰이면 1
             */
            assessedLevel?: number;
            /** @description 기존 FE 호환용 결과 표시 가능 여부. 계산된 레벨 또는 영어 미관찰의 시작 레벨이 있으면 true. 전부 가이드 의존인 시작 수준 2도 표시하며 실제 근거 충족 여부와는 다름 */
            sufficientEvidence?: boolean;
            /** @enum {string} */
            source?: "MODEL" | "FALLBACK";
            /**
             * @description 평가에 따른 수준 변경. 가이드 의존·영어 미관찰의 시작 수준 배정은 NOT_APPLIED
             * @enum {string}
             */
            changeType?: "INITIALIZED" | "PROMOTED" | "DEMOTED" | "UNCHANGED" | "NOT_APPLIED";
            /** Format: int32 */
            previousLevel?: number;
            /** Format: int32 */
            currentLevel?: number;
            details?: components["schemas"]["Details"];
            assessmentVersion?: string;
            /** Format: int32 */
            displayLevel?: number;
            /**
             * Format: int32
             * @description 영역별 점수와 종합 점수의 상한. 과거 평가는 5, 신규 평가는 100
             * @enum {integer}
             */
            scoreMax?: "5" | "100";
        };
        /** @description 수준 평가 상태와 결과. 비활성 또는 도입 전 완료 세션이면 data 자체가 null */
        SessionLevelAssessmentResponse: {
            /** Format: int64 */
            sessionId?: number;
            /** @enum {string} */
            processingStatus?: "NOT_REQUESTED" | "PREPARING" | "COMPLETED" | "FAILED";
            levelAssessment?: components["schemas"]["SessionLevelAssessment"];
        } | null;
        /** @description 공통 API 응답 객체 */
        ApiResponseSessionStartResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["SessionStartResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 대화 캐릭터 정보 */
        ConversationCharacterResponse: {
            /**
             * @description 캐릭터 식별자
             * @example chloe
             */
            characterId?: string;
            /** @description 활성 TTS 음성. 미설정 또는 비활성 음성이면 null */
            ttsVoice?: components["schemas"]["TtsVoiceResponse"];
        };
        /** @description 현재 메시지 응답 */
        CurrentMessageResponse: {
            /**
             * Format: int64
             * @description 메시지 ID
             */
            messageId?: number;
            /**
             * Format: int32
             * @description 턴 번호
             */
            turnNumber?: number;
            /**
             * Format: int32
             * @description 세션 히스토리 안 메시지 순서
             */
            messageSequence?: number;
            /** @description 발화 주체 */
            role?: string;
            /** @description 메시지 본문 */
            content?: string;
            /** @description 기준 locale 번역 */
            translatedContent?: string;
            /** @description 첫 고정 질문 음원 URL */
            questionAudioUrl?: string;
            /** @description 첫 화면에 보여줄 상대 역할의 속마음 */
            innerThought?: string;
            /** @description 속마음 유형 */
            innerThoughtType?: string;
            /** @description 현재 질문의 답변 가이드. 없으면 null */
            answerGuide?: components["schemas"]["AnswerGuide"];
        };
        /** @description 시나리오 세션 시작 응답 */
        SessionStartResponse: {
            /**
             * Format: int64
             * @description 생성된 학습 세션 ID
             */
            sessionId?: number;
            /**
             * Format: int64
             * @description 시나리오 ID
             */
            scenarioId?: number;
            /** @description 시나리오 캐릭터 정보 */
            character?: components["schemas"]["ConversationCharacterResponse"];
            /** @description 세션 타입 */
            sessionType?: string;
            /** @description 첫 발화자 */
            firstSpeaker?: string;
            /** @description USER first 시 사용자 시작 안내 */
            userOpeningInstruction?: string;
            /** @description AI first 시 생성된 현재 메시지 */
            currentMessage?: components["schemas"]["CurrentMessageResponse"];
            /** @description 세션 진행도 */
            progress?: components["schemas"]["SessionProgressResponse"];
        };
        /** @description 시나리오 TTS 음성 */
        TtsVoiceResponse: {
            /** @description TTS Provider */
            provider?: string;
            /** @description TTS 모델 */
            model?: string;
            /** @description Provider에서 사용하는 음성 ID */
            providerVoiceId?: string;
            /** @description 음성 성별 */
            gender?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseReviewResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ReviewResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        ReviewQuestion: {
            /** Format: uuid */
            questionId?: string;
            /** Format: int64 */
            expressionId?: number;
            targetExpressionText?: string;
            baseExpressionMeaningText?: string;
            quiz?: components["schemas"]["WritingSentenceResponse"];
            /** Format: int32 */
            displayOrder?: number;
            /** Format: int32 */
            queueOrder?: number;
            /** Format: int32 */
            wrongCount?: number;
            /** Format: date-time */
            completedAt?: string;
        };
        ReviewResponse: {
            /** Format: uuid */
            reviewId?: string;
            status?: string;
            /** Format: date-time */
            availableUntil?: string;
            /** Format: date-time */
            expiresAt?: string;
            /** Format: date-time */
            completedAt?: string;
            /** Format: uuid */
            currentQuestionId?: string;
            questions?: components["schemas"]["ReviewQuestion"][];
        };
        /** @description 작문 연습 문제. 추가 예문 4건 중 2건이 작문 문제로 선택되며 한국어 콘텐츠는 영어·한국어 한 건씩, 일본어 콘텐츠는 영어 두 건이다 */
        WritingSentenceResponse: {
            /**
             * @description 작문 문제의 출제 언어. EN이면 영어 문장을, KR이면 한국어 해석을 조립한다
             * @example EN
             * @enum {string}
             */
            quizLanguage?: "EN" | "KR" | "JA";
            /**
             * @description 작문 문제의 영어 예문
             * @example The special effects blew my mind.
             */
            writingSentenceText?: string;
            /**
             * @description 작문 문제의 해석
             * @example 특수효과가 끝내줬어.
             */
            writingSentenceTranslation?: string;
            /**
             * @description 작문을 유도하는 연습 질문
             * @example How was the movie?
             */
            writingQuestion?: string;
            /**
             * @description 연습 질문의 해석
             * @example 영화 어땠어?
             */
            writingQuestionTranslation?: string;
            /**
             * @description 정답 단어 배열(정답 순서 유지). 언어는 quizLanguage를 따른다
             * @example [
             *       "The",
             *       "special",
             *       "effects",
             *       "blew",
             *       "my",
             *       "mind"
             *     ]
             */
            writingSentenceWords?: string[];
            /**
             * @description 정답 단어와 오답 단어를 섞은 선택지 배열. 언어는 quizLanguage를 따른다
             * @example [
             *       "special",
             *       "blew",
             *       "The",
             *       "mind",
             *       "amazing",
             *       "have",
             *       "get",
             *       "effects",
             *       "my"
             *     ]
             */
            writingSentenceWordChoices?: string[];
            /**
             * @description 허용 정답 토큰 배열 목록. 첫 번째 배열은 writingSentenceWords와 같다. KR은 저장된 복수 정답, EN은 기존 정답 하나를 담는다. 추가 정답이 없는 예문도 기존 정답 하나를 담는 2차원 배열이다. 각 배열의 토큰 순서와 개수가 모두 일치하면 정답으로 처리한다.
             * @example [
             *       [
             *         "The",
             *         "special",
             *         "effects",
             *         "blew",
             *         "my",
             *         "mind"
             *       ]
             *     ]
             */
            writingSentenceAcceptedAnswers?: string[][];
        };
        ReviewAnswerRequest: {
            /** Format: uuid */
            submissionId: string;
            /** Format: uuid */
            questionId: string;
            words: string[];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseReviewAnswerResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ReviewAnswerResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        ReviewAnswerResponse: {
            correct?: boolean;
            review?: components["schemas"]["ReviewResponse"];
        };
        ReferralRegistrationRequest: {
            code: string;
            /** Format: int64 */
            policyVersion: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseString: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: string;
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description NPS 제출 요청 */
        NpsSubmitRequest: {
            /**
             * Format: int32
             * @description 1부터 5까지의 만족도 점수
             * @example 3
             */
            score: number;
            /**
             * @description 선택 사용자 의견
             * @example 피드백은 좋았지만 기다리는 시간이 길었어요.
             */
            opinionText?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponsePaywallDismissResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["PaywallDismissResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 5분 할인 기회. 할인 부여 중단으로 현재는 생성되지 않으며 스키마 호환용으로 유지 */
        DiscountOffer: {
            /**
             * Format: int64
             * @description 서버 기준 남은 초. 소수 초 올림
             * @example 300
             */
            remainingSeconds?: number;
            /**
             * Format: date-time
             * @description 서울 시간대 만료 시각
             * @example 2026-09-21T14:35:00
             */
            expiresAt?: string;
            /** @description 부여 당시 가입 후 7일 미만이면 true */
            newUser?: boolean;
        };
        PaywallDismissResponse: {
            /** @description 항상 null. 할인 부여 중단 후 구버전 앱 호환용으로 필드만 유지 */
            promo?: components["schemas"]["DiscountOffer"];
        };
        /** @description 편지함 피드백 등록 요청 */
        MailboxFeedbackSubmitRequest: {
            /**
             * @description 피드백 유형
             * @example QUESTION
             * @enum {string}
             */
            type: "BUG_REPORT" | "FEATURE_REQUEST" | "QUESTION" | "CHEER";
            /**
             * @description 피드백 내용
             * @example 로그인 관련 문의입니다.
             */
            content: string;
        };
        /** @description 프리톡 세션 시작 요청 */
        FreeTalkSessionStartRequest: {
            /**
             * @description 첫 발화 주체
             * @example AI_FIRST
             * @enum {string}
             */
            startMode?: "AI_FIRST" | "USER_FIRST";
            /**
             * Format: int64
             * @description AI 선시작에서 선택한 활성 추천 주제 ID
             * @example 2
             */
            topicId?: number;
            /**
             * @description 프리톡 캐릭터 식별자
             * @example chloe
             * @enum {string}
             */
            characterId: "chloe" | "marco" | "teddy";
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseFreeTalkSessionStartResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["FreeTalkSessionStartResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 프리톡 현재 AI 메시지 */
        FreeTalkCurrentMessageResponse: {
            /**
             * Format: int64
             * @description 메시지 ID
             */
            messageId?: number;
            /**
             * Format: int32
             * @description 대화 턴 번호
             */
            turnNumber?: number;
            /**
             * Format: int32
             * @description 세션 내 메시지 순서
             */
            messageSequence?: number;
            /**
             * @description 발화 주체
             * @example AI
             */
            role?: string;
            /** @description AI 메시지 원문 */
            content?: string;
            /** @description AI 메시지 기준 언어 번역 */
            translatedContent?: string;
            /** @description AI 캐릭터 감정 */
            emotion?: string;
        };
        /** @description 프리톡 세션 시작 응답 */
        FreeTalkSessionStartResponse: {
            /**
             * Format: int64
             * @description 생성된 학습 세션 ID
             */
            sessionId?: number;
            /**
             * @description 세션 타입
             * @example FREE_TALK
             */
            sessionType?: string;
            /** @description 첫 발화 주체 */
            startMode?: string;
            /** @description 프리톡 캐릭터 정보 */
            character?: components["schemas"]["ConversationCharacterResponse"];
            /** @description AI 선시작 주제명. 사용자 선시작은 null */
            title?: string;
            /**
             * Format: int64
             * @description 사용자 일일 발화 시간 제한 밀리초
             * @example 7200000
             */
            speakingTimeLimitMs?: number;
            /** @description AI 선시작의 첫 AI 메시지. 사용자 선시작은 null */
            currentMessage?: components["schemas"]["FreeTalkCurrentMessageResponse"];
        };
        FreeTalkMessageSubmitRequest: {
            clientMessageId: string;
            content: string;
            /** @enum {string} */
            inputType: "VOICE" | "TEXT" | "GENERATED";
            /** Format: int64 */
            utteranceDurationMs: number;
            timeLimitReached: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseFreeTalkMessageSubmitResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["FreeTalkMessageSubmitResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        FreeTalkMessageSubmitResponse: {
            /** Format: int64 */
            sessionId?: number;
            title?: string;
            /** @enum {string} */
            turnStatus?: "CONTINUE" | "EXIT_CONFIRMATION_REQUIRED" | "COMPLETED";
            submittedMessage?: components["schemas"]["FreeTalkSubmittedMessageResponse"];
            nextMessage?: components["schemas"]["FreeTalkNextMessageResponse"];
            progress?: components["schemas"]["ProgressResponse"];
        };
        /** @description 프리톡 AI 후속 메시지 */
        FreeTalkNextMessageResponse: {
            /** Format: int64 */
            messageId?: number;
            /** Format: int32 */
            turnNumber?: number;
            /** Format: int32 */
            messageSequence?: number;
            role?: string;
            content?: string;
            translatedContent?: string;
            /** @enum {string} */
            emotion?: "NEUTRAL" | "HAPPY" | "SURPRISED" | "SAD" | "ANGRY";
        };
        /** @description 프리톡 사용자 제출 메시지 */
        FreeTalkSubmittedMessageResponse: {
            /** Format: int64 */
            messageId?: number;
            /** Format: int32 */
            turnNumber?: number;
            /** Format: int32 */
            messageSequence?: number;
            role?: string;
            innerThought?: string;
            /** @enum {string} */
            innerThoughtType?: "GOOD" | "NORMAL" | "BAD";
            /** @enum {string} */
            innerThoughtProcessingStatus?: "PREPARING" | "COMPLETED" | "FAILED";
        };
        ProgressResponse: {
            /** @enum {string} */
            sessionStatus?: "IN_PROGRESS" | "AWAITING_EXIT_DECISION" | "COMPLETED";
            /** Format: int64 */
            accumulatedSpeakingDurationMs?: number;
            /** Format: int64 */
            speakingTimeLimitMs?: number;
            /** Format: int64 */
            usedSpeakingTimeMs?: number;
            /** Format: int64 */
            remainingSpeakingTimeMs?: number;
            /** @enum {string} */
            expressionGenerationStatus?: "PREPARING" | "READY" | "FAILED";
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseFreeTalkExpressionRetryResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["FreeTalkExpressionRetryResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        FreeTalkExpressionRetryResponse: {
            /** Format: int64 */
            sessionId?: number;
            /** @enum {string} */
            expressionGenerationStatus?: "PREPARING" | "READY" | "FAILED";
        };
        FreeTalkExitDecisionRequest: {
            /** Format: int64 */
            submittedMessageId: number;
            /** @enum {string} */
            decision: "CONTINUE" | "END";
        };
        /** @description 공통 API 응답 객체 */
        ApiResponsePronunciationAnalysisResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["PronunciationAnalysisResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 문장 발화 발음 평가 응답 */
        PronunciationAnalysisResponse: {
            /**
             * Format: int32
             * @description 점수 0~100. 정상 단어 수 / 전체 단어 수 × 100 반올림. 오류 없으면 100
             * @example 75
             */
            score?: number;
            /**
             * @description 통과 여부. 오류 단어(PHONEME_ERROR·STRESS_ERROR)가 0개면 true
             * @example false
             */
            passed?: boolean;
            /** @description 단어별 판정. order 오름차순, 대표 예문의 단어와 1:1 */
            words?: components["schemas"]["Word"][];
        };
        /** @description 단어 1개의 발음 판정 */
        Word: {
            /**
             * Format: int32
             * @description 문장 내 단어 순번
             * @example 2
             */
            order?: number;
            /**
             * @description 단어 표면형
             * @example nothing
             */
            word?: string;
            /**
             * @description 판정 상태
             * @example PHONEME_ERROR
             */
            status?: string;
            /**
             * Format: int32
             * @description 사용자 녹음에서 단어 구간 시작(ms)
             * @example 500
             */
            startTimeMs?: number;
            /**
             * Format: int32
             * @description 사용자 녹음에서 단어 구간 끝(ms)
             * @example 940
             */
            endTimeMs?: number;
            /** @description 원어민 단어 TTS CDN URL. 오류 단어만 */
            nativeWordAudioUrl?: string;
            /**
             * @description 원어민 발음 respelling. PHONEME_ERROR만
             * @example nuh·thing
             */
            nativeDisplay?: string;
            /**
             * @description 사용자 발음 respelling. PHONEME_ERROR만
             * @example nuh·ssing
             */
            userDisplay?: string;
            /**
             * @description 원어민 표기에서 빨강 처리할 부분. PHONEME_ERROR만
             * @example th
             */
            errorTargetSpan?: string;
            /**
             * @description 사용자 표기에서 빨강 처리할 부분. PHONEME_ERROR만
             * @example ss
             */
            errorUserSpan?: string;
            /**
             * @description 음절 분해 배열. STRESS_ERROR만
             * @example [
             *       "hik",
             *       "ing"
             *     ]
             */
            syllables?: string[];
            /**
             * Format: int32
             * @description 원어민 강세 음절 인덱스(초록 점). STRESS_ERROR만
             * @example 0
             */
            stressIndex?: number;
            /**
             * Format: int32
             * @description 사용자가 힘준 음절 인덱스(빨간 점). STRESS_ERROR만
             * @example 1
             */
            userStressIndex?: number;
            /**
             * @description 코칭 문구. 오류 단어만
             * @example 'th'가 'ss'처럼 들렸어요. 혀끝을 윗니와 아랫니 사이에 살짝 내밀어 대고 바람을 내보내세요.
             */
            coachingText?: string;
        };
        ExpressionLearningFinishRequest: {
            /**
             * Format: int64
             * @description 프리톡 학습 세션 ID
             * @example 123
             */
            freeTalkSessionId?: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseMapStringObject: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: {
                [key: string]: unknown;
            };
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        TokenRefreshRequest: {
            refreshToken: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseTokenRefreshResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["TokenRefreshResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        TokenRefreshResponse: {
            tokenType?: string;
            accessToken?: string;
            /** Format: int64 */
            accessTokenExpiresIn?: number;
            refreshToken?: string;
            /** Format: int64 */
            refreshTokenExpiresIn?: number;
        };
        SocialLoginRequest: {
            provider: string;
            idToken: string;
            nonce?: string;
            nickname?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAuthTokenResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AuthTokenResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AuthTokenResponse: {
            tokenType: string;
            accessToken: string;
            /** Format: int64 */
            accessTokenExpiresIn: number;
            refreshToken: string;
            /** Format: int64 */
            refreshTokenExpiresIn: number;
            user: components["schemas"]["AuthUserResponse"];
        };
        AuthUserResponse: {
            /** Format: int64 */
            userId: number;
            nickname: string;
            email: string | null;
            provider: string;
            newUser: boolean;
            /** @enum {string} */
            role: "USER" | "ADMIN";
            /** @enum {string} */
            status: "ACTIVE" | "WITHDRAWN" | "BANNED";
        };
        LogoutRequest: {
            refreshToken: string;
            /** Format: uuid */
            installationId?: string;
        };
        AdminSubscriptionGrantRequest: {
            /** Format: uuid */
            requestId: string;
            /** @enum {string} */
            product: "MONTHLY" | "YEARLY" | "PASS_30000" | "PASS_50000" | "PASS_100000" | "PASS_200000";
            reason: string;
        };
        AdminSubscriptionGrantResponse: {
            /** Format: int64 */
            grantId?: number;
            /** @enum {string} */
            product?: "MONTHLY" | "YEARLY" | "PASS_30000" | "PASS_50000" | "PASS_100000" | "PASS_200000";
            productId?: string;
            /** Format: date-time */
            startsAt?: string;
            /** Format: date-time */
            expiresAt?: string;
            /** Format: date-time */
            revokedAt?: string;
            reason?: string;
            /** Format: int64 */
            grantedBy?: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminSubscriptionGrantResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminSubscriptionGrantResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        ReferralRetryRequest: {
            reason: string;
        };
        AdminPushCampaignRequest: {
            title: string;
            body: string;
            deepLink: string;
            /**
             * @default ALL
             * @enum {string}
             */
            audienceType: "ALL" | "SELECTED";
            userProfileIds?: number[];
            audienceSql?: string;
            excludedUserProfileIds?: number[];
        };
        AdminPushCampaignView: {
            /** Format: uuid */
            id?: string;
            title?: string;
            body?: string;
            deepLink?: string;
            /** Format: int64 */
            createdBy?: number;
            status?: string;
            /** Format: int64 */
            targetUserCount?: number;
            /** Format: int64 */
            targetTokenCount?: number;
            /** Format: int64 */
            pendingCount?: number;
            /** Format: int64 */
            succeededCount?: number;
            /** Format: int64 */
            failedCount?: number;
            /** Format: int64 */
            excludedCount?: number;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            completedAt?: string;
            /** @enum {string} */
            audienceType?: "ALL" | "SELECTED";
            userProfileIds?: number[];
            audienceSql?: string;
            excludedUserProfileIds?: number[];
            /** Format: date-time */
            scheduledAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminPushCampaignView: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminPushCampaignView"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminPushScheduleRequest: {
            /**
             * Format: date-time
             * @example 2026-09-10T19:00:00+09:00
             */
            scheduledAt: string;
        };
        AdminPushAudienceQueryRequest: {
            sql: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseListLong: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: number[];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminPopupCreateRequest: {
            title: string;
            imageUrl: string;
            linkUrl?: string | null;
            enabled: boolean;
            /**
             * Format: date-time
             * @description 시간대가 포함된 시작 시각
             * @example 2026-10-22T09:00:00+09:00
             */
            startsAt: string;
            /**
             * Format: date-time
             * @description 시간대가 포함된 종료 시각
             * @example 2026-10-29T09:00:00+09:00
             */
            endsAt: string;
            /** Format: int32 */
            priority: number;
            /** @description 숨길 활성 사용자 ID, 최대 1000명. 생략하면 숨김 없음 */
            excludedUserIds?: number[];
            /** @description 숨길 구독 유형. 조회 시점에 판단하며 개별 사용자 숨김과 OR로 적용 */
            excludedAudiences?: ("MONTHLY" | "YEARLY" | "PASS_100_DAYS" | "TRIAL" | "NONE" | "ADMIN_GRANTED" | "OTHER")[];
        };
        AdminPopupResponse: {
            /** Format: int64 */
            popupId: number;
            title: string;
            imageUrl: string;
            linkUrl: string | null;
            enabled: boolean;
            /** Format: date-time */
            startsAt: string;
            /** Format: date-time */
            endsAt: string;
            /** Format: int32 */
            priority: number;
            /** Format: date-time */
            updatedAt: string;
            excludedUserIds: number[];
            excludedAudiences: ("MONTHLY" | "YEARLY" | "PASS_100_DAYS" | "TRIAL" | "NONE" | "ADMIN_GRANTED" | "OTHER")[];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminPopupResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminPopupResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminEmailTestRequest: {
            /** Format: email */
            recipient: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseNotificationJobView: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["NotificationJobView"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        NotificationJobView: {
            /** Format: uuid */
            id?: string;
            status?: string;
            resultCode?: string;
            providerMessageId?: string;
        };
        /** @description 편지함 어드민 일괄 답장 요청 */
        AdminMailboxReplyRequest: {
            /** @description 피드백 ID 목록 */
            feedbackIds: number[];
            /** @description 답장 제목 */
            title: string;
            /** @description 답장 본문 */
            bodyText: string;
        };
        /** @description 편지함 어드민 일괄 답장 결과 */
        AdminMailboxReplyResponse: {
            /** Format: int64 */
            letterId?: number;
            /** Format: int32 */
            recipientCount?: number;
            /** Format: int32 */
            completedFeedbackCount?: number;
            representativeFeedbackIds?: number[];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminMailboxReplyResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminMailboxReplyResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 편지함 어드민 공지·업데이트 생성 요청 */
        AdminMailboxLetterCreateRequest: {
            /**
             * @description 편지 유형
             * @example NOTICE
             * @enum {string}
             */
            type: "NOTICE" | "UPDATE" | "REPLY" | "DIRECT";
            /** @description 편지 제목 */
            title: string;
            /** @description 구조화된 본문 블록 */
            contentBlocks: unknown[];
            /** @description 목록 미리보기 */
            preview: string;
            /** @description 숨길 사용자 ID. 빈 배열은 숨김 해제 */
            excludedUserIds?: number[];
            /** @description 숨길 구독 유형. 빈 배열은 숨김 해제 */
            excludedAudiences?: ("MONTHLY" | "YEARLY" | "PASS_100_DAYS" | "TRIAL" | "NONE" | "ADMIN_GRANTED" | "OTHER")[];
            /**
             * @description 기본 콘텐츠 언어. 생성 시 기본값 ko, 수정 시 생략하면 유지
             * @example ko
             * @enum {string}
             */
            locale?: "ko" | "ja";
            /** @description 기본 언어 외 추가 콘텐츠. 생략하면 유지, 빈 배열은 제거. 기본 언어와 중복 불가 */
            translations?: components["schemas"]["AdminMailboxLetterTranslation"][];
        };
        /** @description 기본 언어와 함께 게시할 추가 언어 콘텐츠 */
        AdminMailboxLetterTranslation: {
            /**
             * @description 추가 언어
             * @example ja
             * @enum {string}
             */
            locale: "ko" | "ja";
            title: string;
            contentBlocks: unknown[];
            preview: string;
        };
        /** @description 편지함 어드민 공지·업데이트 응답 */
        AdminMailboxLetterResponse: {
            /** Format: int64 */
            letterId?: number;
            /** @enum {string} */
            type?: "NOTICE" | "UPDATE" | "REPLY" | "DIRECT";
            title?: string;
            /** @description 구조화된 본문 블록 */
            contentBlocks?: unknown[];
            preview?: string;
            /** @enum {string} */
            publicationStatus?: "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
            pinned?: boolean;
            /** Format: date-time */
            publishedAt?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            excludedUserIds?: number[];
            excludedAudiences?: ("MONTHLY" | "YEARLY" | "PASS_100_DAYS" | "TRIAL" | "NONE" | "ADMIN_GRANTED" | "OTHER")[];
            /** @enum {string} */
            locale?: "ko" | "ja";
            translations?: components["schemas"]["AdminMailboxLetterTranslation"][];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminMailboxLetterResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminMailboxLetterResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 특정 사용자에게 직접 발송할 편지 요청 */
        AdminMailboxDirectLetterRequest: {
            /** @description 활성 수신자 ID 1~100개. 중복 불가 */
            userProfileIds: number[];
            /** @description 편지 제목 */
            title: string;
            /** @description 일반 텍스트 본문 */
            bodyText: string;
        };
        /** @description 직접 편지 발송 결과 */
        AdminMailboxDirectLetterResponse: {
            /**
             * Format: int64
             * @description 편지 ID
             */
            letterId?: number;
            /**
             * Format: int32
             * @description 수신자 수
             */
            recipientCount?: number;
            /**
             * Format: date-time
             * @description 발송 시각
             */
            sentAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminMailboxDirectLetterResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminMailboxDirectLetterResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 관리자 발음 평가 자산 일괄 임포트 결과 */
        AdminPronunciationAssetImportResult: {
            /**
             * Format: int32
             * @description 새로 삽입된 자산 수
             * @example 80
             */
            inserted?: number;
            /**
             * Format: int32
             * @description 기존 자산이 갱신된 수
             * @example 18
             */
            updated?: number;
            /** @description 실패한 자산 목록 */
            failures?: components["schemas"]["Failure"][];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminPronunciationAssetImportResult: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminPronunciationAssetImportResult"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 임포트 실패 자산 1건 */
        Failure: {
            /**
             * Format: int64
             * @description Writing 표현 ID
             * @example 9999
             */
            expressionId?: number;
            /**
             * @description 억양 locale
             * @example EN_US
             * @enum {string}
             */
            accentLocale?: "EN_US" | "EN_AU" | "EN_GB";
            /**
             * @description 실패 사유
             * @example 존재하지 않는 표현입니다.
             */
            reason?: string;
        };
        /** @description 제작 규칙 등록 요청 */
        AdminContentRuleCreateRequest: {
            /** @enum {string} */
            scope: "COMMON" | "LINEUP" | "QUESTION" | "EXPRESSION" | "STAR_MESSAGE" | "REVIEW" | "IMAGE";
            /** @example 질문에 이미 나온 말을 표현으로 뽑지 않는다. */
            ruleText: string;
            /**
             * Format: int64
             * @example 40
             */
            sourceCommentId?: number;
        };
        AdminContentRuleResponse: {
            /** Format: int64 */
            ruleId: number;
            ruleCode: string;
            /** @enum {string} */
            scope: "COMMON" | "LINEUP" | "QUESTION" | "EXPRESSION" | "STAR_MESSAGE" | "REVIEW" | "IMAGE";
            ruleText: string;
            /** Format: int64 */
            sourceCommentId: number | null;
            /** @enum {string} */
            status: "ACTIVE" | "RETIRED";
            /** Format: date-time */
            createdAt: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminContentRuleResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminContentRuleResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 관리자 콘텐츠 이미지 업로드 URL 발급 요청 */
        AdminContentImagePresignRequest: {
            /**
             * @description 원본 파일명
             * @example notice-image.webp
             */
            fileName: string;
            /**
             * @description 이미지 MIME type
             * @example image/webp
             */
            contentType: string;
            /**
             * Format: int64
             * @description 파일 크기(byte)
             * @example 1842030
             */
            fileSize?: number;
        };
        /** @description 관리자 콘텐츠 이미지 업로드 URL 발급 응답 */
        AdminContentImagePresignResponse: {
            uploadUrl?: string;
            method?: string;
            headers?: {
                [key: string]: string;
            };
            objectKey?: string;
            imageUrl?: string;
            /** Format: date-time */
            expiresAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminContentImagePresignResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminContentImagePresignResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 관리자 콘텐츠 제작 배치 생성 요청 */
        AdminContentBatchCreateRequest: {
            /**
             * Format: int32
             * @description 만들 Day 수
             * @example 10
             */
            dayCount?: number;
            characterRatio: components["schemas"]["AdminContentCharacterRatioRequest"];
            /**
             * @description 프롬프트에 넣을 메모
             * @example 찡찡대는 주제는 1개까지
             */
            note?: string;
            /**
             * @description 라인업 확인 없이 바로 Day 생성
             * @example false
             */
            autoProceed?: boolean;
        };
        /** @description 캐릭터별 Day 수. 합은 dayCount와 같아야 한다. */
        AdminContentCharacterRatioRequest: {
            /**
             * Format: int32
             * @example 4
             */
            chloe?: number;
            /**
             * Format: int32
             * @example 3
             */
            marco?: number;
            /**
             * Format: int32
             * @example 3
             */
            teddy?: number;
        };
        /** @description 라인업 재생성 요청 */
        AdminContentLineupRegenerateRequest: {
            /** @example 직장 장면이 너무 많다. 친구 장면을 2개 늘려 줘. */
            comment: string;
        };
        /** @description Day 재생성 요청 */
        AdminContentDraftRegenerateRequest: {
            /** @example EXPRESSIONS:LEVEL_2_TO_3 */
            scope: string;
        };
        /** @description 에셋 재생성 요청 */
        AdminContentAssetRegenerateRequest: {
            /** @example EXPRESSION_IMAGE:8761:REPRESENTATIVE */
            target: string;
            /** @example 배경을 사무실로 */
            note?: string;
        };
        AdminPopupPatchRequest: {
            title?: string;
            imageUrl?: string;
            enabled?: boolean;
            /** Format: date-time */
            startsAt?: string;
            /** Format: date-time */
            endsAt?: string;
            /** Format: int32 */
            priority?: number;
            /** @description 숨길 사용자 ID, 최대 1000명. 생략하면 유지, 빈 배열이면 전체 해제 */
            excludedUserIds?: number[];
            /** @description 숨길 구독 유형. 생략하면 유지, 빈 배열이면 전체 해제 */
            excludedAudiences?: ("MONTHLY" | "YEARLY" | "PASS_100_DAYS" | "TRIAL" | "NONE" | "ADMIN_GRANTED" | "OTHER")[];
            /** @description 생략하면 유지, null이면 링크 제거 */
            linkUrl?: string | null;
        };
        /** @description 편지함 어드민 공지·업데이트 수정 요청 */
        AdminMailboxLetterPatchRequest: {
            /**
             * @description 편지 유형
             * @enum {string}
             */
            type?: "NOTICE" | "UPDATE" | "REPLY" | "DIRECT";
            /** @description 편지 제목 */
            title?: string;
            /** @description 구조화된 본문 블록 */
            contentBlocks?: unknown[];
            /** @description 목록 미리보기 */
            preview?: string;
            /**
             * @description 게시 상태
             * @enum {string}
             */
            publicationStatus?: "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
            /** @description 상단 고정 여부 */
            pinned?: boolean;
            /** @description 숨길 사용자 ID. 빈 배열은 숨김 해제 */
            excludedUserIds?: number[];
            /** @description 숨길 구독 유형. 빈 배열은 숨김 해제 */
            excludedAudiences?: ("MONTHLY" | "YEARLY" | "PASS_100_DAYS" | "TRIAL" | "NONE" | "ADMIN_GRANTED" | "OTHER")[];
            /**
             * @description 기본 콘텐츠 언어. 생성 시 기본값 ko, 수정 시 생략하면 유지
             * @example ko
             * @enum {string}
             */
            locale?: "ko" | "ja";
            /** @description 기본 언어 외 추가 콘텐츠. 생략하면 유지, 빈 배열은 제거. 기본 언어와 중복 불가 */
            translations?: components["schemas"]["AdminMailboxLetterTranslation"][];
        };
        /** @description 제작 규칙 상태 변경 요청 */
        AdminContentRuleStatusRequest: {
            /**
             * @example RETIRED
             * @enum {string}
             */
            status: "ACTIVE" | "RETIRED";
        };
        AdminAppVersionUpdateRequest: {
            versionName: string;
            /** Format: int64 */
            buildNumber?: number;
            minimumSupportedVersionName: string;
            forceUpdateReason?: string;
            softUpdateReason?: string;
            releaseNote?: string;
            /** Format: date-time */
            releasedAt: string;
        };
        AdminAppVersionResponse: {
            /** Format: int64 */
            appVersionId: number;
            /** @enum {string} */
            platform: "IOS" | "ANDROID";
            versionName: string;
            /** Format: int64 */
            buildNumber: number;
            minimumSupportedVersionName: string;
            forceUpdateReason: string | null;
            softUpdateReason: string | null;
            releaseNote: string | null;
            active: boolean;
            /** Format: date-time */
            releasedAt: string | null;
            /** Format: date-time */
            updatedAt: string;
            updatedBy: string | null;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminAppVersionResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminAppVersionResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseSessionInnerThoughtResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["SessionInnerThoughtResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 사용자 메시지 속마음 조회 응답 */
        SessionInnerThoughtResponse: {
            /**
             * @description 속마음 처리 상태. 종료 의사 감지 뒤 속마음 생성을 시작하지 않은 경우 null
             * @enum {string}
             */
            processingStatus?: "PREPARING" | "COMPLETED" | "FAILED";
            /** @description 상대 역할의 속마음. COMPLETED에서만 제공 */
            innerThought?: string;
            /** @description 속마음 유형. COMPLETED에서만 제공 */
            innerThoughtType?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseSessionLevelAssessmentResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["SessionLevelAssessmentResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseScenarioListResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ScenarioListResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 시나리오 카테고리 응답 */
        CategoryResponse: {
            /**
             * Format: int64
             * @description 카테고리 ID
             */
            categoryId?: number;
            /** @description 카테고리 이름 */
            categoryName?: string;
            /**
             * Format: int32
             * @description 카테고리 노출 순서
             */
            displayOrder?: number;
            /** @description 카테고리 잠금 여부 */
            categoryLocked?: boolean;
            /** @description 카테고리 잠금 사유 */
            categoryLockReason?: string;
            /** @description 카테고리에 속한 시나리오 목록 */
            scenarios?: components["schemas"]["ScenarioResponse"][];
        };
        /** @description 시작 메시지 미리보기 응답 */
        OpeningPreviewResponse: {
            /** @description AI first 시 첫 AI 메시지 */
            aiOpeningMessage?: string;
            /** @description 첫 AI 메시지 번역 */
            aiOpeningMessageTranslation?: string;
            /** @description 첫 질문의 답변 가이드. 없으면 null */
            answerGuide?: components["schemas"]["AnswerGuide"];
            /** @description USER first 시 사용자 시작 안내 */
            userOpeningInstruction?: string;
            /** @description 첫 화면에 보여줄 상대 역할의 속마음 */
            innerThought?: string;
            /** @description 속마음 유형 */
            innerThoughtType?: string;
            /** @description 시나리오 캐릭터 정보 */
            character?: components["schemas"]["ConversationCharacterResponse"];
        };
        /** @description 시나리오 전체 조회 응답 */
        ScenarioListResponse: {
            /** @description 카테고리별 시나리오 목록 */
            categories?: components["schemas"]["CategoryResponse"][];
        };
        /** @description 시나리오 응답 */
        ScenarioResponse: {
            /**
             * Format: int64
             * @description 시나리오 ID
             */
            scenarioId?: number;
            /** @description 완료한 시나리오의 별점 */
            starRating?: number;
            /**
             * Format: int32
             * @description 전체 시나리오 노출 순서 (40일 커리큘럼의 Day 번호)
             */
            displayOrder?: number;
            /** @description 시나리오 제목 */
            scenarioTitle?: string;
            /** @description 시나리오 설명 */
            briefing?: string;
            /** @description 대화 목표 */
            conversationGoal?: string;
            /** @description 난이도 */
            difficulty?: string;
            /** @description 첫 발화자 */
            firstSpeaker?: string;
            /** @description 시나리오 썸네일 URL */
            thumbnailUrl?: string;
            /**
             * @description 사용자별 시나리오 접근 상태
             * @enum {string}
             */
            availabilityStatus?: "CLEARED" | "TODAY" | "LOCKED";
            /**
             * @description 오늘 시나리오의 신규·재도전 구분
             * @enum {string}
             */
            dailyScenarioType?: "NEW" | "RETRY" | "CLEARED";
            /** @description 사용자 시나리오 완료 여부 */
            completed?: boolean;
            /** @description 시나리오 잠금 여부 */
            locked?: boolean;
            /** @description 시나리오 잠금 사유 */
            lockReason?: string;
            /** @description 잠기지 않은 시나리오의 시작 메시지 미리보기 */
            openingPreview?: components["schemas"]["OpeningPreviewResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseScenarioHistoryResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ScenarioHistoryResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        ScenarioHistoryMessage: {
            /** Format: int64 */
            messageId?: number;
            /** Format: int32 */
            messageSequence?: number;
            /** Format: int32 */
            turnNumber?: number;
            /** @enum {string} */
            role?: "AI" | "USER";
            content?: string;
            translatedContent?: string;
            innerThought?: string;
            /** @enum {string} */
            innerThoughtType?: "GOOD" | "NORMAL" | "BAD";
            /** @enum {string} */
            innerThoughtProcessingStatus?: "PREPARING" | "COMPLETED" | "FAILED";
        };
        ScenarioHistoryResponse: {
            /** Format: int64 */
            scenarioId?: number;
            sessions?: components["schemas"]["ScenarioHistorySession"][];
        };
        ScenarioHistorySession: {
            /** Format: int64 */
            sessionId?: number;
            /** Format: date-time */
            startedAt?: string;
            /** Format: date-time */
            endedAt?: string;
            messages?: components["schemas"]["ScenarioHistoryMessage"][];
            /** @description 저장된 완료 피드백. 아직 없거나 미완료이면 null이며 조회 시 생성하지 않는다. */
            feedback?: components["schemas"]["SessionFeedbackResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseDailyScenarioResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["DailyScenarioResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 날짜별 시나리오 조회 응답 */
        DailyScenarioResponse: {
            /**
             * Format: date
             * @description 조회 날짜
             */
            date?: string;
            /** @description 시나리오 시작 또는 복습 가능 여부 */
            playable?: boolean;
            /** @description 날짜별 시나리오 정보 */
            scenario?: components["schemas"]["ScenarioResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseScenarioCalendarResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ScenarioCalendarResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 시나리오 캘린더 날짜 칸 응답 */
        CalendarDayResponse: {
            /**
             * Format: date
             * @description 해당 칸의 날짜
             */
            date?: string;
            /**
             * @description 해당 칸의 요일. "일"부터 "토"까지 한 글자
             * @example 목
             */
            dayOfWeek?: string;
            /** @description 그 날짜에 시나리오를 완료했는지 여부 */
            completed?: boolean;
            /**
             * Format: int64
             * @description 완료한 시나리오 ID. 미완료 오늘 칸은 배정된 시나리오 ID, 그 외에는 null
             */
            scenarioId?: number;
            /** @description 완료한 시나리오의 썸네일 URL. 미완료 칸은 null */
            thumbnailUrl?: string;
        };
        /** @description 시나리오 캘린더 조회 응답 */
        ScenarioCalendarResponse: {
            /**
             * @description 캘린더 조회 단위
             * @enum {string}
             */
            type?: "WEEK" | "MONTH";
            /**
             * Format: date
             * @description 창의 기준 날짜. 요청에서 생략했으면 오늘
             */
            date?: string;
            /**
             * @description 저장 언어별 헤더. 일본어 WEEK은 2026年7月 第5週, MONTH은 2026年7月
             * @example 26년 7월 5주차
             */
            label?: string;
            /**
             * Format: date
             * @description 서버 기준 오늘 날짜
             */
            today?: string;
            /**
             * Format: date
             * @description 사용자가 처음 시나리오를 완료한 날. 이력이 없으면 null
             */
            startedAt?: string;
            /** @description 창의 모든 칸. WEEK 7개, MONTH은 그 달 일수(28~31개), 날짜 오름차순 */
            days?: components["schemas"]["CalendarDayResponse"][];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponsePageReferralReward: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["PageReferralReward"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        PageReferralReward: {
            items?: components["schemas"]["ReferralReward"][];
            hasNext?: boolean;
        };
        ReferralReward: {
            /** Format: int64 */
            id?: number;
            /** Format: int64 */
            referralId?: number;
            /** Format: int64 */
            policyVersion?: number;
            /** Format: int64 */
            recipientId?: number;
            stage?: string;
            recipientRole?: string;
            /** Format: int64 */
            amountWon?: number;
            /** Format: int64 */
            creditedWon?: number;
            status?: string;
            reason?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseReferralPreview: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ReferralPreview"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        ReferralPreview: {
            code?: string;
            /** Format: int64 */
            policyVersion?: number;
            signup?: components["schemas"]["ReferralStage"];
            purchase?: components["schemas"]["ReferralStage"];
            purchaseProductNames?: string[];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseReferralSummary: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ReferralSummary"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        ReferralInviterLimitProgress: {
            /** @enum {string} */
            type?: "UNLIMITED" | "INVITE_COUNT" | "TOTAL_AMOUNT";
            /** Format: int64 */
            value?: number;
            /** Format: int64 */
            used?: number;
            /** Format: int64 */
            remaining?: number;
        };
        ReferralSummary: {
            code?: string;
            currentOffer?: components["schemas"]["ReferralPreview"];
            enrolledOffer?: components["schemas"]["ReferralPreview"];
            /** Format: int64 */
            invitedCount?: number;
            /** Format: int64 */
            convertedCount?: number;
            /** @enum {string} */
            registrationStatus?: "PENDING" | "REGISTERED" | "SKIPPED" | "UNAVAILABLE";
            /** Format: int64 */
            inviterCreditedWon?: number;
            inviterLimit?: components["schemas"]["ReferralInviterLimitProgress"];
        };
        /** @description 현재 표시할 팝업. 대상이 없으면 data는 null이다. */
        ActivePopupResponse: {
            /** Format: int64 */
            popupId: number;
            imageUrl: string;
            linkUrl: string | null;
        } | null;
        /** @description 공통 API 응답 객체 */
        ApiResponseActivePopupResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ActivePopupResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseUserSubscriptionResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["UserSubscriptionResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 사용자 구독 상태 */
        UserSubscriptionResponse: {
            /**
             * @description 구독 상태. NONE(구독 이력 없음), ACTIVE(구독 중), CANCELED(해지 예약, 만료 전까지 프리미엄 유지), EXPIRED(만료 또는 환불). 프리미엄 적용 여부는 premium으로 판단한다.
             * @example ACTIVE
             * @enum {string}
             */
            subscriptionStatus?: "NONE" | "ACTIVE" | "CANCELED" | "EXPIRED";
            /**
             * @description 프리미엄 혜택 적용 여부
             * @example true
             */
            premium?: boolean;
            /**
             * @description 무료 체험 중이면 true. periodType이 TRIAL일 때만 true이고 프리미엄이 꺼져 있으면 false. 체험 종료 시각은 expiresAt이며, 체험이 끝나면 스토어가 연간 요금을 결제한다. 대시보드 프로모션 권한(PROMOTIONAL)은 false
             * @example true
             */
            isTrial?: boolean;
            /**
             * @description 현재 결제 기간 종류. TRIAL(무료 체험), INTRO(할인 도입가), NORMAL(정가), PROMOTIONAL(프로모션 무료), PREPAID(선결제). 프리미엄이 꺼져 있으면 null
             * @example TRIAL
             * @enum {string}
             */
            periodType?: "TRIAL" | "INTRO" | "NORMAL" | "PROMOTIONAL" | "PREPAID";
            /**
             * Format: date-time
             * @description 구독 만료 시각. 갱신 결제 실패 유예 중이면 유예 종료 시각. 프리미엄이 꺼져 있으면 null
             * @example 2026-10-04T12:00:00
             */
            expiresAt?: string;
            /**
             * @description 유료 구독 도입 이후 시나리오 대화를 끝까지 완료한 적이 있으면 true. 신규 가입자는 시나리오 1 완료, 도입 전 가입자는 도입 후 오늘의 시나리오 완료가 기준이다. 도입 시점 미설정 또는 도입 전에는 항상 false.
             * @example false
             */
            conversationCompletedSinceLaunch?: boolean;
            /**
             * @description 구독 상품 ID. Play의 상품ID:베이스플랜ID 전체를 보존한다. 프리미엄이 꺼져 있으면 null
             * @example com.saynow.app.premium.yearly
             */
            productId?: string;
            /**
             * @description 결제한 스토어. APP_STORE, PLAY_STORE 등 RevenueCat store 값. 웹은 이 값으로 구독 관리 링크를 고른다. 프리미엄이 꺼져 있으면 null
             * @example APP_STORE
             * @enum {string}
             */
            store?: "APP_STORE" | "MAC_APP_STORE" | "PLAY_STORE" | "AMAZON" | "STRIPE" | "PROMOTIONAL" | "RC_BILLING" | "ROKU" | "PADDLE" | "TEST_STORE";
            /** @description 현재 계정에 페이월 표시와 서버 유료 제한을 적용하는지 */
            paymentEnabled?: boolean;
            /**
             * Format: int64
             * @description 공개 정책 버전
             */
            paymentPolicyVersion?: number;
            /** @description 배포 전환으로 새 학습 시작만 일시 중지됐는지 */
            newStartsPaused?: boolean;
            /** @description 새 시나리오 대화를 시작할 수 있는지. 시나리오 대화는 구독과 관계없이 허용하므로 배포 전환 중이 아니면 항상 true */
            canStartScenario?: boolean;
            /**
             * Format: int64
             * @description 유료 도입 후 무료 상태로 처음 시작한 첫 시나리오의 예약 세션. 24시간 내 같은 시나리오 재시작 시 이어간다
             */
            freeScenarioSessionId?: number;
            /** @description 항상 null. 할인 부여 중단 후 구버전 앱 호환용으로 필드만 유지 */
            promo?: components["schemas"]["DiscountOffer"];
            /**
             * @description 가장 최근 실제 결제 금액. 결제 이력이 없으면 null
             * @example 58500
             */
            price?: number;
            /**
             * @description 최근 실제 결제의 ISO 4217 통화. 없으면 null
             * @example KRW
             */
            currency?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseListSubscriptionEventResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["SubscriptionEventResponse"][];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 구독 결제 이력 */
        SubscriptionEventResponse: {
            /**
             * @description RevenueCat 이벤트 ID. 중복 웹훅 방지 키
             * @example d3f1a2b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b
             */
            eventId?: string;
            /**
             * @description 이벤트 타입. INITIAL_PURCHASE(첫 결제 또는 체험 시작), RENEWAL(갱신, 체험 끝 첫 결제 포함), CANCELLATION(해지 예약·환불), UNCANCELLATION(해지 취소), EXPIRATION(만료), BILLING_ISSUE(갱신 결제 실패, 유예 기간 중 프리미엄 유지), PRODUCT_CHANGE(플랜 변경), SUBSCRIPTION_EXTENDED(과금 없는 기간 연장), NON_RENEWING_PURCHASE(대시보드 프로모션 권한 부여 등 자동 갱신 없는 구매), TRANSFER(다른 계정에서 구독을 넘겨받음)
             * @example RENEWAL
             * @enum {string}
             */
            type?: "INITIAL_PURCHASE" | "RENEWAL" | "CANCELLATION" | "UNCANCELLATION" | "EXPIRATION" | "BILLING_ISSUE" | "SUBSCRIPTION_EXTENDED" | "PRODUCT_CHANGE" | "NON_RENEWING_PURCHASE" | "TRANSFER";
            /**
             * @description 구독 상품 ID
             * @example com.saynow.app.premium.yearly
             */
            productId?: string;
            /**
             * @description 결제 기간 종류. TRIAL, INTRO, NORMAL, PROMOTIONAL, PREPAID. 알 수 없으면 null
             * @example NORMAL
             * @enum {string}
             */
            periodType?: "TRIAL" | "INTRO" | "NORMAL" | "PROMOTIONAL" | "PREPAID";
            /**
             * @description 결제 통화 기준 금액. 체험·프로모션·해지 등 결제 없는 이벤트는 0
             * @example 58500
             */
            price?: number;
            /**
             * @description ISO 4217 통화 코드. 없으면 null
             * @example KRW
             */
            currency?: string;
            /**
             * @description 결제한 스토어. APP_STORE, PLAY_STORE 등. 알 수 없으면 null
             * @example APP_STORE
             * @enum {string}
             */
            store?: "APP_STORE" | "MAC_APP_STORE" | "PLAY_STORE" | "AMAZON" | "STRIPE" | "PROMOTIONAL" | "RC_BILLING" | "ROKU" | "PADDLE" | "TEST_STORE";
            /**
             * @description SANDBOX(테스트 결제) 또는 PRODUCTION(실제 결제)
             * @example PRODUCTION
             */
            environment?: string;
            /**
             * @description 해지 사유. 환불이면 CUSTOMER_SUPPORT, 갱신 결제 실패 재시도 중이면 BILLING_ERROR(구독 상태 유지). CANCELLATION 외에는 null
             * @example UNSUBSCRIBE
             */
            cancelReason?: string;
            /**
             * Format: date-time
             * @description 결제 또는 이벤트 발생 시각
             * @example 2026-09-10T03:12:00
             */
            occurredAt?: string;
            /**
             * Format: date-time
             * @description 구독 만료 시각. 없으면 null
             * @example 2027-09-10T03:12:00
             */
            expiresAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseCurrentStreakResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["CurrentStreakResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        CurrentStreakResponse: {
            /** Format: int32 */
            currentStreakDays?: number;
            activeToday?: boolean;
            /** Format: date */
            today?: string;
            rewardSummary?: components["schemas"]["RewardCalendarSummary"];
        };
        /** @description 현재 도전과 이전 만기 회차의 환급 예정액 */
        RewardCalendarSummary: {
            availability?: string;
            reason?: string;
            currency?: string;
            /** Format: date-time */
            endsAt?: string;
            /** Format: int64 */
            currentCycleId?: number;
            /**
             * Format: int64
             * @description 현재 도전 잔액. 결제 미확정이면 null
             */
            currentBalanceWon?: number;
            /**
             * Format: int64
             * @description 이전 만기 회차에 보존된 환급 예정액. 실제 지급 완료 금액이 아님
             */
            pendingRefundWon?: number;
            /**
             * Format: int64
             * @description 남은 활동에서 추가로 적립 가능한 금액. 미완료로 지나간 날짜 제외. 미확정이면 null
             */
            remainingEarnableWon?: number;
            /**
             * Format: int32
             * @description 오늘 포함 미마감 KST 날짜 수. 결제 구간 미확정이면 null
             */
            remainingDays?: number;
            /** Format: int64 */
            todayEarnedWon?: number;
            /** Format: int64 */
            todayMaximumWon?: number;
            todayFullyAchieved?: boolean;
            activities?: components["schemas"]["RewardActivity"][];
            /** Format: date-time */
            computedAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseStreakCalendarResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["StreakCalendarResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 각 회차의 실제 인정 구간과 시나리오 적립 */
        RewardCalendarCycleDay: {
            /** Format: int64 */
            cycleId?: number;
            eligibility?: string;
            /** Format: date-time */
            startsAt?: string;
            /** Format: date-time */
            endsAt?: string;
            /**
             * Format: int64
             * @description 해당 날짜에 받은 금액. 미완료일에도 보존. 미래·미확정은 null
             */
            earnedWon?: number;
            /** Format: int64 */
            maximumWon?: number;
            fullyAchieved?: boolean;
            activities?: components["schemas"]["RewardActivity"][];
        };
        /** @description 날짜별 시나리오 적립액 기록 */
        RewardCalendarDay: {
            /** Format: date */
            date?: string;
            /** @enum {string} */
            status?: "FULL" | "NONE" | "FUTURE" | "PENDING" | "NOT_ELIGIBLE";
            /**
             * Format: int64
             * @description 해당 날짜에 받은 금액. 미완료일에도 보존. 미래·미확정은 null
             */
            earnedWon?: number;
            /** Format: int64 */
            maximumWon?: number;
            cycles?: components["schemas"]["RewardCalendarCycleDay"][];
        };
        StreakCalendarResponse: {
            /** Format: int32 */
            year?: number;
            /** Format: int32 */
            month?: number;
            /** Format: date */
            today?: string;
            /** Format: int32 */
            currentStreakDays?: number;
            activeToday?: boolean;
            /** Format: date */
            firstActiveDate?: string;
            /** Format: int32 */
            longestStreakDays?: number;
            /** Format: int32 */
            totalActiveDays?: number;
            activeDates?: string[];
            rewardSummary?: components["schemas"]["RewardCalendarSummary"];
            rewardDays?: components["schemas"]["RewardCalendarDay"][];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseRewardView: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["RewardView"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        Cycle: {
            /** Format: int64 */
            id?: number;
            productId?: string;
            /** Format: date-time */
            startsAt?: string;
            /** Format: date-time */
            endsAt?: string;
            /** Format: int64 */
            maximumWon?: number;
            /** Format: int32 */
            eligibleDays?: number;
            /** Format: int64 */
            balanceWon?: number;
            phase?: string;
            eligibility?: string;
            reviewReason?: string;
            days?: components["schemas"]["Day"][];
            policyVersion?: string;
        };
        Day: {
            /** Format: date */
            date?: string;
            /** Format: date-time */
            startsAt?: string;
            /** Format: date-time */
            endsAt?: string;
            achieved?: boolean;
            closed?: boolean;
            /** Format: int64 */
            changeWon?: number;
            /** Format: int64 */
            balanceWon?: number;
            /** Format: int64 */
            earnedWon?: number;
            /** Format: int64 */
            maximumWon?: number;
            fullyAchieved?: boolean;
            activities?: components["schemas"]["RewardActivity"][];
        };
        /** @description 무료 학습의 표시용 금액. 결제 후에도 출금액이나 유료 적립금으로 전환되지 않는다 */
        RewardPreview: {
            /** Format: int64 */
            balanceWon?: number;
            /** Format: int64 */
            completedDays?: number;
            /** Format: int64 */
            todayEarnedWon?: number;
            /** Format: int64 */
            dailyAmountWon?: number;
            accruing?: boolean;
        };
        RewardToday: {
            /** Format: date */
            date?: string;
            /** Format: int64 */
            earnedWon?: number;
            /** Format: int64 */
            maximumWon?: number;
            fullyAchieved?: boolean;
            activities?: components["schemas"]["RewardActivity"][];
        };
        RewardView: {
            availability?: string;
            reason?: string;
            currency?: string;
            /** Format: int64 */
            todayMaximumWon?: number;
            todayAchieved?: boolean;
            /** Format: date-time */
            computedAt?: string;
            current?: components["schemas"]["Cycle"];
            /** Format: int64 */
            pendingRefundWon?: number;
            /**
             * @description 현재 적립 회차 우선. 없으면 검토, 결제 대기, 만기 이력, 비대상 순으로 판정
             * @enum {string}
             */
            state?: "ACTIVE" | "ENDED" | "PENDING" | "REVIEW" | "NONE";
            /** Format: int64 */
            heldRefundWon?: number;
            today?: components["schemas"]["RewardToday"];
            /** Format: int32 */
            remainingDays?: number;
            /**
             * Format: int64
             * @description 만료 이후 운영 결제의 출금 가능한 적립액. 샌드박스 제외, 실제 지급과 출금 신청은 별도 기능
             */
            withdrawableWon?: number;
            /** @description 출금 가능한 금액이 0원보다 크면 true */
            withdrawalAvailable?: boolean;
            /** @description 현재 챌린지가 없고 설정·결제 검토 문제가 없으면 true */
            purchaseAvailable?: boolean;
            /**
             * Format: date-time
             * @description 진행 중 챌린지가 끝나는 시각. 이후 다시 구매할 수 있음
             */
            purchaseAvailableAt?: string;
            /** @description 결제했으면 받을 수 있었던 표시용 금액. 출금·환급액에 포함되지 않으며 결제 후에도 전환되지 않음 */
            preview?: components["schemas"]["RewardPreview"];
            /**
             * Format: int64
             * @description 학습과 레퍼럴의 통합 적립액. 구매 전에도 보존되며 본인 100일 챌린지 만기 후 환급 가능. 무료 학습 preview 제외
             */
            balanceWon?: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseRewardPreviewHistoryPage: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["RewardPreviewHistoryPage"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        RewardPreviewHistoryItem: {
            /** Format: date */
            date?: string;
            /** Format: int64 */
            amountWon?: number;
        };
        RewardPreviewHistoryPage: {
            items?: components["schemas"]["RewardPreviewHistoryItem"][];
            nextCursor?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseRewardHistoryPage: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["RewardHistoryPage"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        RewardHistoryItem: {
            id?: string;
            type?: string;
            activityType?: string;
            /**
             * Format: date
             * @description 시나리오 학습 인정 날짜. 실제 완료 시각의 날짜와 다를 수 있음
             */
            date?: string;
            /** Format: date-time */
            occurredAt?: string;
            /** Format: int64 */
            amountWon?: number;
            /** Format: int64 */
            balanceWon?: number;
            /** Format: int64 */
            cycleId?: number;
            /** Format: int64 */
            completionId?: number;
        };
        RewardHistoryPage: {
            items?: components["schemas"]["RewardHistoryItem"][];
            nextCursor?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponsePage: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["Page"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        Page: {
            cycles?: components["schemas"]["Cycle"][];
            /** Format: int64 */
            nextCursor?: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseCycle: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["Cycle"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseRewardCompletion: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["RewardCompletion"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseUserLearningLevelResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["UserLearningLevelResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        UserLearningLevelResponse: {
            /**
             * Format: int32
             * @description 현재 적용 학습 수준. 신규 사용자 기본값 3. 평가 확정 여부와 별개
             */
            learningLevel: number | null;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseUserAccentLocaleResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["UserAccentLocaleResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 사용자 현재 영어 억양 */
        UserAccentLocaleResponse: {
            /**
             * @description 현재 억양 코드
             * @example EN_US
             * @enum {string}
             */
            accentLocale?: "EN_US" | "EN_AU" | "EN_GB";
            /**
             * @description 나라 이름
             * @example 미국
             */
            name?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseMailboxUnreadCountResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["MailboxUnreadCountResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 편지함 안 읽은 편지 개수 응답 */
        MailboxUnreadCountResponse: {
            /**
             * Format: int64
             * @description 안 읽은 편지 개수
             * @example 3
             */
            unreadCount?: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseMailboxSentFeedbackListResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["MailboxSentFeedbackListResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 보낸 편지함 피드백 목록 응답 */
        MailboxSentFeedbackListResponse: {
            /** @description 피드백 요약 목록 */
            items?: components["schemas"]["Item"][];
            /** @description 다음 페이지 커서. 없으면 null */
            nextCursor?: string;
            /** @description 다음 페이지 존재 여부 */
            hasNext?: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseMailboxSentFeedbackDetailResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["MailboxSentFeedbackDetailResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        MailboxFeedbackAttachmentResponse: {
            /** Format: int64 */
            attachmentId?: number;
            contentType?: string;
            /** Format: int64 */
            fileSize?: number;
            /** @description Bearer 인증을 붙여 이미지 바이트를 조회할 API 상대 경로 */
            downloadUrl?: string;
        };
        /** @description 보낸 편지함 피드백 상세 응답 */
        MailboxSentFeedbackDetailResponse: {
            /**
             * Format: int64
             * @description 피드백 ID
             * @example 101
             */
            feedbackId?: number;
            /**
             * @description 피드백 유형
             * @example QUESTION
             * @enum {string}
             */
            type?: "BUG_REPORT" | "FEATURE_REQUEST" | "QUESTION" | "CHEER";
            /**
             * @description 피드백 유형 표시 제목
             * @example 문의
             */
            title?: string;
            /** @description 피드백 내용 */
            content?: string;
            /**
             * @description 피드백 처리 상태
             * @example PENDING
             * @enum {string}
             */
            status?: "PENDING" | "COMPLETED";
            /**
             * Format: int64
             * @description 대표 피드백 ID. 없으면 null
             */
            resolvedByFeedbackId?: number;
            /**
             * Format: date-time
             * @description 등록 시각
             */
            createdAt?: string;
            /**
             * Format: date-time
             * @description 수정 시각
             */
            updatedAt?: string;
            /** @description 연결된 답장 목록 */
            replies?: components["schemas"]["Reply"][];
            /** @description 첨부 이미지 목록 */
            attachments?: components["schemas"]["MailboxFeedbackAttachmentResponse"][];
        };
        Reply: {
            /**
             * Format: int64
             * @description 답장 편지 ID
             * @example 201
             */
            letterId?: number;
            /** @description 답장 제목 */
            title?: string;
            /** @description 답장 본문 */
            bodyText?: string;
            /**
             * Format: date-time
             * @description 답장 발송 시각
             */
            sentAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseMailboxReceivedListResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["MailboxReceivedListResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 받은 편지함 목록 응답 */
        MailboxReceivedListResponse: {
            /** @description 받은 편지 요약 목록 */
            items?: components["schemas"]["Item"][];
            /** @description 다음 페이지 커서. 없으면 null */
            nextCursor?: string;
            /** @description 다음 페이지 존재 여부 */
            hasNext?: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseMailboxReceivedDetailResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["MailboxReceivedDetailResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 받은 편지함 상세 응답 */
        MailboxReceivedDetailResponse: {
            /**
             * Format: int64
             * @description 편지 ID
             * @example 101
             */
            letterId?: number;
            /**
             * @description 편지 유형
             * @example NOTICE
             * @enum {string}
             */
            letterType?: "NOTICE" | "UPDATE" | "REPLY" | "DIRECT";
            /** @description 편지 제목 */
            title?: string;
            /** @description 구조화된 공지·업데이트 본문. 답장·직접 편지는 null */
            contentBlocks?: unknown[];
            /** @description 답장·직접 편지 본문. 공지·업데이트는 null */
            bodyText?: string;
            /**
             * @description 답장과 연결된 원본 피드백 유형. 답장이 아니면 null
             * @enum {string}
             */
            feedbackType?: "BUG_REPORT" | "FEATURE_REQUEST" | "QUESTION" | "CHEER";
            /** @description 답장과 연결된 원본 피드백 내용. 답장이 아니면 null */
            quotedFeedbackContent?: string;
            /** @description 상단 고정 여부 */
            pinned?: boolean;
            /**
             * Format: date-time
             * @description 편지 발송 시각
             */
            sentAt?: string;
            /**
             * Format: date-time
             * @description 읽은 시각
             */
            readAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseFreeTalkMainResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["FreeTalkMainResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        FreeTalkMainResponse: {
            topics?: components["schemas"]["FreeTalkTopicResponse"][];
            /** Format: int64 */
            dailySpeakingTimeLimitMs?: number;
            /** Format: int64 */
            usedSpeakingTimeMs?: number;
            /** Format: int64 */
            remainingSpeakingTimeMs?: number;
            canStart?: boolean;
        };
        /** @description 프리톡 추천 주제 */
        FreeTalkTopicResponse: {
            /**
             * Format: int64
             * @description 추천 주제 ID
             */
            topicId?: number;
            /** @description 화면 표시 주제명 */
            displayName?: string;
            /**
             * Format: int32
             * @description 이번 응답 안에서의 노출 순서(1부터). 요청마다 달라진다.
             */
            displayOrder?: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseFreeTalkSessionListResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["FreeTalkSessionListResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        FreeTalkSessionListResponse: {
            items?: components["schemas"]["Item"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            hasNext?: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseFreeTalkSessionDetailResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["FreeTalkSessionDetailResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        Correction: {
            originalSentence?: string;
            betterSentence?: string;
            reason?: string;
            /** @enum {string} */
            mistakePattern?: "TENSE" | "SUBJECT_VERB_AGREEMENT" | "VERB_FORM" | "ARTICLE" | "PLURAL" | "PRONOUN" | "PREPOSITION" | "NEGATION" | "QUESTION_FORM" | "WORD_ORDER" | "MISSING_WORD" | "REDUNDANCY" | "WORD_CHOICE" | "LITERAL_TRANSLATION" | "REGISTER" | "NATURALNESS" | "OTHER";
            memoryTag?: string;
        };
        Expression: {
            /** Format: int64 */
            expressionId?: number;
            /** Format: int32 */
            displayOrder?: number;
            targetExpressionText?: string;
            baseExpressionMeaningText?: string;
            completed?: boolean;
            /** Format: date-time */
            lastRecommendedAt?: string;
        };
        FreeTalkSessionDetailResponse: {
            /** Format: int64 */
            sessionId?: number;
            title?: string;
            characterId?: string;
            /** Format: date-time */
            startedAt?: string;
            /** Format: date-time */
            completedAt?: string;
            /** Format: int64 */
            userSpeakingDurationMs?: number;
            /** Format: int32 */
            correctionCount?: number;
            messages?: components["schemas"]["Message"][];
            /** @enum {string} */
            expressionGenerationStatus?: "PREPARING" | "READY" | "FAILED";
            /** @enum {string} */
            expressionLearningStatus?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
            expressions?: components["schemas"]["Expression"][];
        };
        Message: {
            /** Format: int64 */
            messageId?: number;
            /** Format: int32 */
            turnNumber?: number;
            /** Format: int32 */
            messageSequence?: number;
            role?: string;
            content?: string;
            translatedContent?: string;
            /** @enum {string} */
            emotion?: "NEUTRAL" | "HAPPY" | "SURPRISED" | "SAD" | "ANGRY";
            innerThought?: string;
            /** @enum {string} */
            innerThoughtType?: "GOOD" | "NORMAL" | "BAD";
            /** @enum {string} */
            correctionStatus?: "PREPARING" | "COMPLETED" | "FAILED";
            correction?: components["schemas"]["Correction"];
            reusedExpression?: components["schemas"]["ReusedExpression"];
        };
        ReusedExpression: {
            /** Format: int64 */
            expressionId?: number;
            text?: string;
            matchedText?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseFreeTalkSessionSummaryResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["FreeTalkSessionSummaryResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        Comparison: {
            /** Format: int64 */
            previousSessionId?: number;
            /** Format: date */
            previousDate?: string;
            current?: components["schemas"]["Metrics"];
            previous?: components["schemas"]["Metrics"];
        };
        FollowUp: {
            pending?: boolean;
            /** @enum {string} */
            triggerType?: "CUT_OFF" | "PAST_EVENT" | "CONCERN" | "GOAL" | "MOOD" | "HOBBY" | "NONE";
            question?: string;
            invite?: string;
        };
        FreeTalkSessionSummaryResponse: {
            /** Format: int64 */
            sessionId?: number;
            title?: string;
            pending?: boolean;
            firstSession?: boolean;
            headline?: components["schemas"]["Headline"];
            comparison?: components["schemas"]["Comparison"];
            growth?: components["schemas"]["Growth"];
            reusedExpressions?: components["schemas"]["ReusedExpressions"];
            followUp?: components["schemas"]["FollowUp"];
            /** Format: int32 */
            correctionCount?: number;
        };
        Growth: {
            /** @enum {string} */
            pattern?: "TENSE" | "SUBJECT_VERB_AGREEMENT" | "VERB_FORM" | "ARTICLE" | "PLURAL" | "PRONOUN" | "PREPOSITION" | "NEGATION" | "QUESTION_FORM" | "WORD_ORDER" | "MISSING_WORD" | "REDUNDANCY" | "WORD_CHOICE" | "LITERAL_TRANSLATION" | "REGISTER" | "NATURALNESS" | "OTHER";
            patternLabel?: string;
            succeeded?: boolean;
            /** Format: date */
            previousDate?: string;
            previousSentence?: string;
            previousWrongSpan?: string;
            currentSentence?: string;
            currentSpan?: string;
        };
        Headline: {
            text?: string;
            subline?: string;
            /** @enum {string} */
            pose?: "POINT" | "NORMAL" | "WAVE_SMILE";
        };
        Metrics: {
            /** Format: int64 */
            speakingMs?: number;
            /** Format: int32 */
            turnCount?: number;
            /** Format: int32 */
            maxWordsInTurn?: number;
        };
        ReusedExpressions: {
            pending?: boolean;
            items?: components["schemas"]["Item"][];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseListExpressionResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ExpressionResponse"][];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 시나리오별 Writing 표현 조회 응답 항목 */
        ExpressionResponse: {
            /**
             * Format: int64
             * @description 표현 고유 ID
             * @example 101
             */
            expressionId?: number;
            /**
             * Format: int32
             * @description 시나리오 안 표현 학습 순서 및 해금 순서
             * @example 1
             */
            displayOrder?: number;
            /**
             * @description 타겟 표현
             * @example There is nothing like
             */
            targetExpressionText?: string;
            /**
             * @description 타겟 표현 뜻(한글 해석)
             * @example ~만 한 게 없다
             */
            baseExpressionMeaningText?: string;
            /**
             * @description 일일 시나리오 정책 도입 이후 학습 완료 여부
             * @example true
             */
            completed?: boolean;
            /**
             * @description 잠김 여부(해금 전 상태)
             * @example false
             */
            locked?: boolean;
            /**
             * @description 무료 사용자가 결제 없이 학습할 수 있는 체험 표현 여부. 사용자당 1개만 true
             * @example false
             */
            freeTrial?: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseExpressionPracticeResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ExpressionPracticeResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 원어민 표현 추가 예문 조회 응답 */
        ExpressionPracticeResponse: {
            /**
             * @description 타겟 표현
             * @example blow my mind
             */
            targetExpressionText?: string;
            /**
             * @description 타겟 표현 뜻
             * @example 끝내주게 놀랍다
             */
            baseExpressionMeaningText?: string;
            /**
             * @description 표현 상세 설명
             * @example 강렬한 인상을 받았을 때 최고의 리액션이에요.
             */
            usageDescription?: string;
            /** @description 문제 안 풀고, 눈으로 익히는 추가 예문 2건 */
            practiceSentence?: components["schemas"]["PracticeSentenceResponse"][];
            /** @description 직접 푸는 작문 문제 2건. 한국어 콘텐츠는 영어·한국어 한 건씩, 일본어 콘텐츠는 영어 두 건이다 */
            writingSentence?: components["schemas"]["WritingSentenceResponse"][];
        };
        /** @description 추가 예문 항목 */
        PracticeSentenceResponse: {
            /**
             * @description 예문 텍스트
             * @example Her voice blows my mind every time.
             */
            sentenceText?: string;
            /**
             * @description 예문 중 강조 표시할 부분(타겟 표현이 활용된 구간)
             * @example blows my mind
             */
            highlightingPart?: string;
            /**
             * @description 예문 해석
             * @example 그녀 목소리는 들을 때마다 소름 돋아.
             */
            sentenceTranslation?: string;
            /**
             * @description 예문을 유도하는 연습 질문
             * @example What do you think of her singing?
             */
            practiceQuestion?: string;
            /**
             * @description 예문 이미지 URL. 없으면 null
             * @example https://cdn.landit.com/writing/examples/001.png
             */
            imageUrl?: string;
            /**
             * @description 연습 질문의 해석
             * @example 걔 노래 어때?
             */
            practiceQuestionTranslation?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseExpressionLearningResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["ExpressionLearningResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 원어민 표현 학습 시작 응답 */
        ExpressionLearningResponse: {
            /**
             * Format: int64
             * @description 표현 고유 ID
             * @example 101
             */
            expressionId?: number;
            /**
             * @description 타겟 표현
             * @example blow my mind
             */
            targetExpressionText?: string;
            /**
             * @description 타겟 표현 뜻
             * @example 끝내주게 놀랍다
             */
            baseExpressionMeaningText?: string;
            /**
             * @description 표현 상세 설명
             * @example blow my mind는 '끝내준다', '충격적으로 대단하다'는 뜻입니다.
             */
            usageDescription?: string;
            /**
             * @description 작문을 유도하는 대표 질문. 질문형 구성 불가 시 null
             * @example What should I definitely see in Korea?
             */
            representativeQuestionText?: string;
            /**
             * @description 대표 질문의 해석
             * @example 한국에서 뭘 꼭 봐야 해?
             */
            representativeQuestionTranslation?: string;
            /**
             * @description 대표 예문 텍스트
             * @example Gyeongbokgung Palace will blow your mind.
             */
            representativeSentenceText?: string;
            /**
             * @description 대표 예문의 해석
             * @example 경복궁은 널 완전 놀라게 할 거야.
             */
            representativeSentenceTranslation?: string;
            /**
             * @description 정답 예문을 단어 단위로 나눈 배열(정답 순서 유지)
             * @example [
             *       "Gyeongbokgung",
             *       "Palace",
             *       "will",
             *       "blow",
             *       "your",
             *       "mind"
             *     ]
             */
            representativeSentenceWords?: string[];
            /**
             * @description 정답 단어와 오답 단어를 섞은 선택지 배열(저장된 섞인 순서 그대로)
             * @example [
             *       "Gyeongbokgung",
             *       "blow",
             *       "will",
             *       "Palace",
             *       "amazing",
             *       "have",
             *       "get",
             *       "your",
             *       "mind"
             *     ]
             */
            representativeSentenceWordChoices?: string[];
            /**
             * @description 대표 예문 이미지 URL
             * @example https://cdn.example.com/images/101.png
             */
            representativeImageUrl?: string;
            /**
             * @description 대표 예문 원어민 TTS URL. 발음 페이지의 '원어민 발음 듣기' 재생용. 사용자의 AI 튜터 억양 기준이며, 발음 자산이 아직 준비되지 않은 표현은 null (앱은 null이면 발음 듣기·발화 파트를 숨긴다)
             * @example https://cdn.landit.com/content/expression-pronunciation-audio/101/abc.mp3
             */
            representativeSentenceAudioUrl?: string;
            /**
             * @description 타겟 표현만 읽은 원어민 TTS URL. 표현 듣기 재생용. 사용자의 AI 튜터 억양 기준이며, 발음 자산이 아직 준비되지 않았거나 패턴형 표현(발화 불가)이면 null (앱은 null이면 표현 듣기 버튼을 숨긴다)
             * @example https://cdn.landit.com/content/expression-pronunciation-audio/101/expr.mp3
             */
            targetExpressionAudioUrl?: string;
            /**
             * @description 이 표현의 학습 완료 여부. 시나리오는 일일 정책 도입 이후 완료·재완료, 프리톡은 누적 완료 기준
             * @example true
             */
            completed?: boolean;
            /** @description 같은 표현 학습을 재개할 때 사용하는 시도 ID */
            learningAttemptId?: string;
            /**
             * Format: date-time
             * @description 새 입력을 제출할 수 있는 시각 한계
             */
            learningExpiresAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAppVersionCheckResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AppVersionCheckResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AppVersionCheckResponse: {
            /** @enum {string} */
            updateType?: "FORCE" | "SOFT" | "NONE";
            latestVersionName?: string;
            /** Format: int64 */
            latestBuildNumber?: number;
            minimumSupportedVersionName?: string;
            reason?: string;
            /** Format: date-time */
            releasedAt?: string;
        };
        AdminUserListItem: {
            /** Format: int64 */
            userProfileId: number;
            email: string | null;
            nickname: string;
            /** @enum {string} */
            role: "USER" | "ADMIN";
            /** @enum {string} */
            status: "ACTIVE" | "WITHDRAWN" | "BANNED";
            /** @enum {string} */
            pushPermissionStatus: "GRANTED" | "DENIED" | "NOT_DETERMINED";
            /** Format: date-time */
            createdAt: string;
        };
        AdminUserListResponse: {
            items: components["schemas"]["AdminUserListItem"][];
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            size: number;
            hasNext: boolean;
            /** Format: int64 */
            totalCount: number;
            /** Format: int32 */
            totalPages: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminUserListResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminUserListResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminUserDetailResponse: {
            /** Format: int64 */
            userProfileId: number;
            email: string | null;
            nickname: string;
            /** @enum {string} */
            role: "USER" | "ADMIN";
            /** @enum {string} */
            status: "ACTIVE" | "WITHDRAWN" | "BANNED";
            /** @enum {string} */
            targetLocale: "EN" | "KR" | "JA";
            /** @enum {string} */
            baseLocale: "EN" | "KR" | "JA";
            /** Format: int32 */
            learningLevel: number | null;
            /** Format: int32 */
            currentLevel: number;
            /** Format: int64 */
            aiTutorId: number | null;
            /** @enum {string} */
            pushPermissionStatus: "GRANTED" | "DENIED" | "NOT_DETERMINED";
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
            learningSummary: components["schemas"]["LearningSummary"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminUserDetailResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminUserDetailResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        CurrentScenario: {
            /** Format: int64 */
            scenarioId: number;
            scenarioTitle: string;
            /** Format: int32 */
            displayOrder: number;
            /** @enum {string} */
            dailyScenarioType: "NEW" | "RETRY" | "CLEARED";
        };
        LearningSummary: {
            /** Format: int64 */
            completedScenarioCount: number;
            currentScenario: components["schemas"]["CurrentScenario"];
            /** Format: int32 */
            currentStreakDays: number;
            /** Format: date */
            lastLearningDate: string | null;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseListAdminSubscriptionGrantResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminSubscriptionGrantResponse"][];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminSignupStatisticsResponse: {
            /** Format: int64 */
            thisWeek: number;
            /** Format: int64 */
            lastWeek: number;
            /** Format: int64 */
            thisMonth: number;
            /** Format: int64 */
            lastMonth: number;
            /**
             * Format: date-time
             * @description 집계 기준 시각 (Asia/Seoul)
             */
            asOf: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminSignupStatisticsResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminSignupStatisticsResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminSubscriptionProductResponse: {
            /** @enum {string} */
            product?: "MONTHLY" | "YEARLY" | "PASS_30000" | "PASS_50000" | "PASS_100000" | "PASS_200000";
            productId?: string;
            label?: string;
            durationLabel?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseListAdminSubscriptionProductResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminSubscriptionProductResponse"][];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminScenarioListResponse: {
            categories?: components["schemas"]["CategoryResponse"][];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminScenarioListResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminScenarioListResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponsePageReferralPolicy: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["PageReferralPolicy"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        PageReferralPolicy: {
            items?: components["schemas"]["ReferralPolicy"][];
            hasNext?: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponsePageReferralBillingEvent: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["PageReferralBillingEvent"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        PageReferralBillingEvent: {
            items?: components["schemas"]["ReferralBillingEvent"][];
            hasNext?: boolean;
        };
        ReferralBillingEvent: {
            /** Format: int64 */
            id?: number;
            eventId?: string;
            type?: string;
            status?: string;
            reason?: string;
            /** Format: int32 */
            attempts?: number;
            /** Format: date-time */
            receivedAt?: string;
        };
        AdminPushCampaignPage: {
            items?: components["schemas"]["AdminPushCampaignView"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            hasNext?: boolean;
            /** Format: int64 */
            totalCount?: number;
            /** Format: int64 */
            totalPages?: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminPushCampaignPage: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminPushCampaignPage"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminPushAudiencePreview: {
            /** Format: int64 */
            estimatedUserCount?: number;
            /** Format: int64 */
            estimatedTokenCount?: number;
            /** Format: date-time */
            estimatedAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminPushAudiencePreview: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminPushAudiencePreview"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseListAdminPopupResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminPopupResponse"][];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminNpsResponsePage: {
            items?: components["schemas"]["Item"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            hasNext?: boolean;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminNpsResponsePage: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminNpsResponsePage"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 편지함 어드민 공지·업데이트 페이지 응답 */
        AdminMailboxLetterListResponse: {
            items?: components["schemas"]["AdminMailboxLetterResponse"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminMailboxLetterListResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminMailboxLetterListResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 편지함 어드민 피드백 페이지 응답 */
        AdminMailboxFeedbackListResponse: {
            items?: components["schemas"]["AdminMailboxFeedbackResponse"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
        };
        /** @description 편지함 어드민 피드백 응답 */
        AdminMailboxFeedbackResponse: {
            /** Format: int64 */
            feedbackId?: number;
            /** Format: int64 */
            userProfileId?: number;
            email?: string;
            nickname?: string;
            /** @enum {string} */
            type?: "BUG_REPORT" | "FEATURE_REQUEST" | "QUESTION" | "CHEER";
            content?: string;
            /** @enum {string} */
            status?: "PENDING" | "COMPLETED";
            /** Format: int64 */
            resolvedByFeedbackId?: number;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminMailboxFeedbackListResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminMailboxFeedbackListResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 편지함 어드민 피드백 상세 응답 */
        AdminMailboxFeedbackDetailResponse: {
            /** Format: int64 */
            feedbackId?: number;
            /** Format: int64 */
            userProfileId?: number;
            email?: string;
            nickname?: string;
            /** @enum {string} */
            type?: "BUG_REPORT" | "FEATURE_REQUEST" | "QUESTION" | "CHEER";
            content?: string;
            /** @enum {string} */
            status?: "PENDING" | "COMPLETED";
            /** Format: int64 */
            resolvedByFeedbackId?: number;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            /** @description 최신 답장. 없으면 null */
            reply?: components["schemas"]["Reply"];
            /** @description 첨부 이미지 목록 */
            attachments?: components["schemas"]["MailboxFeedbackAttachmentResponse"][];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminMailboxFeedbackDetailResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminMailboxFeedbackDetailResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 관리자 직접 편지 발송 이력 페이지 */
        AdminMailboxDirectLetterListResponse: {
            items?: components["schemas"]["AdminMailboxDirectLetterSummary"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
        };
        /** @description 직접 편지 발송 요약 */
        AdminMailboxDirectLetterSummary: {
            /** Format: int64 */
            letterId?: number;
            title?: string;
            /** Format: date-time */
            sentAt?: string;
            /** Format: int64 */
            recipientCount?: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminMailboxDirectLetterListResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminMailboxDirectLetterListResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 관리자 직접 편지 발송 상세 */
        AdminMailboxDirectLetterDetailResponse: {
            /** Format: int64 */
            letterId?: number;
            title?: string;
            bodyText?: string;
            /** Format: date-time */
            sentAt?: string;
            /** Format: int32 */
            recipientCount?: number;
            recipients?: components["schemas"]["AdminMailboxDirectLetterRecipient"][];
        };
        /** @description 직접 편지 수신자 */
        AdminMailboxDirectLetterRecipient: {
            /** Format: int64 */
            userProfileId?: number;
            /**
             * Format: date-time
             * @description 최초 읽음 시각. 미열람이면 null
             */
            readAt: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminMailboxDirectLetterDetailResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminMailboxDirectLetterDetailResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 발음 평가 자산 커버리지 현황 */
        AdminPronunciationAssetCoverageResponse: {
            /**
             * Format: int32
             * @description 활성 표현 전체 수
             * @example 981
             */
            totalActiveExpressions?: number;
            /** @description 억양별 커버리지 목록 */
            locales?: components["schemas"]["LocaleCoverage"][];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminPronunciationAssetCoverageResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminPronunciationAssetCoverageResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 억양 1개의 커버리지 */
        LocaleCoverage: {
            /**
             * @description 억양 locale
             * @example EN_US
             * @enum {string}
             */
            accentLocale?: "EN_US" | "EN_AU" | "EN_GB";
            /**
             * Format: int32
             * @description 기준 데이터가 있는 활성 표현 수
             * @example 981
             */
            referenceCovered?: number;
            /**
             * @description 기준 데이터가 없는 활성 표현 ID 목록
             * @example [
             *       455,
             *       812
             *     ]
             */
            referenceMissing?: number[];
            /**
             * Format: int32
             * @description 음성(TTS)까지 완성된 활성 표현 수
             * @example 979
             */
            audioCovered?: number;
            /**
             * @description 기준 데이터는 있으나 음성이 없는 활성 표현 ID 목록
             * @example [
             *       977
             *     ]
             */
            audioMissing?: number[];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseListAdminContentRuleResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminContentRuleResponse"][];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminContentBatchPage: {
            items: components["schemas"]["AdminContentBatchSummary"][];
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            size: number;
            hasNext: boolean;
            /** Format: int64 */
            totalCount: number;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminContentBatchPage: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminContentBatchPage"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        AdminContentNextDayResponse: {
            /**
             * Format: int32
             * @example 301
             */
            nextDay: number;
            /**
             * Format: int64
             * @example 300
             */
            publishedScenarioCount: number;
            /**
             * Format: int64
             * @example 0
             */
            reservedDayCount: number;
            characterCounts: {
                [key: string]: number;
            };
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseAdminContentNextDayResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminContentNextDayResponse"];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseListAdminAppVersionResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AdminAppVersionResponse"][];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
        /** @description 영어 억양 선택지 */
        AccentLocaleOptionResponse: {
            /**
             * @description 억양 코드
             * @example EN_US
             */
            code?: string;
            /**
             * @description 나라 이름
             * @example 미국
             */
            name?: string;
        };
        /** @description 공통 API 응답 객체 */
        ApiResponseListAccentLocaleOptionResponse: {
            /**
             * @description 요청 처리 성공 여부
             * @example true
             */
            success?: boolean;
            /** @description 성공 응답 데이터. 실패 시 null입니다. */
            data?: components["schemas"]["AccentLocaleOptionResponse"][];
            /** @description 실패 오류 정보. 성공 시 null입니다. */
            error?: components["schemas"]["ErrorResponse"];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    update: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                installationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PushDeviceUpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    updateNickname: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserNicknameUpdateRequest"];
            };
        };
        responses: {
            /** @description 변경 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserNicknameResponse"];
                };
            };
            /** @description VALIDATION_FAILED. 본문 누락이나 형식 오류, 닉네임 누락, 공백만 입력, 20자 초과, 허용하지 않는 문자 포함 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserNicknameResponse"];
                };
            };
            /** @description INVALID_TOKEN. 토큰이 없거나 유효하지 않거나 탈퇴한 사용자 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserNicknameResponse"];
                };
            };
        };
    };
    getLocale: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserLocalePreferenceResponse"];
                };
            };
        };
    };
    updateLocale: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserLocalePreference"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserLocalePreferenceResponse"];
                };
            };
        };
    };
    getLearningLevel: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserLearningLevelResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserLearningLevelResponse"];
                };
            };
        };
    };
    updateLearningLevel: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserLearningLevelUpdateRequest"];
            };
        };
        responses: {
            /** @description 변경 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 요청 검증 실패 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    update_1: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExpoPushTokenUpdateRequest"];
            };
        };
        responses: {
            /** @description 변경 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 요청 검증 실패 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    getAlarm: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserAlarmResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserAlarmResponse"];
                };
            };
        };
    };
    updateAlarm: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserAlarmUpdateRequest"];
            };
        };
        responses: {
            /** @description 저장 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserAlarmResponse"];
                };
            };
            /** @description 요청 검증 실패 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserAlarmResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserAlarmResponse"];
                };
            };
        };
    };
    getAccentLocale: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserAccentLocaleResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserAccentLocaleResponse"];
                };
            };
        };
    };
    updateAccentLocale: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserAccentLocaleUpdateRequest"];
            };
        };
        responses: {
            /** @description 변경 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 요청 검증 실패 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    processing: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReferralProcessingRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReferralPolicyState"];
                };
            };
        };
    };
    current: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReferralPolicyState"];
                };
            };
        };
    };
    update_2: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReferralPolicyUpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReferralPolicyState"];
                };
            };
        };
    };
    settings: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseTrialReminderSettings"];
                };
            };
        };
    };
    update_3: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TrialReminderSettings"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseTrialReminderSettings"];
                };
            };
        };
    };
    updateLineup: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentLineupUpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentBatchResponse"];
                };
            };
        };
    };
    review: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
                draftId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentDraftReviewRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentDraftDetail"];
                };
            };
        };
    };
    replaceAsset: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
                draftId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentAssetReplaceRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentDraftDetail"];
                };
            };
        };
    };
    confirmAssets: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
                draftId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentDraftDetail"];
                };
            };
        };
    };
    submitMessage: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SessionMessageSubmitRequest"];
            };
        };
        responses: {
            /** @description 제출 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionMessageSubmitResponse"];
                };
            };
            /** @description 잘못된 요청 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionMessageSubmitResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionMessageSubmitResponse"];
                };
            };
            /** @description 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionMessageSubmitResponse"];
                };
            };
            /** @description 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionMessageSubmitResponse"];
                };
            };
            /** @description 이미 완료됨 */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionMessageSubmitResponse"];
                };
            };
            /** @description AI 생성 실패 */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionMessageSubmitResponse"];
                };
            };
        };
    };
    getOrCreateFeedback: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionFeedbackResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionFeedbackResponse"];
                };
            };
            /** @description 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionFeedbackResponse"];
                };
            };
            /** @description 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionFeedbackResponse"];
                };
            };
            /** @description 완료되지 않음 또는 피드백 미준비 */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionFeedbackResponse"];
                };
            };
            /** @description AI 응답 형식 오류 */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionFeedbackResponse"];
                };
            };
            /** @description 최종 피드백 생성 실패 */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionFeedbackResponse"];
                };
            };
        };
    };
    startScenarioSession: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                scenarioId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 시작 성공 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionStartResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionStartResponse"];
                };
            };
            /** @description 잠금 상태 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionStartResponse"];
                };
            };
            /** @description 시나리오 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionStartResponse"];
                };
            };
        };
    };
    start: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                reviewId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewResponse"];
                };
            };
            /** @description PREMIUM_REQUIRED: 유료 전환 후 새 시작 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewResponse"];
                };
            };
            /** @description 소유한 복습 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewResponse"];
                };
            };
            /** @description REVIEW_EXPIRED: 복습 만료 */
            410: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewResponse"];
                };
            };
        };
    };
    answer: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                reviewId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewAnswerRequest"];
            };
        };
        responses: {
            /** @description 요청 검증 실패 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewAnswerResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewAnswerResponse"];
                };
            };
            /** @description PREMIUM_REQUIRED: 유료 전환 후 새 시작 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewAnswerResponse"];
                };
            };
            /** @description 소유한 복습 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewAnswerResponse"];
                };
            };
            /** @description 시작 전, 문제 순서 또는 제출 키 내용 충돌 */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewAnswerResponse"];
                };
            };
            /** @description REVIEW_EXPIRED: 복습 만료 */
            410: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewAnswerResponse"];
                };
            };
        };
    };
    register: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReferralRegistrationRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    skip: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    issue: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseString"];
                };
            };
        };
    };
    submit: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NpsSubmitRequest"];
            };
        };
        responses: {
            /** @description 제출 성공 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 잘못된 요청 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    dismissPaywall: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 이탈 처리 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePaywallDismissResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePaywallDismissResponse"];
                };
            };
        };
    };
    submitFeedbackWithImages: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    feedback: components["schemas"]["MailboxFeedbackSubmitRequest"];
                    images?: string[];
                };
                "application/json": components["schemas"]["MailboxFeedbackSubmitRequest"];
            };
        };
        responses: {
            /** @description 등록 성공 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 요청 값 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    getSessions: {
        parameters: {
            query?: {
                /**
                 * @description 0부터 시작하는 페이지 번호
                 * @example 0
                 */
                page?: number;
                /**
                 * @description 페이지 크기 (1~50)
                 * @example 20
                 */
                size?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionListResponse"];
                };
            };
            /** @description 페이지 번호 또는 크기 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionListResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionListResponse"];
                };
            };
        };
    };
    startSession: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FreeTalkSessionStartRequest"];
            };
        };
        responses: {
            /** @description 시작 성공 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionStartResponse"];
                };
            };
            /** @description 요청 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionStartResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionStartResponse"];
                };
            };
            /** @description 프리미엄 구독 필요 (PREMIUM_REQUIRED) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionStartResponse"];
                };
            };
            /** @description 주제 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionStartResponse"];
                };
            };
            /** @description 일일 발화 한도 초과 (FREE_TALK_DAILY_SPEAKING_LIMIT_EXCEEDED) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionStartResponse"];
                };
            };
            /** @description 일일 요청 한도 초과 (FREE_TALK_DAILY_REQUEST_LIMIT_EXCEEDED) 또는 분당 요청 한도 초과 (FREE_TALK_REQUEST_RATE_LIMIT_EXCEEDED) */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionStartResponse"];
                };
            };
            /** @description AI 응답 오류 */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionStartResponse"];
                };
            };
            /** @description AI 생성 실패 */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionStartResponse"];
                };
            };
        };
    };
    submitMessage_1: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FreeTalkMessageSubmitRequest"];
            };
        };
        responses: {
            /** @description 처리 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 세션 소유자 아님 또는 프리미엄 구독 필요 (PREMIUM_REQUIRED) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 중복·처리 중인 발화 또는 일일 발화 한도 초과 (FREE_TALK_DAILY_SPEAKING_LIMIT_EXCEEDED) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 일일 요청 한도 초과 (FREE_TALK_DAILY_REQUEST_LIMIT_EXCEEDED) 또는 분당 요청 한도 초과 (FREE_TALK_REQUEST_RATE_LIMIT_EXCEEDED) */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description AI 생성 실패 */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
        };
    };
    retryExpressions: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 재시도 요청 성공 */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkExpressionRetryResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkExpressionRetryResponse"];
                };
            };
            /** @description 세션 소유자 아님 또는 프리미엄 구독 필요 (PREMIUM_REQUIRED) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkExpressionRetryResponse"];
                };
            };
            /** @description 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkExpressionRetryResponse"];
                };
            };
            /** @description 재시도할 수 없는 세션 상태 */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkExpressionRetryResponse"];
                };
            };
            /** @description 일일 요청 한도 초과 (FREE_TALK_DAILY_REQUEST_LIMIT_EXCEEDED) 또는 분당 요청 한도 초과 (FREE_TALK_REQUEST_RATE_LIMIT_EXCEEDED) */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkExpressionRetryResponse"];
                };
            };
        };
    };
    decideExit: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FreeTalkExitDecisionRequest"];
            };
        };
        responses: {
            /** @description 처리 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 세션 소유자 아님 또는 프리미엄 구독 필요 (PREMIUM_REQUIRED) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 종료 확인 상태 불일치 */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description 일일 요청 한도 초과 (FREE_TALK_DAILY_REQUEST_LIMIT_EXCEEDED) 또는 분당 요청 한도 초과 (FREE_TALK_REQUEST_RATE_LIMIT_EXCEEDED) */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
            /** @description AI 생성 실패 */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMessageSubmitResponse"];
                };
            };
        };
    };
    completeSession: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 완료 성공 또는 이미 완료됨 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 세션 소유자 아님 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 프리톡 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 중단된 세션 (CONFLICT) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    analyzeSentence: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                /**
                 * @description Writing 표현 ID
                 * @example 101
                 */
                expressionId: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * Format: binary
                     * @description 사용자 발화 녹음. m4a·wav·mp3·webm, 최대 10MB·30초
                     */
                    audio: string;
                };
            };
        };
        responses: {
            /** @description 분석 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePronunciationAnalysisResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePronunciationAnalysisResponse"];
                };
            };
            /** @description 프리미엄 구독 필요 (PREMIUM_REQUIRED). 표현 목록의 freeTrial=true 표현은 무료 사용자도 허용 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePronunciationAnalysisResponse"];
                };
            };
        };
    };
    finishLearning: {
        parameters: {
            query?: never;
            header?: {
                "X-Learning-Attempt-Id"?: string;
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                expressionId: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["ExpressionLearningFinishRequest"];
            };
        };
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMapStringObject"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMapStringObject"];
                };
            };
            /** @description 프리미엄 구독 필요 (PREMIUM_REQUIRED). 목록의 freeTrial=true 표현은 무료 사용자도 허용 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMapStringObject"];
                };
            };
        };
    };
    refresh: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TokenRefreshRequest"];
            };
        };
        responses: {
            /** @description 갱신 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseTokenRefreshResponse"];
                };
            };
            /** @description refresh token 오류 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseTokenRefreshResponse"];
                };
            };
        };
    };
    socialLogin: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SocialLoginRequest"];
            };
        };
        responses: {
            /** @description 로그인 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAuthTokenResponse"];
                };
            };
            /** @description OIDC 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAuthTokenResponse"];
                };
            };
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LogoutRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    history: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                userProfileId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListAdminSubscriptionGrantResponse"];
                };
            };
        };
    };
    grant: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                userProfileId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminSubscriptionGrantRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminSubscriptionGrantResponse"];
                };
            };
        };
    };
    start_1: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                scenarioId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 시작 성공 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionStartResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionStartResponse"];
                };
            };
            /** @description 관리자 권한 없음 또는 비활성 콘텐츠 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionStartResponse"];
                };
            };
            /** @description 시나리오 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionStartResponse"];
                };
            };
        };
    };
    retryReward: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReferralRetryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    retryEvent: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReferralRetryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    list: {
        parameters: {
            query?: {
                /** @description 예약 시각 보유 여부. false에는 초안도 포함 */
                scheduled?: boolean;
                status?: "DRAFT" | "PENDING" | "SCHEDULE_PENDING" | "SCHEDULED" | "QUEUED" | "SENDING" | "COMPLETED" | "CANCELLED";
                page?: number;
                size?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPushCampaignPage"];
                };
            };
        };
    };
    create: {
        parameters: {
            query?: never;
            header: {
                /** @description 1~128자 ASCII 영숫자, 대시, 밑줄 */
                "Idempotency-Key": string;
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPushCampaignRequest"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPushCampaignView"];
                };
            };
        };
    };
    test: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                campaignId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Accepted */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPushCampaignView"];
                };
            };
        };
    };
    send: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                campaignId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Accepted */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPushCampaignView"];
                };
            };
        };
    };
    schedule: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                campaignId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPushScheduleRequest"];
            };
        };
        responses: {
            /** @description Accepted */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPushCampaignView"];
                };
            };
        };
    };
    cancelSchedule: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                campaignId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPushCampaignView"];
                };
            };
        };
    };
    queryAudience: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPushAudienceQueryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListLong"];
                };
            };
        };
    };
    list_1: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListAdminPopupResponse"];
                };
            };
        };
    };
    create_1: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPopupCreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPopupResponse"];
                };
            };
        };
    };
    test_1: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminEmailTestRequest"];
            };
        };
        responses: {
            /** @description Accepted */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseNotificationJobView"];
                };
            };
        };
    };
    sendReplies: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminMailboxReplyRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxReplyResponse"];
                };
            };
        };
    };
    getLetters: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
                type?: "NOTICE" | "UPDATE" | "REPLY" | "DIRECT";
                publicationStatus?: "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
                pinned?: boolean;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxLetterListResponse"];
                };
            };
        };
    };
    createLetter: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminMailboxLetterCreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxLetterResponse"];
                };
            };
        };
    };
    getDirectLetters: {
        parameters: {
            query?: {
                /** @description 0부터 시작하는 페이지 번호 */
                page?: string;
                /** @description 페이지 크기 */
                size?: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxDirectLetterListResponse"];
                };
            };
        };
    };
    sendDirectLetter: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminMailboxDirectLetterRequest"];
            };
        };
        responses: {
            /** @description 발송 완료 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxDirectLetterResponse"];
                };
            };
        };
    };
    importTts: {
        parameters: {
            query: {
                /**
                 * @description S3 TTS 매니페스트 키
                 * @example content/expression-pronunciation-audio/manifests/tts-2026-08-26.json
                 */
                manifestKey: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPronunciationAssetImportResult"];
                };
            };
        };
    };
    importReference: {
        parameters: {
            query: {
                /**
                 * @description S3 기준 데이터 파일 키
                 * @example content/expression-pronunciation-audio/manifests/reference_EN_US.json
                 */
                manifestKey: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPronunciationAssetImportResult"];
                };
            };
        };
    };
    list_2: {
        parameters: {
            query?: {
                scope?: "COMMON" | "LINEUP" | "QUESTION" | "EXPRESSION" | "STAR_MESSAGE" | "REVIEW" | "IMAGE";
                status?: "ACTIVE" | "RETIRED";
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListAdminContentRuleResponse"];
                };
            };
        };
    };
    create_2: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentRuleCreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentRuleResponse"];
                };
            };
        };
    };
    createPresignedUrl: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentImagePresignRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentImagePresignResponse"];
                };
            };
        };
    };
    list_3: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentBatchPage"];
                };
            };
        };
    };
    create_3: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentBatchCreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentBatchResponse"];
                };
            };
        };
    };
    resume: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentBatchResponse"];
                };
            };
        };
    };
    proceed: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentBatchResponse"];
                };
            };
        };
    };
    regenerateLineup: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentLineupRegenerateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentBatchResponse"];
                };
            };
        };
    };
    regenerate: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
                draftId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentDraftRegenerateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentDraftDetail"];
                };
            };
        };
    };
    regenerateAsset: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
                draftId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentAssetRegenerateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentDraftDetail"];
                };
            };
        };
    };
    startAssets: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentBatchResponse"];
                };
            };
        };
    };
    approve: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentBatchResponse"];
                };
            };
        };
    };
    endSession: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 종료 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
            /** @description 이미 완료됨 */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    update_4: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                popupId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPopupPatchRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPopupResponse"];
                };
            };
        };
    };
    updateLetter: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                letterId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminMailboxLetterPatchRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxLetterResponse"];
                };
            };
        };
    };
    changeStatus: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                ruleId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminContentRuleStatusRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentRuleResponse"];
                };
            };
        };
    };
    update_5: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                platform: "IOS" | "ANDROID";
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminAppVersionUpdateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminAppVersionResponse"];
                };
            };
        };
    };
    getInnerThought: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                sessionId: number;
                messageId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionInnerThoughtResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionInnerThoughtResponse"];
                };
            };
            /** @description 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionInnerThoughtResponse"];
                };
            };
            /** @description 세션 또는 메시지 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionInnerThoughtResponse"];
                };
            };
        };
    };
    getLevelAssessment: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionLevelAssessmentResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionLevelAssessmentResponse"];
                };
            };
            /** @description 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionLevelAssessmentResponse"];
                };
            };
            /** @description 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseSessionLevelAssessmentResponse"];
                };
            };
        };
    };
    listScenarios: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseScenarioListResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseScenarioListResponse"];
                };
            };
        };
    };
    getHistory: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                /**
                 * @description 조회할 시나리오 ID
                 * @example 1
                 */
                scenarioId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseScenarioHistoryResponse"];
                };
            };
            /** @description 시나리오 ID 형식 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseScenarioHistoryResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseScenarioHistoryResponse"];
                };
            };
        };
    };
    getDailyScenario: {
        parameters: {
            query?: {
                /**
                 * @description 조회 날짜(yyyy-MM-dd). 생략하면 Asia/Seoul 기준 오늘
                 * @example 2026-07-30
                 */
                date?: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseDailyScenarioResponse"];
                };
            };
            /** @description 날짜 형식 오류 또는 미래 날짜 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseDailyScenarioResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseDailyScenarioResponse"];
                };
            };
        };
    };
    getCalendar: {
        parameters: {
            query: {
                /** @description 캘린더 조회 단위 */
                type: "WEEK" | "MONTH";
                /**
                 * @description 창의 기준 날짜(yyyy-MM-dd). 생략하면 서버 기준 오늘
                 * @example 2026-07-30
                 */
                date?: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseScenarioCalendarResponse"];
                };
            };
            /** @description type 값 오류 또는 date 형식 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseScenarioCalendarResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseScenarioCalendarResponse"];
                };
            };
        };
    };
    get: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                reviewId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewResponse"];
                };
            };
            /** @description PREMIUM_REQUIRED: 유료 전환 후 새 시작 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewResponse"];
                };
            };
            /** @description 소유한 복습 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReviewResponse"];
                };
            };
        };
    };
    rewards: {
        parameters: {
            query?: {
                before?: number;
                size?: number;
                recipientRole?: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePageReferralReward"];
                };
            };
        };
    };
    preview: {
        parameters: {
            query: {
                code: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReferralPreview"];
                };
            };
        };
    };
    me: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseReferralSummary"];
                };
            };
        };
    };
    getActive: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseActivePopupResponse"];
                };
            };
        };
    };
    getSubscription: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserSubscriptionResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseUserSubscriptionResponse"];
                };
            };
        };
    };
    getSubscriptionEvents: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListSubscriptionEventResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListSubscriptionEventResponse"];
                };
            };
        };
    };
    getCurrentStreak: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseCurrentStreakResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseCurrentStreakResponse"];
                };
            };
        };
    };
    getCalendar_1: {
        parameters: {
            query?: {
                /**
                 * @description 조회 연도. month와 함께 생략 가능
                 * @example 2026
                 */
                year?: number;
                /**
                 * @description 조회 월. year와 함께 생략 가능
                 * @example 7
                 */
                month?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseStreakCalendarResponse"];
                };
            };
            /** @description 요청 값 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseStreakCalendarResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseStreakCalendarResponse"];
                };
            };
        };
    };
    summary: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseRewardView"];
                };
            };
        };
    };
    previewHistory: {
        parameters: {
            query?: {
                cursor?: string;
                limit?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseRewardPreviewHistoryPage"];
                };
            };
        };
    };
    history_1: {
        parameters: {
            query?: {
                cursor?: string;
                limit?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseRewardHistoryPage"];
                };
            };
        };
    };
    page: {
        parameters: {
            query?: {
                cursor?: number;
                limit?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePage"];
                };
            };
        };
    };
    detail: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                cycleId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseCycle"];
                };
            };
        };
    };
    completion: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                completionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseRewardCompletion"];
                };
            };
        };
    };
    getUnreadCount: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxUnreadCountResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxUnreadCountResponse"];
                };
            };
        };
    };
    getSentFeedbacks: {
        parameters: {
            query?: {
                /** @description 다음 페이지 조회용 커서 */
                cursor?: string;
                /**
                 * @description 페이지 크기 (1~100)
                 * @example 20
                 */
                size?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxSentFeedbackListResponse"];
                };
            };
            /** @description 커서 또는 페이지 크기 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxSentFeedbackListResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxSentFeedbackListResponse"];
                };
            };
        };
    };
    getSentFeedback: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                feedbackId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxSentFeedbackDetailResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxSentFeedbackDetailResponse"];
                };
            };
            /** @description 피드백 없음 또는 접근 불가 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxSentFeedbackDetailResponse"];
                };
            };
        };
    };
    getReceivedLetters: {
        parameters: {
            query?: {
                /** @description 다음 페이지 조회용 커서 */
                cursor?: string;
                /**
                 * @description 페이지 크기 (1~100)
                 * @example 20
                 */
                size?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxReceivedListResponse"];
                };
            };
            /** @description 커서 또는 페이지 크기 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxReceivedListResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxReceivedListResponse"];
                };
            };
        };
    };
    getReceivedLetter: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                letterId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxReceivedDetailResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxReceivedDetailResponse"];
                };
            };
            /** @description 편지 없음 또는 접근 불가 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseMailboxReceivedDetailResponse"];
                };
            };
        };
    };
    getFeedbackAttachment: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                feedbackId: number;
                attachmentId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/png": string;
                    "image/jpeg": string;
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
            /** @description 첨부 없음 또는 접근 불가 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    getTopics: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMainResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkMainResponse"];
                };
            };
        };
    };
    getSession: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                /**
                 * @description 조회할 프리톡 학습 세션 ID
                 * @example 123
                 */
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionDetailResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionDetailResponse"];
                };
            };
            /** @description 세션 소유자 아님 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionDetailResponse"];
                };
            };
            /** @description 완료된 프리톡 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionDetailResponse"];
                };
            };
        };
    };
    getSummary: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                /**
                 * @description 조회할 프리톡 학습 세션 ID
                 * @example 123
                 */
                sessionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionSummaryResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionSummaryResponse"];
                };
            };
            /** @description 세션 소유자 아님 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionSummaryResponse"];
                };
            };
            /** @description 프리톡 세션 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionSummaryResponse"];
                };
            };
            /** @description 완료되지 않은 세션 (SESSION_NOT_COMPLETED) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseFreeTalkSessionSummaryResponse"];
                };
            };
        };
    };
    getExpressions: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                scenarioId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListExpressionResponse"];
                };
            };
            /** @description 시나리오 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListExpressionResponse"];
                };
            };
        };
    };
    getExtraPracticeExamples: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                expressionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseExpressionPracticeResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseExpressionPracticeResponse"];
                };
            };
            /** @description 프리미엄 구독 필요 (PREMIUM_REQUIRED). 목록의 freeTrial=true 표현은 무료 사용자도 허용 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseExpressionPracticeResponse"];
                };
            };
        };
    };
    getOneExpressionToStartLearning: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                expressionId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseExpressionLearningResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseExpressionLearningResponse"];
                };
            };
            /** @description 프리미엄 구독 필요 (PREMIUM_REQUIRED). 목록의 freeTrial=true 표현은 무료 사용자도 허용 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseExpressionLearningResponse"];
                };
            };
        };
    };
    check: {
        parameters: {
            query: {
                /**
                 * @description 앱 플랫폼
                 * @example IOS
                 */
                platform: "IOS" | "ANDROID";
                /**
                 * @description 현재 앱 버전명
                 * @example 1.2.0
                 */
                versionName: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 업데이트 정책 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAppVersionCheckResponse"];
                };
            };
            /** @description 요청값 검증 실패 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAppVersionCheckResponse"];
                };
            };
            /** @description 활성 앱 버전 정책 미설정 또는 서버 오류 */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAppVersionCheckResponse"];
                };
            };
        };
    };
    list_4: {
        parameters: {
            query?: {
                /**
                 * @description 0부터 시작하는 페이지 번호
                 * @example 0
                 */
                page?: number;
                /**
                 * @description 페이지 크기 (1~50)
                 * @example 20
                 */
                size?: number;
                /** @description true: ACTIVE, false: WITHDRAWN 또는 BANNED */
                active?: boolean;
                /** @description true: GRANTED, false: DENIED 또는 NOT_DETERMINED */
                pushConsent?: boolean;
                /** @description 이메일·닉네임 부분 일치 또는 숫자 ID 완전 일치 (최대 255자) */
                keyword?: string;
                /** @description 사용자 역할 */
                role?: "USER" | "ADMIN";
                /** @description 사용자 상태. active와 함께 지정하면 AND로 적용 */
                status?: "ACTIVE" | "WITHDRAWN" | "BANNED";
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminUserListResponse"];
                };
            };
            /** @description 페이지 요청 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminUserListResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminUserListResponse"];
                };
            };
            /** @description 관리자 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminUserListResponse"];
                };
            };
        };
    };
    detail_1: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                /**
                 * @description 사용자 프로필 ID
                 * @example 1
                 */
                userProfileId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminUserDetailResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminUserDetailResponse"];
                };
            };
            /** @description 관리자 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminUserDetailResponse"];
                };
            };
            /** @description 사용자 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminUserDetailResponse"];
                };
            };
        };
    };
    statistics: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 집계 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminSignupStatisticsResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminSignupStatisticsResponse"];
                };
            };
            /** @description 관리자 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminSignupStatisticsResponse"];
                };
            };
        };
    };
    products: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListAdminSubscriptionProductResponse"];
                };
            };
        };
    };
    list_5: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminScenarioListResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminScenarioListResponse"];
                };
            };
            /** @description 관리자 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminScenarioListResponse"];
                };
            };
        };
    };
    rewards_1: {
        parameters: {
            query?: {
                userId?: number;
                before?: number;
                size?: number;
                status?: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePageReferralReward"];
                };
            };
        };
    };
    history_2: {
        parameters: {
            query?: {
                before?: number;
                size?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePageReferralPolicy"];
                };
            };
        };
    };
    events: {
        parameters: {
            query?: {
                before?: number;
                size?: number;
                status?: string;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponsePageReferralBillingEvent"];
                };
            };
        };
    };
    detail_2: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                campaignId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPushCampaignView"];
                };
            };
        };
    };
    preview_1: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                campaignId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPushAudiencePreview"];
                };
            };
        };
    };
    list_6: {
        parameters: {
            query?: {
                /**
                 * @description 0부터 시작하는 페이지 번호
                 * @example 0
                 */
                page?: number;
                /**
                 * @description 페이지 크기 (1~50)
                 * @example 20
                 */
                size?: number;
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminNpsResponsePage"];
                };
            };
            /** @description 페이지 요청 오류 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminNpsResponsePage"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminNpsResponsePage"];
                };
            };
            /** @description 관리자 권한 없음 */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminNpsResponsePage"];
                };
            };
        };
    };
    job: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseNotificationJobView"];
                };
            };
        };
    };
    getFeedbacks: {
        parameters: {
            query?: {
                keyword?: string;
                type?: "BUG_REPORT" | "FEATURE_REQUEST" | "QUESTION" | "CHEER";
                status?: "PENDING" | "COMPLETED";
                createdFrom?: string;
                createdTo?: string;
                page?: number;
                size?: number;
                sort?: "NEWEST" | "OLDEST";
            };
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxFeedbackListResponse"];
                };
            };
        };
    };
    getFeedback: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                feedbackId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxFeedbackDetailResponse"];
                };
            };
        };
    };
    getDirectLetter: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                letterId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxDirectLetterDetailResponse"];
                };
            };
            /** @description 직접 편지 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminMailboxDirectLetterDetailResponse"];
                };
            };
        };
    };
    coverage: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminPronunciationAssetCoverageResponse"];
                };
            };
        };
    };
    detail_3: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentBatchResponse"];
                };
            };
        };
    };
    draftDetail: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                batchId: number;
                draftId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentDraftDetail"];
                };
            };
        };
    };
    nextDay: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminContentNextDayResponse"];
                };
            };
        };
    };
    list_7: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListAdminAppVersionResponse"];
                };
            };
        };
    };
    getAccentLocales: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListAccentLocaleOptionResponse"];
                };
            };
            /** @description 인증 실패 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseListAccentLocaleOptionResponse"];
                };
            };
        };
    };
    withdraw: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseVoid"];
                };
            };
        };
    };
    revoke: {
        parameters: {
            query?: never;
            header?: {
                /** @description 미인증 요청의 초기 언어. ko/ja와 지역 태그·가중치를 지원합니다. 미인증 응답 기본값은 ko이며, 가입 시 지원 언어가 없으면 최초 선택이 필요합니다. 인증된 요청은 이 헤더와 관계없이 저장된 사용자 언어를 사용합니다. 로그인·앱 시작에는 GET /api/v1/me/locale을 조회합니다. PUT /api/v1/me/locale은 사용자가 언어를 선택할 때만 호출합니다. 이미 준비된 비동기 작업과 재시도는 저장된 작업 언어를 유지합니다. */
                "Accept-Language"?: string;
            };
            path: {
                userProfileId: number;
                grantId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ApiResponseAdminSubscriptionGrantResponse"];
                };
            };
        };
    };
}
