// 정책 입력의 대상·금액·상품 검증 분기를 확인한다.
import { describe, expect, it } from 'vitest';

import { normalizeStage, validatePolicy } from './policy-draft';

const stage = {
  enabled: true,
  target: 'BOTH' as const,
  inviterWon: 100,
  inviteeWon: 200,
};
const valid = {
  signup: stage,
  purchase: { ...stage, enabled: false },
  products: [],
  inviterLimit: { type: 'UNLIMITED' as const, value: null },
  reason: '혜택 변경',
};

describe('레퍼럴 정책 입력', () => {
  it('단계를 끄면 대상과 두 금액을 비운다', () => {
    expect(normalizeStage({ ...stage, enabled: false })).toEqual({
      enabled: false,
      target: 'NONE',
      inviterWon: 0,
      inviteeWon: 0,
    });
  });
  it('피초대인만 선택하면 초대인 금액을 0으로 보낸다', () => {
    expect(normalizeStage({ ...stage, target: 'INVITEE' }).inviterWon).toBe(0);
  });
  it.each([0, -1, 0.5, 1000001, NaN])(
    '선택한 금액 %s원이 유효하지 않으면 거부한다',
    (amount) => {
      expect(
        validatePolicy({ ...valid, signup: { ...stage, inviterWon: amount } }),
      ).toContain('금액');
    },
  );
  it('결제 보상을 켜고 상품이 없으면 거부한다', () => {
    expect(validatePolicy({ ...valid, purchase: stage })).toContain('상품');
  });
  it('가입 보상만 유효하면 저장할 수 있다', () => {
    expect(validatePolicy(valid)).toBeNull();
  });
});

it.each([-1, 0.5, NaN, null, Number.MAX_SAFE_INTEGER + 1])(
  '한도 %s가 유효하지 않으면 저장을 막는다',
  (value) => {
    expect(
      validatePolicy({
        ...valid,
        inviterLimit: { type: 'TOTAL_AMOUNT', value },
      }),
    ).toContain('한도');
  },
);
it('금액 한도 0은 지급 중단 설정으로 허용한다', () => {
  expect(
    validatePolicy({
      ...valid,
      inviterLimit: { type: 'TOTAL_AMOUNT', value: 0 },
    }),
  ).toBeNull();
});
it('초대 수 제한 정책은 새로 저장하지 못한다', () => {
  expect(
    validatePolicy({
      ...valid,
      inviterLimit: { type: 'INVITE_COUNT', value: 10 },
    }),
  ).toContain('금액');
});
