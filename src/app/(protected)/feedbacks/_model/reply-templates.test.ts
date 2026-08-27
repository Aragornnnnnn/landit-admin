// 템플릿 채우기 규칙 검증 — 닉네임 치환과 빈 닉네임 폴백
import { describe, expect, it } from 'vitest';

import { fillTemplate, REPLY_TEMPLATES } from './reply-templates';

const template = {
  id: 'test',
  label: '테스트',
  title: '{닉네임}님께 드리는 답장',
  body: '{닉네임}님, 안녕하세요.\n{닉네임}님의 의견 감사해요.',
};

describe('fillTemplate', () => {
  it('본문·제목의 {닉네임}을 전부 실제 닉네임으로 바꾼다', () => {
    const filled = fillTemplate(template, '수진');

    expect(filled.title).toBe('수진님께 드리는 답장');
    expect(filled.bodyText).toBe(
      '수진님, 안녕하세요.\n수진님의 의견 감사해요.',
    );
  });

  it('닉네임이 없으면 "회원"으로 채운다 — 빈 칸으로 두면 문장이 깨진다', () => {
    expect(fillTemplate(template, undefined).title).toBe(
      '회원님께 드리는 답장',
    );
  });
});

describe('REPLY_TEMPLATES', () => {
  it('모든 템플릿은 제목과 본문이 비어 있지 않다 — 적용했는데 빈 칸이면 템플릿이 아니다', () => {
    for (const one of REPLY_TEMPLATES) {
      expect(one.title.length).toBeGreaterThan(0);
      expect(one.body.length).toBeGreaterThan(0);
      expect(one.label.length).toBeGreaterThan(0);
    }
  });
});
