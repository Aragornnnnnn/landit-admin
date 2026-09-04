// 행 ⋯ 메뉴에 무엇이 뜨고 무엇을 보내는지 — 상태·타입만 보고 정한다 (docs/screens/letters.md "행 ⋯ 메뉴").
// 화면은 이 목록을 그리기만 한다. 무엇이 되돌릴 수 없는 일인지도 여기서 말한다
import type {
  LetterItem,
  LetterStatus,
} from '@/features/letter/api/letter-list';

export type LetterAction = 'publish' | 'hide' | 'unhide' | 'pin' | 'unpin';

export interface LetterMenuItem {
  action: LetterAction;
  label: string;
  /** 사용자에게 보이는 것을 없애는 행동 — 빨갛게 그린다 */
  destructive?: boolean;
  /** 못 고르는 이유. 있으면 항목은 비활성 */
  disabledReason?: string;
}

/** 되돌릴 수 없거나 사용자 편지함이 바로 바뀌는 행동만 한 번 묻는다. 고정은 순서만 바꾸므로 묻지 않는다 */
export const LETTER_CONFIRM: Partial<
  Record<LetterAction, { title: string; description: string; confirm: string }>
> = {
  publish: {
    title: '지금 발행할까요?',
    description: '사용자 편지함에 바로 나타나요.',
    confirm: '발행하기',
  },
  hide: {
    title: '편지를 숨길까요?',
    description:
      '사용자 편지함에서 바로 사라져요. 언제든 다시 보이게 할 수 있어요.',
    confirm: '숨기기',
  },
  unhide: {
    title: '다시 보이게 할까요?',
    description: '사용자 편지함에 바로 나타나요.',
    confirm: '다시 보이기',
  },
};

export const LETTER_ACTION_DONE: Record<LetterAction, string> = {
  publish: '발행했어요',
  hide: '숨겼어요',
  unhide: '다시 보이게 했어요',
  pin: '위로 고정했어요',
  unpin: '고정을 해제했어요',
};

/** 이 행에서 할 수 있는 일 — 프레임의 상태별 메뉴 그대로 */
export function letterMenuItems(item: LetterItem): LetterMenuItem[] {
  switch (item.publicationStatus) {
    case 'PUBLISHED':
      return [
        pinItem(item),
        { action: 'hide', label: '숨기기', destructive: true },
      ];
    case 'DRAFT':
      return [{ action: 'publish', label: '발행하기' }];
    case 'UNPUBLISHED':
      return [{ action: 'unhide', label: '다시 보이기' }];
    default:
      return [];
  }
}

// 고정은 공지만 — 업데이트는 왜 못 하는지 자리에서 말해 준다 (스펙의 툴팁 문구를 항목 안에 둔다)
function pinItem(item: LetterItem): LetterMenuItem {
  const pinned = Boolean(item.pinned);
  return {
    action: pinned ? 'unpin' : 'pin',
    label: pinned ? '고정 해제' : '고정',
    disabledReason:
      item.type === 'NOTICE' ? undefined : '공지만 고정할 수 있어요',
  };
}

/** 그 일을 하고 나면 편지가 어떤 상태가 되나 — 고정은 상태를 바꾸지 않는다 */
export function statusAfter(
  action: LetterAction,
  current: LetterStatus,
): LetterStatus {
  if (action === 'publish' || action === 'unhide') return 'PUBLISHED';
  if (action === 'hide') return 'UNPUBLISHED';
  return current;
}

/** PATCH 본문 — 부분 수정이라 바꿀 것만 보낸다 */
export function letterActionPatch(action: LetterAction) {
  switch (action) {
    case 'publish':
    case 'unhide':
      return { publicationStatus: 'PUBLISHED' as const };
    case 'hide':
      return { publicationStatus: 'UNPUBLISHED' as const };
    case 'pin':
      return { pinned: true };
    case 'unpin':
      return { pinned: false };
  }
}
