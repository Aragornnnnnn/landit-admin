// 정책 입력을 서버의 대상·금액 제약에 맞게 검증하고 정규화한다.
import type { Product, Stage } from '../_api/referrals';

export type PolicyDraft = {
  signup: Stage;
  purchase: Stage;
  products: Product[];
  reason: string;
};
export function normalizeStage(stage: Stage): Stage {
  if (!stage.enabled)
    return { enabled: false, target: 'NONE', inviterWon: 0, inviteeWon: 0 };
  return {
    ...stage,
    inviterWon: stage.target === 'INVITEE' ? 0 : stage.inviterWon,
    inviteeWon: stage.target === 'INVITER' ? 0 : stage.inviteeWon,
  };
}
export function validatePolicy(draft: PolicyDraft): string | null {
  for (const value of [draft.signup, draft.purchase]) {
    const stage = normalizeStage(value);
    if (!stage.enabled) continue;
    const amounts =
      stage.target === 'INVITER'
        ? [stage.inviterWon]
        : stage.target === 'INVITEE'
          ? [stage.inviteeWon]
          : [stage.inviterWon, stage.inviteeWon];
    if (
      stage.target === 'NONE' ||
      amounts.some((n) => !Number.isInteger(n) || n < 1 || n > 1000000)
    )
      return '선택한 대상의 금액은 1~1,000,000원 정수로 입력해 주세요.';
  }
  if (!draft.reason.trim() || draft.reason.length > 500)
    return '변경 사유를 1~500자로 입력해 주세요.';
  if (draft.purchase.enabled && draft.products.length === 0)
    return '결제 대상 상품을 추가해 주세요.';
  if (draft.products.length > 50)
    return '대상 상품은 최대 50개까지 설정할 수 있어요.';
  const keys = draft.products.map(
    (p) => `${p.appId.trim()}|${p.store}|${p.productId.trim()}`,
  );
  if (
    draft.products.some(
      (p) =>
        !p.displayName.trim() ||
        p.displayName.length > 100 ||
        !p.appId.trim() ||
        !p.productId.trim() ||
        p.appId.length > 255 ||
        p.productId.length > 255,
    ) ||
    new Set(keys).size !== keys.length
  )
    return '상품 ID를 입력하고 중복 상품을 제거해 주세요.';
  return null;
}
