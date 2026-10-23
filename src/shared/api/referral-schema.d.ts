// generate-referral-api-types.mjs가 LAN-696 OpenAPI에서 생성한 타입이다. 직접 편집하지 않는다.
export interface paths {
  '/api/v1/admin/referral-processing': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /** 레퍼럴 지급 보류 또는 재개 */
    put: operations['processing'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/referral-policy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 현재 레퍼럴 정책 */
    get: operations['current'];
    /**
     * 레퍼럴 정책 버전 생성
     * @description inviterLimit은 UNLIMITED(value=null), INVITE_COUNT(등록 순서상 최초 N명), TOTAL_AMOUNT(가입·결제 초대인 보상의 평생 누적 원 금액) 중 선택합니다. 생략하면 기존 한도를 유지합니다. 피초대인 보상은 한도에 포함하지 않습니다. 새 한도는 기존 관계의 미지급 보상에도 적용하고 잔여 금액만 부분 지급합니다. 기존 지급액은 보존하며 환불·복구로 한도가 초기화되지 않습니다.
     */
    put: operations['update_2'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/referrals/registration': {
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
    post: operations['register'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/referrals/registration/skip': {
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
    post: operations['skip'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/referrals/code': {
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
    post: operations['issue'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/referral-rewards/{id}/retry': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 지급 근거 재확인 */
    post: operations['retryReward'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/referral-billing-events/{id}/retry': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 결제 수신 재처리 */
    post: operations['retryEvent'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/referrals/rewards': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 내 레퍼럴 지급 근거
     * @description 통합 환급 적립에 반영한 지급 근거다. 별도 잔액이나 출금 기능이 아니다.
     */
    get: operations['rewards'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/referrals/preview': {
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
    get: operations['preview'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/referrals/me': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 내 레퍼럴 조회
     * @description 초대 성과와 조건만 반환한다. 통합 적립액과 환급 가능액은 /api/v1/me/rewards에서 조회한다.
     */
    get: operations['me'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/referral-rewards': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 관리자 레퍼럴 지급 내역 */
    get: operations['rewards_1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/referral-policy/history': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 레퍼럴 정책 변경 이력 */
    get: operations['history_2'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/referral-billing-events': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 레퍼럴 결제 수신 상태 */
    get: operations['events'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
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
      data?: components['schemas']['ReferralPolicyState'];
      /** @description 실패 오류 정보. 성공 시 null입니다. */
      error?: components['schemas']['ErrorResponse'];
    };
    ReferralPolicyState: {
      policy?: components['schemas']['ReferralPolicy'];
      /** Format: int64 */
      revision?: number;
      paused?: boolean;
    };
    ReferralPolicy: {
      /** Format: int64 */
      version?: number;
      signup?: components['schemas']['ReferralStage'];
      purchase?: components['schemas']['ReferralStage'];
      products?: components['schemas']['ReferralProduct'][];
      inviterLimit?: components['schemas']['ReferralInviterLimit'];
      /** Format: int64 */
      createdBy?: number;
      /** Format: date-time */
      createdAt?: string;
      reason?: string;
    };
    ReferralStage: {
      enabled?: boolean;
      /** @enum {string} */
      target: 'NONE' | 'INVITER' | 'INVITEE' | 'BOTH';
      /** Format: int64 */
      inviterWon?: number;
      /** Format: int64 */
      inviteeWon?: number;
    };
    ReferralProduct: {
      appId: string;
      store: string;
      productId: string;
      displayName: string;
      purchaseType: string;
    };
    /** @description 가입·결제의 초대인 보상에 합산 적용하는 평생 한도 */
    ReferralInviterLimit: {
      /** @enum {string} */
      type: 'UNLIMITED' | 'INVITE_COUNT' | 'TOTAL_AMOUNT';
      /** Format: int64 */
      value?: number;
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
    ReferralPolicyUpdateRequest: {
      /** Format: int64 */
      expectedRevision?: number;
      signup: components['schemas']['ReferralStage'];
      purchase: components['schemas']['ReferralStage'];
      products: components['schemas']['ReferralProduct'][];
      inviterLimit?: components['schemas']['ReferralInviterLimit'];
      reason: string;
    };
    ReferralRegistrationRequest: {
      code: string;
      /** Format: int64 */
      policyVersion: number;
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
      error?: components['schemas']['ErrorResponse'];
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
      error?: components['schemas']['ErrorResponse'];
    };
    ReferralRetryRequest: {
      reason: string;
    };
    /** @description 공통 API 응답 객체 */
    ApiResponsePageReferralReward: {
      /**
       * @description 요청 처리 성공 여부
       * @example true
       */
      success?: boolean;
      /** @description 성공 응답 데이터. 실패 시 null입니다. */
      data?: components['schemas']['PageReferralReward'];
      /** @description 실패 오류 정보. 성공 시 null입니다. */
      error?: components['schemas']['ErrorResponse'];
    };
    PageReferralReward: {
      items?: components['schemas']['ReferralReward'][];
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
      data?: components['schemas']['ReferralPreview'];
      /** @description 실패 오류 정보. 성공 시 null입니다. */
      error?: components['schemas']['ErrorResponse'];
    };
    ReferralPreview: {
      code?: string;
      /** Format: int64 */
      policyVersion?: number;
      signup?: components['schemas']['ReferralStage'];
      purchase?: components['schemas']['ReferralStage'];
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
      data?: components['schemas']['ReferralSummary'];
      /** @description 실패 오류 정보. 성공 시 null입니다. */
      error?: components['schemas']['ErrorResponse'];
    };
    ReferralSummary: {
      code?: string;
      currentOffer?: components['schemas']['ReferralPreview'];
      enrolledOffer?: components['schemas']['ReferralPreview'];
      /** Format: int64 */
      invitedCount?: number;
      /** Format: int64 */
      convertedCount?: number;
      /** @enum {string} */
      registrationStatus?: 'PENDING' | 'REGISTERED' | 'SKIPPED' | 'UNAVAILABLE';
    };
    /** @description 공통 API 응답 객체 */
    ApiResponsePageReferralPolicy: {
      /**
       * @description 요청 처리 성공 여부
       * @example true
       */
      success?: boolean;
      /** @description 성공 응답 데이터. 실패 시 null입니다. */
      data?: components['schemas']['PageReferralPolicy'];
      /** @description 실패 오류 정보. 성공 시 null입니다. */
      error?: components['schemas']['ErrorResponse'];
    };
    PageReferralPolicy: {
      items?: components['schemas']['ReferralPolicy'][];
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
      data?: components['schemas']['PageReferralBillingEvent'];
      /** @description 실패 오류 정보. 성공 시 null입니다. */
      error?: components['schemas']['ErrorResponse'];
    };
    PageReferralBillingEvent: {
      items?: components['schemas']['ReferralBillingEvent'][];
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
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  processing: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ReferralProcessingRequest'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['ApiResponseReferralPolicyState'];
        };
      };
    };
  };
  current: {
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
          '*/*': components['schemas']['ApiResponseReferralPolicyState'];
        };
      };
    };
  };
  update_2: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ReferralPolicyUpdateRequest'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['ApiResponseReferralPolicyState'];
        };
      };
    };
  };
  register: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ReferralRegistrationRequest'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['ApiResponseVoid'];
        };
      };
    };
  };
  skip: {
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
          '*/*': components['schemas']['ApiResponseVoid'];
        };
      };
    };
  };
  issue: {
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
          '*/*': components['schemas']['ApiResponseString'];
        };
      };
    };
  };
  retryReward: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ReferralRetryRequest'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['ApiResponseVoid'];
        };
      };
    };
  };
  retryEvent: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ReferralRetryRequest'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['ApiResponseVoid'];
        };
      };
    };
  };
  rewards: {
    parameters: {
      query?: {
        before?: number;
        size?: number;
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
          '*/*': components['schemas']['ApiResponsePageReferralReward'];
        };
      };
    };
  };
  preview: {
    parameters: {
      query: {
        code: string;
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
          '*/*': components['schemas']['ApiResponseReferralPreview'];
        };
      };
    };
  };
  me: {
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
          '*/*': components['schemas']['ApiResponseReferralSummary'];
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
          '*/*': components['schemas']['ApiResponsePageReferralReward'];
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
          '*/*': components['schemas']['ApiResponsePageReferralPolicy'];
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
          '*/*': components['schemas']['ApiResponsePageReferralBillingEvent'];
        };
      };
    };
  };
}
