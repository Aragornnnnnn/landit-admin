// 생성된 OpenAPI 계약으로 레퍼럴 관리자 API를 호출한다.
import { api } from '@/shared/api/client';
import type { components } from '@/shared/api/referral-schema';
import type { ReferralInviterLimit } from '@/shared/api/schema-patch';

type Schema<K extends keyof components['schemas']> = components['schemas'][K];

type Complete<T> = T extends (infer U)[]
  ? Complete<U>[]
  : T extends object
    ? { [K in keyof T]-?: Complete<T[K]> }
    : T;
export type Stage = Complete<Schema<'ReferralStage'>>;
export type Product = Complete<Schema<'ReferralProduct'>>;
export type InviterLimit = ReferralInviterLimit;
export type Policy = Omit<
  Complete<Schema<'ReferralPolicy'>>,
  'inviterLimit'
> & {
  inviterLimit?: InviterLimit;
};
export type PolicyState = Omit<
  Complete<Schema<'ReferralPolicyState'>>,
  'policy'
> & {
  policy: Policy;
};
export type Reward = Complete<Schema<'ReferralReward'>>;
export type Billing = Complete<Schema<'ReferralBillingEvent'>>;
export type PolicyInput = Omit<
  Schema<'ReferralPolicyUpdateRequest'>,
  'inviterLimit'
> & {
  inviterLimit?: InviterLimit;
};
export type Page<T> = { items: T[]; hasNext: boolean };
const base = '/api/v1/admin';
export const referralsApi = {
  policy: () => api.get<PolicyState>(`${base}/referral-policy`),
  save: (body: PolicyInput) =>
    api.put<PolicyState>(`${base}/referral-policy`, body),
  processing: (body: Schema<'ReferralProcessingRequest'>) =>
    api.put<PolicyState>(`${base}/referral-processing`, body),
  history: (before?: number) =>
    api.get<Page<Policy>>(
      `${base}/referral-policy/history?size=20${before ? `&before=${before}` : ''}`,
    ),
  rewards: (status: string, before?: number) =>
    api.get<Page<Reward>>(
      `${base}/referral-rewards?size=20${status ? `&status=${encodeURIComponent(status)}` : ''}${before ? `&before=${before}` : ''}`,
    ),
  billing: (status: string, before?: number) =>
    api.get<Page<Billing>>(
      `${base}/referral-billing-events?size=20${status ? `&status=${encodeURIComponent(status)}` : ''}${before ? `&before=${before}` : ''}`,
    ),
  retry: (kind: 'rewards' | 'billing-events', id: number, reason: string) =>
    api.post<void>(`${base}/referral-${kind}/${id}/retry`, { reason }),
};
