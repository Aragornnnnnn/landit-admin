// 편지 타입·상태를 사람이 읽는 말로 (docs/screens/letters.md "정확한 카피"). 편지 화면과 대시보드가 같이 쓴다
import type { LetterStatus, LetterType } from '../api/letter-list';

export const LETTER_TYPE_LABEL: Record<LetterType, string> = {
  NOTICE: '공지',
  UPDATE: '업데이트',
  REPLY: '답장',
};

export const LETTER_STATUS_LABEL: Record<LetterStatus, string> = {
  DRAFT: '임시저장',
  PUBLISHED: '발행됨',
  UNPUBLISHED: '숨김',
};

/** 상태 점 — 발행됨은 끝난 일(초록), 임시저장은 아직 진행 중(오렌지). 숨김은 점이 없다 */
export const LETTER_STATUS_DOT: Record<
  LetterStatus,
  'progress' | 'done' | undefined
> = {
  DRAFT: 'progress',
  PUBLISHED: 'done',
  UNPUBLISHED: undefined,
};
