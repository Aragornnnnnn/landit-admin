// 템플릿 브라우저 저장 규칙 검증 — 깨진 저장값은 기본값으로, 저장·복원 왕복
import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearStoredTemplates,
  readStoredTemplates,
  REPLY_TEMPLATES_STORAGE_KEY,
  writeStoredTemplates,
} from './editable-reply-templates';
import { REPLY_TEMPLATES } from './reply-templates';

beforeEach(() => localStorage.clear());

describe('readStoredTemplates', () => {
  it('저장된 게 없으면 공식 기본값을 준다', () => {
    expect(readStoredTemplates(localStorage)).toEqual(REPLY_TEMPLATES);
  });

  it('저장한 템플릿을 그대로 되돌려준다', () => {
    const custom = [
      { id: 'one', label: '커스텀', title: '제목', body: '본문' },
    ];
    writeStoredTemplates(localStorage, custom);

    expect(readStoredTemplates(localStorage)).toEqual(custom);
  });

  it.each([
    ['JSON이 아님', 'not-json'],
    ['배열이 아님', '{"a":1}'],
    ['빈 배열', '[]'],
    ['필드가 문자열이 아님', '[{"id":1,"label":2,"title":3,"body":4}]'],
  ])(
    '깨진 저장값(%s)이면 기본값으로 되돌린다 — 화면이 빈 칩으로 깨지면 안 된다',
    (_k, raw) => {
      localStorage.setItem(REPLY_TEMPLATES_STORAGE_KEY, raw);

      expect(readStoredTemplates(localStorage)).toEqual(REPLY_TEMPLATES);
    },
  );
});

describe('clearStoredTemplates', () => {
  it('복원하면 저장값이 지워지고 기본값으로 돌아간다', () => {
    writeStoredTemplates(localStorage, [
      { id: 'one', label: '커스텀', title: '제목', body: '본문' },
    ]);

    clearStoredTemplates(localStorage);

    expect(readStoredTemplates(localStorage)).toEqual(REPLY_TEMPLATES);
  });
});
