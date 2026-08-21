// 편지 화면의 말과 점 색 — 화면 문구는 전부 여기서 나온다 (docs/screens/letters.md "정확한 카피")
import type { LetterStatus, LetterType } from './letter-filter';

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

export const LETTER_TYPE_OPTIONS: {
  value: LetterType | 'ALL';
  label: string;
}[] = [
  { value: 'ALL', label: '타입: 전체' },
  { value: 'NOTICE', label: '공지' },
  { value: 'UPDATE', label: '업데이트' },
  { value: 'REPLY', label: '답장' },
];

/**
 * 타이틀 아래 한 줄 — "발행됨 4 · 임시저장 2".
 * 숨김은 넣지 않는다. 사용자에게 보이지 않는 편지라 지금 할 일의 크기를 말해 주지 못한다 (프레임 기준)
 */
export function letterSummaryLabel(
  counts: { status: LetterStatus; count: number | undefined }[],
): string {
  return counts
    .filter(
      (entry) => entry.status !== 'UNPUBLISHED' && entry.count !== undefined,
    )
    .map((entry) => `${LETTER_STATUS_LABEL[entry.status]} ${entry.count}`)
    .join(' · ');
}

/** 그룹 카드 제목 옆 숫자 — "4 · 고정 1". 고정이 없으면 건수만 */
export function letterGroupCountLabel(count: number, pinned: number): string {
  return pinned > 0 ? `${count} · 고정 ${pinned}` : `${count}`;
}
