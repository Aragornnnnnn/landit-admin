// 이 파일은 `pnpm api:types`가 스웨거(https://api-develop.landit.im/v3/api-docs)에서 생성한다. 손으로 고치지 말고 재생성한다.
// 스웨거가 틀린 부분은 ./schema-patch.ts에서 덮어쓴다.
export interface paths {
    "/api/v1/me/learning-level": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
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
        put: operations["update"];
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
         * @description 사용자 메시지를 저장하고 다음 AI 메시지 또는 종료 메시지를 생성한다. 정상 완료한 시나리오는 이후 복습할 수 있다.
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
         * @description 완료된 세션의 요약 피드백과 메시지별 피드백을 생성하거나 조회한다.
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
        post: operations["submitFeedback"];
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
         * @description AI 선시작 또는 사용자 선시작 프리톡 세션을 생성한다.
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
         * @description 사용자 발화를 저장하고 AI 후속 메시지, 종료 확인 또는 시간 제한 종료를 반환한다.
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
         * @description OIDC ID Token과 nonce를 검증하고 서비스 토큰을 발급한다.
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
         * @description 전달받은 refresh token을 폐기한다.
         */
        post: operations["logout"];
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
        post: operations["start"];
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
        /** 공지·업데이트 초안 생성 */
        post: operations["createLetter"];
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
        /** 공지·업데이트 수정 */
        patch: operations["updateLetter"];
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
        patch: operations["update_1"];
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
    "/api/v1/scenarios/daily": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 날짜별 시나리오 조회
         * @description 오늘 배정된 시나리오 또는 과거 날짜에 최초 완료한 시나리오를 조회한다. date를 생략하면 Asia/Seoul 기준 오늘을 조회한다.
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
         * @description 기준 날짜가 포함된 창의 모든 칸을 반환한다. WEEK은 그 날짜가 속한 주(일요일 시작) 7칸이며 이웃 달 날짜가 섞일 수 있다. MONTH은 그 달 1일부터 말일까지만 반환한다. 완료한 날은 완료 시나리오 ID와 썸네일이 담기고, 미완료 오늘 칸은 배정된 시나리오 ID만 담긴다. 그 외 칸은 비어 있다.
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
    "/api/v1/me/streak": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 현재 스트릭 조회
         * @description 현재 연속 학습 일수, KST 기준 오늘 날짜와 정상 완료 여부를 조회한다.
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
         * @description KST 기준 오늘 날짜, 현재 스트릭 통계와 조회 월의 완료 날짜를 조회한다. year와 month를 모두 생략하면 KST 현재 월을 조회하고, 지정할 때는 둘 다 전달해야 한다.
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
         * @description 공지·업데이트와 답장을 최신순으로 조회한다.
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
         * @description 공지·업데이트와 답장을 조회하고 읽음 처리한다.
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
    "/api/v1/free-talk/topics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 프리톡 추천 주제 조회
         * @description 활성 상태의 프리톡 추천 주제를 노출 순서대로 조회한다.
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
         * @description 인증된 사용자가 완료한 프리톡의 세션 정보와 전체 대화를 조회한다.
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
    "/api/v1/expressions/{scenarioId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 시나리오별 원어민 표현 전체 조회
         * @description 표현 목록과 사용자별 완료 여부 및 잠금 상태를 반환한다.
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
         * @description 추가 예문 목록과 무작위 작문 문제를 조회한다.
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
         * @description 선택한 표현의 뜻, 설명과 대표 예문을 조회한다.
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
         * @description 사용자 기본 정보를 가입일 최신순으로 페이지 조회한다.
         */
        get: operations["list"];
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
        get: operations["detail"];
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
        get: operations["list_1"];
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
        get: operations["list_2"];
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
    "/api/v1/admin/app-versions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 관리자 앱 버전 정책 목록 */
        get: operations["list_3"];
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
         * @description 현재 사용자를 탈퇴 처리하고 활성 refresh token을 폐기한다.
         */
        delete: operations["withdraw"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description 사용자 학습 수준 변경 요청 */
        UserLearningLevelUpdateRequest: {
            /**
             * Format: int32
             * @description 1부터 5까지의 학습 수준
             * @example 3
             */
            learningLevel: number;
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
             * @description 오류 메시지
             * @example 요청한 리소스를 찾을 수 없습니다.
             */
            message?: string;
        };
        ExpoPushTokenUpdateRequest: {
            /** @enum {string} */
            platform: "IOS" | "ANDROID";
            expoPushToken: string;
            enabled: boolean;
            expoPushTokenFormatValid?: boolean;
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
        EvaluationContextResponse: {
            /** @enum {string} */
            type?: "AI_MESSAGE" | "SCENARIO_OPENING_INSTRUCTION";
            content?: string;
            translatedContent?: string;
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
        SessionFeedbackResponse: {
            /** Format: int64 */
            sessionId?: number;
            /** Format: int32 */
            nativeScore?: number;
            starRating?: number;
            highlightMessage?: string;
            summaryMessage?: string;
            messageFeedbacks?: components["schemas"]["MessageFeedbackResponse"][];
        };
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
            /** @description 첫 화면에 보여줄 상대 역할의 속마음 */
            innerThought?: string;
            /** @description 속마음 유형 */
            innerThoughtType?: string;
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
            /**
             * @description 시나리오 캐릭터 식별자
             * @example chloe
             */
            characterId?: string;
            /** @description 세션 타입 */
            sessionType?: string;
            /** @description 첫 발화자 */
            firstSpeaker?: string;
            /** @description USER first 시 사용자 시작 안내 */
            userOpeningInstruction?: string;
            /** @description 활성 시나리오 TTS 음성. 미설정 또는 비활성 음성이면 null */
            ttsVoice?: components["schemas"]["TtsVoiceResponse"];
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
            /**
             * @description 프리톡 캐릭터 식별자
             * @example chloe
             */
            characterId?: string;
            /** @description AI 선시작 주제명. 사용자 선시작은 null */
            title?: string;
            /**
             * Format: int64
             * @description 사용자 일일 발화 시간 제한 밀리초
             * @example 60000
             */
            speakingTimeLimitMs?: number;
            /** @description 프리톡 AI 상대의 TTS 음성 */
            ttsVoice?: components["schemas"]["TtsVoiceResponse"];
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
            type: "NOTICE" | "UPDATE" | "REPLY";
            /** @description 편지 제목 */
            title: string;
            /** @description 구조화된 본문 블록 */
            contentBlocks: unknown[];
            /** @description 목록 미리보기 */
            preview: string;
        };
        /** @description 편지함 어드민 공지·업데이트 응답 */
        AdminMailboxLetterResponse: {
            /** Format: int64 */
            letterId?: number;
            /** @enum {string} */
            type?: "NOTICE" | "UPDATE" | "REPLY";
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
        /** @description 편지함 어드민 공지·업데이트 수정 요청 */
        AdminMailboxLetterPatchRequest: {
            /**
             * @description 편지 유형
             * @enum {string}
             */
            type?: "NOTICE" | "UPDATE" | "REPLY";
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
            /** @description USER first 시 사용자 시작 안내 */
            userOpeningInstruction?: string;
            /** @description 첫 화면에 보여줄 상대 역할의 속마음 */
            innerThought?: string;
            /** @description 속마음 유형 */
            innerThoughtType?: string;
            /** @description 활성 시나리오 TTS 음성. 미설정 또는 비활성 음성이면 null */
            ttsVoice?: components["schemas"]["TtsVoiceResponse"];
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
             * @description 화면 헤더 문구
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
        Item: {
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
            /** @description 피드백 미리보기. 전체 문자열을 반환 */
            preview?: string;
            /**
             * @description 처리 상태
             * @example PENDING
             * @enum {string}
             */
            status?: "PENDING" | "COMPLETED";
            /**
             * Format: date-time
             * @description 등록 시각
             */
            createdAt?: string;
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
            letterType?: "NOTICE" | "UPDATE" | "REPLY";
            /** @description 편지 제목 */
            title?: string;
            /** @description 구조화된 공지·업데이트 본문. 답장은 null */
            contentBlocks?: unknown[];
            /** @description 답장 본문. 공지·업데이트는 null */
            bodyText?: string;
            /**
             * @description 답장과 연결된 원본 피드백 유형. 공지·업데이트는 null
             * @enum {string}
             */
            feedbackType?: "BUG_REPORT" | "FEATURE_REQUEST" | "QUESTION" | "CHEER";
            /** @description 답장과 연결된 원본 피드백 내용. 공지·업데이트는 null */
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
             * @description 화면 노출 순서
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
             * @description 학습 완료 여부
             * @example true
             */
            completed?: boolean;
            /**
             * @description 잠김 여부(해금 전 상태)
             * @example false
             */
            locked?: boolean;
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
            /** @description 추가 예문 목록 */
            practiceSentence?: components["schemas"]["PracticeSentenceResponse"][];
            /** @description 작문 연습에 사용할 문제. practiceSentence 중 랜덤 1개 */
            writingSentence?: components["schemas"]["WritingSentenceResponse"];
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
             * @description 연습 질문의 해석
             * @example 걔 노래 어때?
             */
            practiceQuestionTranslation?: string;
            /**
             * @description 예문 이미지 URL. 없으면 null
             * @example https://cdn.landit.com/writing/examples/001.png
             */
            imageUrl?: string;
        };
        /** @description 작문 연습 문제. practiceSentence 중 서버에서 랜덤으로 1개를 선택해 내려줌 */
        WritingSentenceResponse: {
            /**
             * @description 작문용으로 선택된 예문 영어 텍스트(정답 비교용)
             * @example The special effects blew my mind.
             */
            writingSentenceText?: string;
            /**
             * @description 선택된 예문의 해석
             * @example 특수효과가 끝내줬어.
             */
            writingSentenceTranslation?: string;
            /**
             * @description 선택된 예문의 연습 질문
             * @example How was the musical?
             */
            writingQuestion?: string;
            /**
             * @description 선택된 연습 질문의 해석
             * @example 뮤지컬 어땠어?
             */
            writingQuestionTranslation?: string;
            /**
             * @description 정답 예문을 단어 단위로 나눈 배열(정답 순서 유지)
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
             * @description 정답 단어와 오답 단어를 섞은 선택지 배열(저장된 섞인 순서 그대로)
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
            targetLocale: "EN" | "KR";
            /** @enum {string} */
            baseLocale: "EN" | "KR";
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
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    updateLearningLevel: {
        parameters: {
            query?: never;
            header?: never;
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
    update: {
        parameters: {
            query?: never;
            header?: never;
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
    submitMessage: {
        parameters: {
            query?: never;
            header?: never;
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
            header?: never;
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
            header?: never;
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
    submit: {
        parameters: {
            query?: never;
            header?: never;
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
    submitFeedback: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
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
            header?: never;
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
            header?: never;
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
            /** @description 주제 없음 */
            404: {
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
            header?: never;
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
            /** @description 세션 소유자 아님 */
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
            /** @description 중복 또는 처리 중인 발화 */
            409: {
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
            header?: never;
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
            /** @description 세션 소유자 아님 */
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
        };
    };
    decideExit: {
        parameters: {
            query?: never;
            header?: never;
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
            /** @description 세션 소유자 아님 */
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
    finishLearning: {
        parameters: {
            query?: never;
            header?: never;
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
            /** @description OK */
            200: {
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
            header?: never;
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
            header?: never;
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
            header?: never;
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
    start: {
        parameters: {
            query?: never;
            header?: never;
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
    sendReplies: {
        parameters: {
            query?: never;
            header?: never;
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
                type?: "NOTICE" | "UPDATE" | "REPLY";
                publicationStatus?: "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
                pinned?: boolean;
            };
            header?: never;
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
            header?: never;
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
    createPresignedUrl: {
        parameters: {
            query?: never;
            header?: never;
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
    endSession: {
        parameters: {
            query?: never;
            header?: never;
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
    updateLetter: {
        parameters: {
            query?: never;
            header?: never;
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
    update_1: {
        parameters: {
            query?: never;
            header?: never;
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
            header?: never;
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
    listScenarios: {
        parameters: {
            query?: never;
            header?: never;
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
    getDailyScenario: {
        parameters: {
            query?: {
                /**
                 * @description 조회 날짜(yyyy-MM-dd). 생략하면 Asia/Seoul 기준 오늘
                 * @example 2026-07-30
                 */
                date?: string;
            };
            header?: never;
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
            header?: never;
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
    getCurrentStreak: {
        parameters: {
            query?: never;
            header?: never;
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
            header?: never;
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
    getUnreadCount: {
        parameters: {
            query?: never;
            header?: never;
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
            header?: never;
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
            header?: never;
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
            header?: never;
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
            header?: never;
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
    getTopics: {
        parameters: {
            query?: never;
            header?: never;
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
            header?: never;
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
    getExpressions: {
        parameters: {
            query?: never;
            header?: never;
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
            header?: never;
            path: {
                expressionId: number;
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
                    "*/*": components["schemas"]["ApiResponseExpressionPracticeResponse"];
                };
            };
        };
    };
    getOneExpressionToStartLearning: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                expressionId: number;
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
            header?: never;
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
    list: {
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
            header?: never;
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
    detail: {
        parameters: {
            query?: never;
            header?: never;
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
    list_1: {
        parameters: {
            query?: never;
            header?: never;
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
    list_2: {
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
            header?: never;
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
            header?: never;
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
            header?: never;
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
    list_3: {
        parameters: {
            query?: never;
            header?: never;
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
    withdraw: {
        parameters: {
            query?: never;
            header?: never;
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
}
