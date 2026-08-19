// 관리자 아님 안내 전달 검증 — 이메일은 마스킹해서만 저장하고, 한 번 읽으면 지운다
import { beforeEach, describe, expect, it } from 'vitest';

import {
  maskEmail,
  readForbiddenNotice,
  writeForbiddenNotice,
} from './forbidden-notice';

describe('maskEmail', () => {
  it.each([
    ['sujin@gmail.com', 'suj***@gmail.com'],
    ['ab@x.io', 'a***@x.io'],
    ['a@x.io', 'a***@x.io'],
  ])('%s → %s — 앞 몇 글자만 남기고 가린다', (email, masked) => {
    expect(maskEmail(email)).toBe(masked);
  });

  it('이메일이 없으면 null', () => {
    expect(maskEmail(null)).toBeNull();
    expect(maskEmail('not-an-email')).toBeNull();
  });
});

describe('forbiddenNotice', () => {
  beforeEach(() => sessionStorage.clear());

  it('쓴 뒤 읽으면 마스킹된 이메일이 오고, 두 번째 읽기에선 없다', () => {
    writeForbiddenNotice('sujin@gmail.com');

    expect(readForbiddenNotice()).toEqual({ maskedEmail: 'suj***@gmail.com' });
    expect(readForbiddenNotice()).toBeNull();
  });

  it('저장소에는 원본 이메일이 남지 않는다', () => {
    writeForbiddenNotice('sujin@gmail.com');

    expect(JSON.stringify(Object.values(sessionStorage))).not.toContain(
      'sujin@gmail.com',
    );
  });
});
