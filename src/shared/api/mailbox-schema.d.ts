// generate-mailbox-api-types.mjs로 실제 OpenAPI에서 생성한다. 손으로 수정하지 않는다.
export type paths = Record<string, never>;
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /** @description 편지함 어드민 공지·업데이트 생성 요청 */
    AdminMailboxLetterCreateRequest: {
      /**
       * @description 편지 유형
       * @example NOTICE
       * @enum {string}
       */
      type: 'NOTICE' | 'UPDATE' | 'REPLY' | 'DIRECT';
      /** @description 편지 제목 */
      title: string;
      /** @description 구조화된 본문 블록 */
      contentBlocks: unknown[];
      /** @description 목록 미리보기 */
      preview: string;
      /** @description 숨길 사용자 ID. 빈 배열은 숨김 해제 */
      excludedUserIds?: number[];
      /** @description 숨길 구독 유형. 빈 배열은 숨김 해제 */
      excludedAudiences?: (
        | 'MONTHLY'
        | 'YEARLY'
        | 'PASS_100_DAYS'
        | 'TRIAL'
        | 'NONE'
        | 'ADMIN_GRANTED'
        | 'OTHER'
      )[];
      /**
       * @description 기본 콘텐츠 언어. 생성 시 기본값 ko, 수정 시 생략하면 유지
       * @example ko
       * @enum {string}
       */
      locale?: 'ko' | 'ja';
      /** @description 기본 언어 외 추가 콘텐츠. 생략하면 유지, 빈 배열은 제거. 기본 언어와 중복 불가 */
      translations?: components['schemas']['AdminMailboxLetterTranslation'][];
    };
    /** @description 편지함 어드민 공지·업데이트 수정 요청 */
    AdminMailboxLetterPatchRequest: {
      /**
       * @description 편지 유형
       * @enum {string}
       */
      type?: 'NOTICE' | 'UPDATE' | 'REPLY' | 'DIRECT';
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
      publicationStatus?: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
      /** @description 상단 고정 여부 */
      pinned?: boolean;
      /** @description 숨길 사용자 ID. 빈 배열은 숨김 해제 */
      excludedUserIds?: number[];
      /** @description 숨길 구독 유형. 빈 배열은 숨김 해제 */
      excludedAudiences?: (
        | 'MONTHLY'
        | 'YEARLY'
        | 'PASS_100_DAYS'
        | 'TRIAL'
        | 'NONE'
        | 'ADMIN_GRANTED'
        | 'OTHER'
      )[];
      /**
       * @description 기본 콘텐츠 언어. 생성 시 기본값 ko, 수정 시 생략하면 유지
       * @example ko
       * @enum {string}
       */
      locale?: 'ko' | 'ja';
      /** @description 기본 언어 외 추가 콘텐츠. 생략하면 유지, 빈 배열은 제거. 기본 언어와 중복 불가 */
      translations?: components['schemas']['AdminMailboxLetterTranslation'][];
    };
    /** @description 편지함 어드민 공지·업데이트 응답 */
    AdminMailboxLetterResponse: {
      /** Format: int64 */
      letterId?: number;
      /** @enum {string} */
      type?: 'NOTICE' | 'UPDATE' | 'REPLY' | 'DIRECT';
      title?: string;
      /** @description 구조화된 본문 블록 */
      contentBlocks?: unknown[];
      preview?: string;
      /** @enum {string} */
      publicationStatus?: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
      pinned?: boolean;
      /** Format: date-time */
      publishedAt?: string;
      /** Format: date-time */
      createdAt?: string;
      /** Format: date-time */
      updatedAt?: string;
      excludedUserIds?: number[];
      excludedAudiences?: (
        | 'MONTHLY'
        | 'YEARLY'
        | 'PASS_100_DAYS'
        | 'TRIAL'
        | 'NONE'
        | 'ADMIN_GRANTED'
        | 'OTHER'
      )[];
      /** @enum {string} */
      locale?: 'ko' | 'ja';
      translations?: components['schemas']['AdminMailboxLetterTranslation'][];
    };
    /** @description 편지함 어드민 공지·업데이트 페이지 응답 */
    AdminMailboxLetterListResponse: {
      items?: components['schemas']['AdminMailboxLetterResponse'][];
      /** Format: int32 */
      page?: number;
      /** Format: int32 */
      size?: number;
      /** Format: int64 */
      totalElements?: number;
      /** Format: int32 */
      totalPages?: number;
    };
    /** @description 기본 언어와 함께 게시할 추가 언어 콘텐츠 */
    AdminMailboxLetterTranslation: {
      /**
       * @description 추가 언어
       * @example ja
       * @enum {string}
       */
      locale: 'ko' | 'ja';
      title: string;
      contentBlocks: unknown[];
      preview: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
