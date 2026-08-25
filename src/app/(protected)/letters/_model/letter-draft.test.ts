import { describe, expect, it } from 'vitest';

import {
  canPublishDraft,
  EMPTY_LETTER_DRAFT,
  isSameDraft,
  moveBlock,
  readBlocks,
  toLetterRequest,
  withType,
  type LetterBlock,
  type LetterDraft,
} from './letter-draft';

const draft = (patch: Partial<LetterDraft> = {}): LetterDraft => ({
  ...EMPTY_LETTER_DRAFT,
  ...patch,
});

describe('readBlocks', () => {
  it('사용자 웹이 아는 세 종류만 남긴다 — 모르는 블록은 사용자 화면에서 통째로 버려진다', () => {
    const blocks = readBlocks([
      { type: 'PARAGRAPH', text: '안녕하세요' },
      { type: 'VIDEO', url: 'x' },
      { type: 'ORDERED_LIST', items: ['하나', '둘'] },
    ]);
    expect(blocks.map((block) => block.type)).toEqual([
      'PARAGRAPH',
      'ORDERED_LIST',
    ]);
  });

  it('url 없는 이미지는 버린다 — 사용자 화면에 깨진 이미지가 남는다', () => {
    expect(readBlocks([{ type: 'IMAGE' }])).toEqual([]);
  });

  it('배열이 아니면 빈 목록', () => {
    expect(readBlocks(undefined)).toEqual([]);
  });
});

describe('canPublishDraft', () => {
  it('제목과 내용이 모두 있어야 발행할 수 있다', () => {
    expect(canPublishDraft(EMPTY_LETTER_DRAFT)).toBe(false);
    expect(canPublishDraft(draft({ title: '점검 안내' }))).toBe(false);
    expect(
      canPublishDraft(
        draft({
          title: '점검 안내',
          contentBlocks: [{ type: 'PARAGRAPH', text: '오늘 새벽에' }],
        }),
      ),
    ).toBe(true);
  });

  it('공백만 있는 건 내용이 아니다', () => {
    expect(
      canPublishDraft(
        draft({
          title: '  ',
          contentBlocks: [{ type: 'PARAGRAPH', text: ' ' }],
        }),
      ),
    ).toBe(false);
  });
});

describe('withType', () => {
  it('업데이트로 바꾸면 고정이 함께 풀린다 — 고정은 공지만 가능하다', () => {
    expect(withType(draft({ pinned: true }), 'UPDATE').pinned).toBe(false);
  });

  it('공지로 되돌려도 고정이 저절로 켜지진 않는다', () => {
    expect(withType(draft({ pinned: false }), 'NOTICE').pinned).toBe(false);
  });
});

describe('moveBlock', () => {
  const blocks: LetterBlock[] = [
    { type: 'PARAGRAPH', text: '첫' },
    { type: 'PARAGRAPH', text: '둘' },
  ];

  it('자리를 바꾼다', () => {
    expect(moveBlock(blocks, 0, 1).map((block) => block.type)).toHaveLength(2);
    expect((moveBlock(blocks, 0, 1)[0] as { text: string }).text).toBe('둘');
  });

  it('끝에서 더 밀면 그대로 둔다', () => {
    expect(moveBlock(blocks, 0, -1)).toBe(blocks);
    expect(moveBlock(blocks, 1, 1)).toBe(blocks);
  });
});

describe('toLetterRequest', () => {
  it('빈 블록은 보내지 않는다 — 사용자 화면에 빈 줄로 남는다', () => {
    const body = toLetterRequest(
      draft({
        title: ' 점검 안내 ',
        contentBlocks: [
          { type: 'PARAGRAPH', text: '' },
          { type: 'PARAGRAPH', text: '오늘 새벽' },
          { type: 'ORDERED_LIST', items: ['하나', '  '] },
        ],
      }),
    );
    expect(body.title).toBe('점검 안내');
    expect(body.contentBlocks).toEqual([
      { type: 'PARAGRAPH', text: '오늘 새벽' },
      { type: 'ORDERED_LIST', items: ['하나'] },
    ]);
  });
});

describe('isSameDraft', () => {
  it('한 글자만 달라도 저장할 게 남은 것으로 본다', () => {
    expect(isSameDraft(EMPTY_LETTER_DRAFT, draft({ title: 'ㄱ' }))).toBe(false);
    expect(isSameDraft(EMPTY_LETTER_DRAFT, draft())).toBe(true);
  });
});
