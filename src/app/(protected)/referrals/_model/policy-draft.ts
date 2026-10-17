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
