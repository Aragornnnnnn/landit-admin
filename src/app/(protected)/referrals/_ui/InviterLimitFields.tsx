'use client';

// 초대인으로 받은 누적 적립금의 금액 한도를 편집한다.
import { Input } from '@/shared/ui/shadcn/input';

import type { InviterLimit } from '../_api/referrals';
import { selectClass } from './StageFields';

export function InviterLimitFields({
  value,
  onChange,
}: {
  value?: InviterLimit;
  onChange: (value: InviterLimit) => void;
}) {
  return (
    <section className="space-y-3 rounded-xl border bg-card p-5">
      <h2 className="font-semibold">초대 적립금 한도</h2>
      <p className="text-sm text-subtle">
        내가 다른 사람을 초대해 받은 가입·결제 보상만 합산해요. 초대받아 받은
        보상은 내 한도에 포함하지 않아요.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>한도 설정</span>
          <select
            className={selectClass}
            disabled={!value}
            value={value?.type === 'INVITE_COUNT' ? '' : (value?.type ?? '')}
            onChange={(e) =>
              onChange({
                type: e.target.value as InviterLimit['type'],
                value: null,
              })
            }
          >
            {!value && <option value="">설정 정보 없음</option>}
            {value?.type === 'INVITE_COUNT' && (
              <option value="" disabled>
                금액 한도를 설정해 주세요.
              </option>
            )}
            <option value="UNLIMITED">제한 없음</option>
            <option value="TOTAL_AMOUNT">금액 한도 적용</option>
          </select>
        </label>
        {value?.type === 'TOTAL_AMOUNT' && (
          <label className="space-y-1 text-sm">
            <span>초대 적립금 한도 (원)</span>
            <Input
              type="number"
              min={0}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={
                value.value == null || Number.isNaN(value.value)
                  ? ''
                  : value.value
              }
              onChange={(e) =>
                onChange({
                  ...value,
                  value: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </label>
        )}
      </div>
      {!value ? (
        <p className="text-sm text-subtle">
          초대인 한도 설정은 아직 사용할 수 없어요.
        </p>
      ) : (
        <div className="space-y-1 text-sm text-subtle">
          <p>가입·결제에서 초대인으로 받은 누적 금액의 평생 한도예요.</p>
          <p>
            남은 한도가 500원이면 500원만 지급해요. 0으로 설정하면 추가 초대인
            보상을 지급하지 않아요.
          </p>
          <p>
            한도를 낮춰도 기존 적립금은 유지돼요. 피초대인 보상은 그대로
            지급해요.
          </p>
        </div>
      )}
    </section>
  );
}
