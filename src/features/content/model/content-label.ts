// 배치·Day 상태와 캐릭터 비율을 사람이 읽는 말로 (docs/screens/content-batches.md "상태"). 목록·배치 상세·Day 상세가 같이 쓴다
import type { ChipDot } from '@/shared/ui/StatusChip';

import {
  CONTENT_CHARACTERS,
  type CharacterRatio,
  type ContentBatch,
  type ContentBatchStatus,
  type ContentDraftStatus,
} from '../api/content-batch';
import type { ContentLevel } from '../api/draft-payload';

export const BATCH_STATUS_LABEL: Record<ContentBatchStatus, string> = {
  REQUESTED: '접수',
  LINEUP_GENERATING: '라인업 생성 중',
  LINEUP_READY: '라인업 확인',
  GENERATING: '생성 중',
  REVIEW_READY: '검수 대기',
  APPROVED: '승인',
  ASSETS_GENERATING: '에셋 생성 중',
  ASSETS_REVIEW_READY: '에셋 검수 대기',
  ASSETS_READY: '에셋 준비',
  PUBLISHED: '발행',
  FAILED: '실패',
};

/** 점 — 담당자 차례는 오렌지, 서버가 일하는 중은 검정, 끝난 것은 초록. 실패는 점 없이 글자를 빨갛게 */
export const BATCH_STATUS_DOT: Record<ContentBatchStatus, ChipDot | undefined> =
  {
    REQUESTED: 'scheduled',
    LINEUP_GENERATING: 'scheduled',
    LINEUP_READY: 'progress',
    GENERATING: 'scheduled',
    REVIEW_READY: 'progress',
    APPROVED: 'done',
    ASSETS_GENERATING: 'scheduled',
    ASSETS_REVIEW_READY: 'progress',
    ASSETS_READY: 'done',
    PUBLISHED: 'done',
    FAILED: undefined,
  };

/** 상태 Select 순서 — 흐름 순, 실패는 끝에 */
export const BATCH_STATUS_ORDER = Object.keys(
  BATCH_STATUS_LABEL,
) as ContentBatchStatus[];

export const DRAFT_STATUS_LABEL: Record<ContentDraftStatus, string> = {
  LINEUP: '라인업',
  GENERATING: '생성 중',
  REVIEW_READY: '미검토',
  OK: 'OK',
  NEEDS_FIX: '수정',
  APPROVED: '승인',
  PUBLISHED: '발행',
  FAILED: '실패',
};

export const DRAFT_STATUS_DOT: Record<ContentDraftStatus, ChipDot | undefined> =
  {
    LINEUP: undefined,
    GENERATING: 'scheduled',
    REVIEW_READY: 'progress',
    OK: 'done',
    NEEDS_FIX: 'progress',
    APPROVED: 'done',
    PUBLISHED: 'done',
    FAILED: undefined,
  };

/** 질문 참조·열 머리에 쓰는 짧은 이름 — Figma는 L1 · L2 · L4 */
export const LEVEL_SHORT: Record<ContentLevel, string> = {
  LEVEL_1: 'L1',
  LEVEL_2_TO_3: 'L2',
  LEVEL_4_TO_5: 'L4',
};

export const LEVEL_LABEL: Record<ContentLevel, string> = {
  LEVEL_1: '레벨 1',
  LEVEL_2_TO_3: '레벨 2~3',
  LEVEL_4_TO_5: '레벨 4~5',
};

/** "chloe 4 · marco 3 · teddy 3" — 빠진 캐릭터는 0 */
export function formatCharacterRatio(ratio: Partial<CharacterRatio>): string {
  return CONTENT_CHARACTERS.map((name) => `${name} ${ratio[name] ?? 0}`).join(
    ' · ',
  );
}

/** 목록의 사유/비고 열 — 담당자가 지금 할 일 또는 실패 사유. Day별 진행 수는 목록 응답에 없어 적지 않는다 */
export function batchRemark(batch: ContentBatch): string {
  switch (batch.status) {
    case 'FAILED':
      return batch.errorMessage ?? '실패';
    case 'LINEUP_READY':
      return '라인업 확인 대기';
    case 'REVIEW_READY':
      return '검수 대기';
    case 'APPROVED':
      return '에셋 생성 대기';
    default:
      return '—';
  }
}
