'use client';

// 새 배치 접수 — Day 수 · 캐릭터별 Day 수(합계 검증) · 메모 · autoProceed · 비용 안내 (Figma 4129:727).
// 접수 자체가 확인이라 따로 확인창을 두지 않는다. 접수 중엔 닫히지 않는다
import { useState } from 'react';

import {
  CONTENT_CHARACTERS,
  type CharacterRatio,
  type ContentNextDay,
} from '@/features/content/api/content-batch';
import {
  DAY_COUNT_MAX,
  DAY_COUNT_MIN,
  defaultCharacterRatio,
  estimateGeneration,
  NOTE_MAX,
  validateBatchRequest,
} from '@/features/content/model/batch-request';
import { useContentBatchMutation } from '@/features/content/model/useContentMutation';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/shadcn/button';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import { ratioAdvice, reservedDayRange } from '../_model/batch-draft';

interface CreateBatchDialogProps {
  open: boolean;
  /** 아직 못 받았을 수 있다 — 그러면 예약 범위·권장 없이 연다 */
  nextDay: ContentNextDay | undefined;
  onClose: () => void;
  onCreated: (batchId: number) => void;
}

const DEFAULT_DAY_COUNT = 10;
const FIELD =
  'h-auto rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] font-medium shadow-none';

export function CreateBatchDialog(props: CreateBatchDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={(next) => !next && props.onClose()}>
      {/* 열 때마다 새로 시작한다 — 다음 Day·누적이 바뀌면 기본 비율도 바뀐다 */}
      {props.open && <CreateBatchForm {...props} />}
    </Dialog>
  );
}

