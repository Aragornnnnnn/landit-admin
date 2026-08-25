// 에디터 상단 버튼 조합 — 편지 상태가 정한다 (docs/screens/letters.md "화면 프레임 주석에서 보강되는 규칙").
// 임시저장: [임시저장 · 발행하기] / 발행됨: [저장 · 숨기기] / 숨김: [저장 · 다시 보이기]
import type { LetterAction } from './letter-actions';
import type { LetterStatus } from './letter-filter';

/** 아직 한 번도 저장하지 않은 새 편지 */
export type EditorStatus = LetterStatus | 'NEW';

export interface EditorButtons {
  /** 왼쪽 회색 버튼 — 내용만 저장한다 */
  save: string;
  /** 오른쪽 버튼 — 상태를 바꾼다. 없으면(새 편지 첫 저장 전) 비활성으로 그린다 */
  state: { label: string; action: LetterAction; destructive?: boolean };
}

export function editorButtons(status: EditorStatus): EditorButtons {
  switch (status) {
    case 'PUBLISHED':
      return {
        save: '저장',
        state: { label: '숨기기', action: 'hide', destructive: true },
      };
    case 'UNPUBLISHED':
      return {
        save: '저장',
        state: { label: '다시 보이기', action: 'unhide' },
      };
    default:
      return {
        save: '임시저장',
        state: { label: '발행하기', action: 'publish' },
      };
  }
}

/** 상단 안내 — 발행된 편지는 저장이 곧 반영이라 그 사실을 적는다 (프레임 1050:11122) */
export function editorNotice(
  status: EditorStatus,
  publishedAt: string | undefined,
  savedAt: string | undefined,
): string {
  if (status === 'PUBLISHED' && publishedAt)
    return `발행 ${publishedAt} · 저장하면 바로 반영돼요`;
  return savedAt ? `마지막 저장 ${savedAt}` : '';
}
