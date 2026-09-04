import { describe, expect, it } from 'vitest';

import { feedbackOpenPath } from './feedback-open-path';

describe('feedbackOpenPath', () => {
  it('open만 싣는다 — 상세가 단건 조회로 열려 목록 필터와 무관하다 (BE LAN-374)', () => {
    expect(feedbackOpenPath({ feedbackId: 7, status: 'COMPLETED' })).toBe(
      '/feedbacks?open=7',
    );
    expect(feedbackOpenPath({ feedbackId: 3 })).toBe('/feedbacks?open=3');
  });
});
