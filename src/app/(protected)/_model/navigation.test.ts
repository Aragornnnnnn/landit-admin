// 내비 규칙 검증 — 활성 판정, 제목 선택, develop 전용 메뉴
import { describe, expect, it } from 'vitest';

import { isActiveNav, isDevelopServer, pageTitleFor } from './navigation';

describe('isActiveNav', () => {
  it('/는 정확히 일치할 때만 활성이다 — 다른 경로가 전부 /로 시작하므로', () => {
    expect(isActiveNav('/', '/')).toBe(true);
    expect(isActiveNav('/', '/feedbacks')).toBe(false);
  });

  it('하위 경로(상세)는 상위 메뉴를 활성으로 둔다', () => {
    expect(isActiveNav('/letters', '/letters/3')).toBe(true);
    expect(isActiveNav('/letters', '/lettersx')).toBe(false);
  });
});

describe('pageTitleFor', () => {
  it.each([
    ['/', '대시보드'],
    ['/feedbacks', '피드백'],
    // 하위 화면은 "어디의 무엇"인지로 읽힌다 (Figma "공지·업데이트 / 새 편지")
    ['/letters/new', '공지·업데이트 / 새 편지'],
    ['/letters/21', '공지·업데이트'],
    ['/users/12', '사용자'],
    ['/unknown', ''],
  ])('%s → "%s"', (pathname, title) => {
    expect(pageTitleFor(pathname)).toBe(title);
  });
});

describe('isDevelopServer', () => {
  it('호스트에 develop이 있으면 true, 없거나 비어 있으면 false', () => {
    expect(isDevelopServer('api-develop.landit.im')).toBe(true);
    expect(isDevelopServer('api.landit.im')).toBe(false);
    expect(isDevelopServer(undefined)).toBe(false);
  });
});
