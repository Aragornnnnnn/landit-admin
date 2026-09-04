import { describe, expect, it } from 'vitest';

import {
  blocksToMarkdown,
  canPublishDraft,
  EMPTY_LETTER_DRAFT,
  isSameDraft,
  readBlocks,
  toLetterRequest,
  withType,
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
      canPublishDraft(draft({ title: '점검 안내', body: '오늘 새벽에' })),
    ).toBe(true);
  });

  it('공백만 있는 건 내용이 아니다', () => {
    expect(canPublishDraft(draft({ title: '  ', body: ' ' }))).toBe(false);
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

describe('blocksToMarkdown', () => {
  it('블록 편집기 시절 편지를 마크다운 하나로 편다 — 문단은 빈 줄, 목록은 번호, 이미지는 ![캡션](주소)', () => {
    const markdown = blocksToMarkdown([
      { type: 'PARAGRAPH', text: '안녕하세요' },
      { type: 'ORDERED_LIST', items: ['하나', '  ', '둘'] },
      { type: 'IMAGE', url: 'https://img/a.png', caption: '설정 화면 (완료]' },
      { type: 'IMAGE', url: 'https://img/b.png' },
    ]);

    expect(markdown).toBe(
      '안녕하세요\n\n1. 하나\n2. 둘\n\n![설정 화면 완료](https://img/a.png)\n\n![](https://img/b.png)',
    );
  });

  it('빈 블록은 건너뛴다 — 빈 줄만 늘어난다', () => {
    expect(
      blocksToMarkdown([
        { type: 'PARAGRAPH', text: ' ' },
        { type: 'PARAGRAPH', text: '본문' },
      ]),
    ).toBe('본문');
  });
});

describe('toLetterRequest', () => {
  it('마크다운 전체를 PARAGRAPH 블록 하나에 담는다 — 앱이 그 안을 마크다운으로 그린다', () => {
    const body = toLetterRequest(
      draft({ title: ' 점검 안내 ', body: '## 안내\n\n1. 하나\n' }),
    );

    expect(body.title).toBe('점검 안내');
    expect(body.contentBlocks).toEqual([
      { type: 'PARAGRAPH', text: '## 안내\n\n1. 하나' },
    ]);
  });

  it('본문이 비면 블록을 보내지 않는다 — 사용자 화면에 빈 줄로 남는다', () => {
    expect(toLetterRequest(draft({ body: '  ' })).contentBlocks).toEqual([]);
  });
});

describe('isSameDraft', () => {
  it('한 글자만 달라도 저장할 게 남은 것으로 본다', () => {
    expect(isSameDraft(EMPTY_LETTER_DRAFT, draft({ title: 'ㄱ' }))).toBe(false);
    expect(isSameDraft(EMPTY_LETTER_DRAFT, draft())).toBe(true);
  });
});
