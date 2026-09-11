'use client';

// 예약 발송 — 한국 시간 날짜·시간, 빠른 선택, 발송 시각 요약 (Figma 2183:521).
// 1분 이후·분 단위는 BE도 검사하지만 창 안에서 먼저 막는다
import { useState } from 'react';
import { Clock } from 'lucide-react';

import type { PushAudiencePreview } from '@/features/push-campaign/api/push-campaign';
import {
  quickSchedulePicks,
  scheduleError,
  scheduleSummary,
  type ScheduleInput,
} from '@/features/push-campaign/model/schedule-time';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog';
import { Input } from '@/shared/ui/shadcn/input';

import { defaultScheduleInput } from '../_model/schedule-default';

interface ScheduleDialogProps {
  open: boolean;
  preview: PushAudiencePreview | undefined;
  pending: boolean;
  onCancel: () => void;
  onConfirm: (input: ScheduleInput) => void;
}

const FIELD =
  'h-auto rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] font-medium shadow-none';

export function ScheduleDialog(props: ScheduleDialogProps) {
  return (
    <Dialog
      open={props.open}
      onOpenChange={(next) => !next && props.onCancel()}
    >
      {/* 열 때마다 새로 시작한다 — 지난번 고른 시각이 남아 있으면 이미 지난 시각일 수 있다 */}
      {props.open && <ScheduleForm {...props} />}
    </Dialog>
  );
}

function ScheduleForm({
  preview,
  pending,
  onCancel,
  onConfirm,
}: ScheduleDialogProps) {
  const [input, setInput] = useState<ScheduleInput>(() =>
    defaultScheduleInput(),
  );
  const error = scheduleError(input);
  const picks = quickSchedulePicks();

  return (
    <DialogContent className="w-[calc(100%-4rem)] gap-4 rounded-2xl p-6 sm:max-w-[520px]">
      <DialogTitle className="text-[17px] font-bold text-foreground">
        예약 발송
      </DialogTitle>
      <DialogDescription className="sr-only">
        한국 시간으로 발송 시각을 정합니다
      </DialogDescription>

      <div className="flex gap-2.5">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-[12px] font-medium text-subtle">날짜</span>
          <Input
            type="date"
            value={input.date}
            onChange={(event) =>
              setInput({ ...input, date: event.target.value })
            }
            className={FIELD}
          />
        </label>
        <label className="flex w-[150px] flex-col gap-1.5">
          <span className="text-[12px] font-medium text-subtle">시간</span>
          <Input
            type="time"
            step={60}
            value={input.time}
            onChange={(event) =>
              setInput({ ...input, time: event.target.value })
            }
            className={FIELD}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {picks.map((pick) => {
          const active =
            pick.input.date === input.date && pick.input.time === input.time;
          return (
            <button
              key={pick.label}
              type="button"
              disabled={pick.past}
              onClick={() => setInput(pick.input)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-field-border bg-card text-body hover:bg-muted',
              )}
            >
              {pick.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3.5 rounded-xl bg-primary/10 px-4 py-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-card text-primary">
          <Clock className="size-[18px]" aria-hidden />
        </span>
        <span className="flex min-w-px flex-1 flex-col gap-0.5">
          <span className="text-[15px] font-bold text-strong">
            {error ? '발송 시각을 정해 주세요' : scheduleSummary(input)}
          </span>
          <span
            className={cn(
              'text-[12px]',
              error ? 'text-destructive' : 'text-primary',
            )}
          >
            {error ??
              (preview
                ? `예상 ${preview.estimatedUserCount.toLocaleString('ko-KR')}명`
                : '')}
          </span>
        </span>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button
          disabled={Boolean(error) || pending}
          onClick={() => onConfirm(input)}
        >
          예약하기
        </Button>
      </div>
    </DialogContent>
  );
}
