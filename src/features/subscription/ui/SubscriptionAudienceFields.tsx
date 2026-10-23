'use client';

// 공지와 팝업이 같은 구독 유형 선택지와 라벨을 사용하도록 한다.
import type { Schema } from '@/shared/api/schema-patch';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';

export type SubscriptionAudience = NonNullable<
  Schema<'AdminMailboxLetterCreateRequest'>['excludedAudiences']
>[number];
export const SUBSCRIPTION_AUDIENCE_LABELS: Record<
  SubscriptionAudience,
  string
> = {
  MONTHLY: '월간',
  YEARLY: '연간',
  PASS_100_DAYS: '100일 이용권',
  TRIAL: '무료 체험',
  NONE: '미구독',
  ADMIN_GRANTED: '관리자 부여',
  OTHER: '기타 구독',
};

export function SubscriptionAudienceFields({
  selected,
  onChange,
}: {
  selected: SubscriptionAudience[];
  onChange: (audiences: SubscriptionAudience[]) => void;
}) {
  return (
    <fieldset className="flex flex-wrap gap-x-5 gap-y-3">
      <legend className="mb-3 text-sm font-medium">구독 유형</legend>
      {Object.entries(SUBSCRIPTION_AUDIENCE_LABELS).map(([value, label]) => {
        const audience = value as SubscriptionAudience;
        return (
          <label key={value} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={selected.includes(audience)}
              onCheckedChange={(checked) =>
                onChange(
                  checked === true
                    ? [...selected, audience]
                    : selected.filter((item) => item !== audience),
                )
              }
            />
            {label}
          </label>
        );
      })}
    </fieldset>
  );
}
