// 편지 목록 화면의 말 — 타입 선택지와 요약 문구 (docs/screens/letters.md "정확한 카피").
// 타입·상태 라벨 자체는 대시보드도 쓰므로 features/letter에 있다
import type {
  LetterStatus,
  LetterType,
} from '@/features/letter/api/letter-list';
import { LETTER_STATUS_LABEL } from '@/features/letter/model/letter-label';

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
