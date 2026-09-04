import { describe, expect, it } from 'vitest';

import { editorButtons, editorNotice } from './letter-editor-buttons';

describe('editorButtons', () => {
  it('상태마다 버튼 조합이 다르다 (프레임 주석)', () => {
    expect(editorButtons('NEW')).toMatchObject({
      save: '임시저장',
      state: { label: '발행하기' },
    });
    expect(editorButtons('DRAFT')).toMatchObject({
      save: '임시저장',
      state: { label: '발행하기' },
    });
    expect(editorButtons('PUBLISHED')).toMatchObject({
      save: '저장',
      state: { label: '숨기기', destructive: true },
    });
    expect(editorButtons('UNPUBLISHED')).toMatchObject({
      save: '저장',
      state: { label: '다시 보이기' },
    });
  });
});

describe('editorNotice', () => {
  it('발행된 편지는 저장이 곧 반영이라는 걸 먼저 말한다', () => {
    expect(editorNotice('PUBLISHED', '8.18 09:00', '14:20')).toBe(
      '발행 8.18 09:00 · 저장하면 바로 반영돼요',
    );
  });

  it('그 밖에는 마지막 저장 시각. 아직 저장 전이면 아무 말도 하지 않는다', () => {
    expect(editorNotice('DRAFT', undefined, '14:20')).toBe('마지막 저장 14:20');
    expect(editorNotice('NEW', undefined, undefined)).toBe('');
  });
});
