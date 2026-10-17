'use client';

// 보상 단계의 활성화와 대상별 금액 입력을 제공한다.
import { Input } from '@/shared/ui/shadcn/input';

import type { Stage } from '../_api/referrals';

export const selectClass =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm';
export function StageFields({
  title,
  value,
  onChange,
}: {
  title: string;
  value: Stage;
  onChange: (v: Stage) => void;
}) {
  return (
    <fieldset className="space-y-4 rounded-xl border bg-card p-5">
      <legend className="px-1 font-semibold">{title}</legend>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) =>
            onChange({
              ...value,
              enabled: e.target.checked,
              target: value.target === 'NONE' ? 'BOTH' : value.target,
            })
          }
        />
        보상 활성화
      </label>
      <label className="block space-y-1 text-sm">
        <span>지급 대상</span>
        <select
          className={selectClass}
          disabled={!value.enabled}
          value={value.target === 'NONE' ? 'BOTH' : value.target}
          onChange={(e) =>
            onChange({ ...value, target: e.target.value as Stage['target'] })
          }
        >
          <option value="INVITER">초대인만</option>
          <option value="INVITEE">피초대인만</option>
          <option value="BOTH">양쪽 모두</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        {(['inviterWon', 'inviteeWon'] as const).map((key, i) => (
          <label key={key} className="space-y-1 text-sm">
            <span>{i === 0 ? '초대인 금액' : '피초대인 금액'} (원)</span>
            <Input
              type="number"
              min={1}
              max={1000000}
              step={1}
              disabled={
                !value.enabled ||
                (i === 0
                  ? value.target === 'INVITEE'
                  : value.target === 'INVITER')
              }
              value={Number.isNaN(value[key]) ? '' : value[key]}
              onChange={(e) =>
                onChange({
                  ...value,
                  [key]: e.target.value === '' ? NaN : Number(e.target.value),
                })
              }
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
