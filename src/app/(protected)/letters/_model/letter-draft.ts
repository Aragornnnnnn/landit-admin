// 편지 초안의 규칙 — 무엇을 담고, 무엇이 있어야 발행할 수 있고, 서버 블록과 마크다운 본문을 어떻게 오가는지.
// 화면은 이 함수들을 부르기만 한다 (docs/screens/letters.md "새 편지 / 편집")
import { imageMarkdown } from '@/features/markdown-editor/model/markdown-image-paste';

import type { LetterType } from './letter-filter';
import type { LetterItem } from './useLetterGroupQuery';

/**
 * 사용자 웹(letter-blocks.ts)이 아는 블록은 이 셋뿐이다. 모르는 블록은 사용자 화면에서 통째로 버려지므로
 * 어드민도 이 셋만 읽는다. 새로 저장할 땐 PARAGRAPH 하나에 마크다운 전체를 담는다 (docs/screens/letters.md "데이터")
 */
export type LetterBlock =
  | { type: 'PARAGRAPH'; text: string }
  | { type: 'IMAGE'; url: string; caption?: string }
  | { type: 'ORDERED_LIST'; items: string[] };

export interface LetterDraft {
  type: LetterType;
  title: string;
  preview: string;
  pinned: boolean;
  /** 본문 마크다운 — 저장할 때 PARAGRAPH 블록 하나로 감싼다 */
  body: string;
}

/** 미리보기 문구는 목록 한 줄에 들어가야 한다 — FE 규칙(BE 제한 값은 미확정) */
export const PREVIEW_MAX = 60;

export const EMPTY_LETTER_DRAFT: LetterDraft = {
  type: 'NOTICE',
  title: '',
  preview: '',
  pinned: false,
  body: '',
};

/** 서버가 준 편지를 초안으로 — 아는 블록만 남기고 마크다운 한 덩어리로 편다 */
export function toLetterDraft(item: LetterItem): LetterDraft {
  return {
    type: item.type === 'UPDATE' ? 'UPDATE' : 'NOTICE',
    title: item.title ?? '',
    preview: item.preview ?? '',
    pinned: Boolean(item.pinned),
    body: blocksToMarkdown(readBlocks(item.contentBlocks)),
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

/**
 * 블록 배열을 마크다운 하나로 — 블록 편집기 시절 저장된 편지와 공식 템플릿을 새 에디터에 올리는 길.
 * 문단은 빈 줄로 잇고, 번호 목록은 "1. 항목", 이미지는 "![캡션](주소)"가 된다. 사용자 앱이 마크다운을 그리므로 모양이 유지된다
 */
export function blocksToMarkdown(blocks: LetterBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === 'PARAGRAPH') return block.text;
      if (block.type === 'ORDERED_LIST')
        return block.items
          .filter((item) => item.trim())
          .map((item, index) => `${index + 1}. ${item}`)
          .join('\n');
      // 캡션에 대괄호·소괄호가 있으면 문법이 깨진다 — 붙여넣기 경로와 같은 규칙으로 뺀다
      return imageMarkdown(block.caption ?? '', block.url);
    })
    .filter((text) => text.trim().length > 0)
    .join('\n\n');
}

/** 발행하려면 제목과 내용이 있어야 한다 — 빈 편지가 사용자 편지함에 뜨면 되돌릴 수 없다 */
export function canPublishDraft(draft: LetterDraft): boolean {
  return draft.title.trim().length > 0 && draft.body.trim().length > 0;
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

/** 저장 본문 — 마크다운 전체를 PARAGRAPH 블록 하나에 담는다. 비면 블록을 보내지 않는다. 목록 한 줄이 빈 줄로 남지 않게 preview도 다듬는다 */
export function toLetterRequest(draft: LetterDraft) {
  const body = draft.body.trim();
  return {
    type: draft.type,
    title: draft.title.trim(),
    preview: draft.preview.trim(),
    pinned: draft.pinned,
    contentBlocks: body ? [{ type: 'PARAGRAPH' as const, text: body }] : [],
  };
}
