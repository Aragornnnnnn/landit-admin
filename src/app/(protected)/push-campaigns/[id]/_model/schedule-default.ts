// 예약 확인창의 기본 시각 — 아직 안 지난 첫 빠른 선택. 빈 입력으로 시작하면 운영자가 매번 날짜부터 고른다
import {
  kstNow,
  quickSchedulePicks,
  type ScheduleInput,
} from '@/features/push-campaign/model/schedule-time';

export function defaultScheduleInput(now: Date = new Date()): ScheduleInput {
  const picks = quickSchedulePicks(now);
  return (
    picks.find((pick) => !pick.past)?.input ?? picks[picks.length - 1].input
  );
}

/** 저장된 UTC 예약 시각 → 한국 날짜·시간 입력. SCHEDULE_PENDING을 같은 시각으로 다시 시도할 때 쓴다 */
export function scheduleInputFromIso(iso: string): ScheduleInput {
  return kstNow(new Date(iso));
}
