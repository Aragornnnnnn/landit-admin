// 편지 초안의 규칙 — 무엇을 담고, 무엇이 있어야 발행할 수 있고, 블록을 어떻게 옮기는지.
// 화면은 이 함수들을 부르기만 한다 (docs/screens/letters.md "새 편지 / 편집")
import type { LetterType } from './letter-filter';
import type { LetterItem } from './useLetterGroupQuery';

/**
 * 사용자 웹(letter-blocks.ts)이 아는 블록은 이 셋뿐이다. 모르는 블록은 사용자 화면에서 통째로 버려지므로
 * 어드민도 이 셋만 만든다 (docs/screens/letters.md "데이터")
 */
export type LetterBlock =
  | { type: 'PARAGRAPH'; text: string }
  | { type: 'IMAGE'; url: string; caption?: string }
  | { type: 'ORDERED_LIST'; items: string[] };

export type LetterBlockType = LetterBlock['type'];

export interface LetterDraft {
  type: LetterType;
  title: string;
  preview: string;
  pinned: boolean;
  contentBlocks: LetterBlock[];
}

/** 미리보기 문구는 목록 한 줄에 들어가야 한다 — FE 규칙(BE 제한 값은 미확정) */
export const PREVIEW_MAX = 60;

export const EMPTY_LETTER_DRAFT: LetterDraft = {
  type: 'NOTICE',
  title: '',
  preview: '',
  pinned: false,
  contentBlocks: [{ type: 'PARAGRAPH', text: '' }],
};

/** 서버가 준 편지를 초안으로 — 아는 블록만 남긴다 */
export function toLetterDraft(item: LetterItem): LetterDraft {
  return {
    type: item.type === 'UPDATE' ? 'UPDATE' : 'NOTICE',
    title: item.title ?? '',
    preview: item.preview ?? '',
    pinned: Boolean(item.pinned),
    contentBlocks: readBlocks(item.contentBlocks),
  };
}

export function readBlocks(raw: unknown): LetterBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap<LetterBlock>((value) => {
    const block = value as Partial<LetterBlock> & { type?: string };
    switch (block.type) {
      case 'PARAGRAPH':
        return [{ type: 'PARAGRAPH' as const, text: String(block.text ?? '') }];
      case 'IMAGE':
        return block.url
          ? [
              {
                type: 'IMAGE' as const,
                url: String(block.url),
                caption: block.caption ? String(block.caption) : undefined,
              },
            ]
          : [];
      case 'ORDERED_LIST':
        return [
          {
            type: 'ORDERED_LIST' as const,
            items: Array.isArray(block.items) ? block.items.map(String) : [],
          },
        ];
      default:
        return [];
    }
  });
}

/** 빈 블록 하나 — "+ 문단" 같은 버튼이 쓴다 */
export function emptyBlock(type: LetterBlockType): LetterBlock {
  switch (type) {
    case 'PARAGRAPH':
      return { type: 'PARAGRAPH', text: '' };
    case 'ORDERED_LIST':
      return { type: 'ORDERED_LIST', items: [''] };
    case 'IMAGE':
      return { type: 'IMAGE', url: '' };
  }
}

export function moveBlock(
  blocks: LetterBlock[],
  index: number,
  direction: -1 | 1,
): LetterBlock[] {
  const target = index + direction;
  if (target < 0 || target >= blocks.length) return blocks;
  const next = [...blocks];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function removeBlock(blocks: LetterBlock[], index: number) {
  return blocks.filter((_, at) => at !== index);
}

/** 발행하려면 제목과 내용이 있어야 한다 — 빈 편지가 사용자 편지함에 뜨면 되돌릴 수 없다 */
export function canPublishDraft(draft: LetterDraft): boolean {
  return draft.title.trim().length > 0 && hasContent(draft.contentBlocks);
}

function hasContent(blocks: LetterBlock[]): boolean {
  return blocks.some((block) => {
    if (block.type === 'PARAGRAPH') return block.text.trim().length > 0;
    if (block.type === 'ORDERED_LIST')
      return block.items.some((item) => item.trim().length > 0);
    return Boolean(block.url);
  });
}

/** 고정은 공지만 — 업데이트로 바꾸면 고정도 함께 풀린다 */
export function withType(draft: LetterDraft, type: LetterType): LetterDraft {
  return { ...draft, type, pinned: type === 'NOTICE' ? draft.pinned : false };
}

export const canPinDraft = (draft: LetterDraft) => draft.type === 'NOTICE';

export const isPreviewTooLong = (preview: string) =>
  preview.length > PREVIEW_MAX;

/** 저장할 게 남았나 — ← 목록에서 물을지 정하는 기준 */
export function isSameDraft(a: LetterDraft, b: LetterDraft): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** 저장 본문 — 빈 블록은 보내지 않는다. 목록 한 줄이 빈 줄로 남지 않게 preview도 다듬는다 */
export function toLetterRequest(draft: LetterDraft) {
  return {
    type: draft.type,
    title: draft.title.trim(),
    preview: draft.preview.trim(),
    pinned: draft.pinned,
    contentBlocks: draft.contentBlocks
      .map((block) =>
        block.type === 'ORDERED_LIST'
          ? { ...block, items: block.items.filter((item) => item.trim()) }
          : block,
      )
      .filter((block) =>
        block.type === 'PARAGRAPH'
          ? block.text.trim().length > 0
          : block.type === 'ORDERED_LIST'
            ? block.items.length > 0
            : Boolean(block.url),
      ),
  };
}
