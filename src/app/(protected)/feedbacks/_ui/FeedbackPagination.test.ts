// 페이지 버튼 접기 규칙 — 첫·끝은 항상 남기고 현재 주변만 보여준다 (Figma: 7페이지에서 "1 2 3 … 7")
import { describe, expect, it } from 'vitest';

import { visiblePages } from './FeedbackPagination';

describe('visiblePages', () => {
  it('페이지가 적으면 전부 보여준다', () => {
    expect(visiblePages(0, 4)).toEqual([0, 1, 2, 3]);
  });

  it('첫 페이지에서는 앞 세 개와 끝 페이지를 보여준다', () => {
    expect(visiblePages(0, 7)).toEqual([0, 1, 2, null, 6]);
  });

  it('가운데에서는 양쪽을 접는다', () => {
    expect(visiblePages(4, 9)).toEqual([0, null, 3, 4, 5, null, 8]);
  });

  it('마지막 페이지에서는 끝 세 개를 보여준다', () => {
    expect(visiblePages(8, 9)).toEqual([0, null, 6, 7, 8]);
  });
});