function CreateBatchForm({
  nextDay,
  onClose,
  onCreated,
}: CreateBatchDialogProps) {
  const counts = nextDay?.characterCounts ?? {};
  const [dayCount, setDayCount] = useState(DEFAULT_DAY_COUNT);
  const [ratio, setRatio] = useState<CharacterRatio>(() =>
    defaultCharacterRatio(DEFAULT_DAY_COUNT, counts),
  );
  const [note, setNote] = useState('');
  const [autoProceed, setAutoProceed] = useState(false);
  const mutation = useContentBatchMutation();

  const request = { dayCount, characterRatio: ratio, note, autoProceed };
  const invalid = validateBatchRequest(request);
  const sum = CONTENT_CHARACTERS.reduce(
    (total, name) => total + (ratio[name] || 0),
    0,
  );
  const estimate = estimateGeneration(
    Number.isInteger(dayCount) ? dayCount : 0,
  );

  // Day 수를 바꾸면 비율도 그 수에 맞춰 다시 나눈다 — 손으로 고친 비율은 Day 수를 다시 바꿀 때만 덮인다
  const changeDayCount = (next: number) => {
    setDayCount(next);
    if (
      Number.isInteger(next) &&
      next >= DAY_COUNT_MIN &&
      next <= DAY_COUNT_MAX
    )
      setRatio(defaultCharacterRatio(next, counts));
  };

  const submit = () => {
    if (invalid || mutation.isPending) return;
    mutation.mutate(
      { type: 'create', body: request },
      { onSuccess: (detail) => onCreated(detail.batch.batchId) },
    );
  };

  return (
    <DialogContent
      className="w-[calc(100%-4rem)] gap-5 rounded-2xl p-6 sm:max-w-[560px]"
      showCloseButton={false}
      onInteractOutside={(event) =>
        mutation.isPending && event.preventDefault()
      }
      onEscapeKeyDown={(event) => mutation.isPending && event.preventDefault()}
    >
      <div className="flex flex-col gap-1.5">
        <DialogTitle className="text-[20px] font-bold text-foreground">
          새 배치 접수
        </DialogTitle>
        <DialogDescription className="text-[13px] leading-[1.5] text-body">
          {nextDay ? `다음 Day ${nextDay.nextDay}부터 ` : ''}연속으로 예약해요.
          접수하면 바로 라인업 생성을 시작하고, 라인업을 확인한 뒤 Day 생성을
          진행해요.
        </DialogDescription>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <fieldset disabled={mutation.isPending} className="flex flex-col gap-4">
          {/* 도움말은 label 밖에 — label 안에 두면 입력의 접근성 이름에 "Day 301 ~ 310 예약"까지 섞인다 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="batch-day-count"
              className="text-[13px] font-medium text-strong"
            >
              Day 수 ({DAY_COUNT_MIN}~{DAY_COUNT_MAX})
            </label>
            <Input
              id="batch-day-count"
              type="number"
              min={DAY_COUNT_MIN}
              max={DAY_COUNT_MAX}
              aria-describedby="batch-day-range"
              value={Number.isNaN(dayCount) ? '' : dayCount}
              onChange={(event) => changeDayCount(event.target.valueAsNumber)}
              className={cn(FIELD, 'w-[120px]')}
            />
            <span id="batch-day-range" className="text-[12px] text-subtle">
              {reservedDayRange(nextDay?.nextDay, dayCount)}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-strong">
              캐릭터별 Day 수 — 합이 Day 수와 같아야 해요
            </span>
            <div className="grid grid-cols-4 gap-3">
              {CONTENT_CHARACTERS.map((name) => (
                <label key={name} className="flex flex-col gap-1.5">
                  <span className="text-[12px] text-subtle">{name}</span>
                  <Input
                    type="number"
                    min={0}
                    max={DAY_COUNT_MAX}
                    aria-label={`${name} Day 수`}
                    value={Number.isNaN(ratio[name]) ? '' : ratio[name]}
                    onChange={(event) =>
                      setRatio({ ...ratio, [name]: event.target.valueAsNumber })
                    }
                    className={FIELD}
                  />
                </label>
              ))}
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] text-subtle">합계</span>
                <output
                  aria-label="합계"
                  className={cn(
                    'flex h-full items-center rounded-xl bg-muted px-4 text-[14px] font-bold',
                    sum === dayCount ? 'text-success' : 'text-destructive',
                  )}
                >
                  {sum} / {Number.isNaN(dayCount) ? '—' : dayCount}
                  {sum === dayCount && ' ✓'}
                </output>
              </div>
            </div>
            <span className="text-[12px] text-subtle">
              {ratioAdvice(nextDay?.characterCounts)}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="batch-note"
              className="text-[13px] font-medium text-strong"
            >
              메모 (선택, {NOTE_MAX.toLocaleString()}자) — 프롬프트에 그대로
              들어가요
            </label>
            <Textarea
              id="batch-note"
              value={note}
              maxLength={NOTE_MAX}
              rows={3}
              aria-describedby="batch-note-count"
              onChange={(event) => setNote(event.target.value)}
              className="min-h-0 rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] shadow-none"
            />
            <span
              id="batch-note-count"
              className="text-right text-[12px] text-subtle"
            >
              {note.length.toLocaleString()} / {NOTE_MAX.toLocaleString()}
            </span>
          </div>

          <label className="flex items-center gap-2.5 text-[14px] text-strong">
            <Checkbox
              checked={autoProceed}
              onCheckedChange={(checked) => setAutoProceed(checked === true)}
            />
            라인업 확인 없이 바로 Day 생성 (autoProceed)
          </label>

          <p className="rounded-xl bg-primary/10 px-4 py-3 text-[13px] text-primary">
            비용 안내: Day 1개 ≈ 7분 · 약 1.1달러(Opus 5.5 생성 + GPT 검수).{' '}
            {estimate.minutes > 0 &&
              `${dayCount}개면 약 ${estimate.dollars}달러 · ${estimate.minutes}분.`}
          </p>

          {invalid && (
            <p role="alert" className="text-[12px] text-destructive">
              {invalid}
            </p>
          )}
        </fieldset>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            disabled={mutation.isPending}
            onClick={onClose}
          >
            취소
          </Button>
          <Button type="submit" disabled={!!invalid || mutation.isPending}>
            {mutation.isPending ? '접수 중…' : '접수'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
