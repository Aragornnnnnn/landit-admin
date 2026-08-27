// 편지 템플릿 적용 규칙 검증 — 유형·제목·본문이 통째로 바뀌고, 고정은 풀린다
import { describe, expect, it } from 'vitest';

import { EMPTY_LETTER_DRAFT } from './letter-draft';
import { applyLetterTemplate, LETTER_TEMPLATES } from './letter-templates';

const update = LETTER_TEMPLATES.find((one) => one.id === 'update')!;

describe('applyLetterTemplate', () => {
  it('유형·제목·미리보기·본문 블록이 템플릿 내용으로 바뀐다', () => {
    const next = applyLetterTemplate(EMPTY_LETTER_DRAFT, update);

    expect(next.type).toBe('UPDATE');
    expect(next.title.length).toBeGreaterThan(0);
    expect(next.contentBlocks.length).toBeGreaterThan(0);
  });

  it('고정은 푼다 — 템플릿으로 새로 쓰는 편지가 이전 편지의 고정을 물려받으면 안 된다', () => {
    const pinned = { ...EMPTY_LETTER_DRAFT, pinned: true };

    expect(applyLetterTemplate(pinned, update).pinned).toBe(false);
  });
});

describe('LETTER_TEMPLATES', () => {
  it('모든 템플릿은 제목과 본문 블록이 비어 있지 않다', () => {
    for (const one of LETTER_TEMPLATES) {
      expect(one.title.length).toBeGreaterThan(0);
      expect(one.contentBlocks.length).toBeGreaterThan(0);
    }
  });
});
