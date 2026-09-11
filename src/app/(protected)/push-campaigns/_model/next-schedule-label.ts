// "다음 발송" 배너의 시각 — 오늘·내일은 말로, 그 뒤는 날짜로. 배너는 곧 나갈 푸시를 알리는 자리라 "며칠 뒤"보다 "내일"이 빠르다
import {
  formatKst,
  kstNow,
  kstWeekdayLabel,
} from '@/features/push-campaign/model/schedule-time';

export function nextScheduleLabel(
  scheduledAt: string,
  now: Date = new Date(),
): string {
  const at = new Date(scheduledAt);
  if (Number.isNaN(at.getTime())) return '';
  const day = kstNow(at).date;
  const today = kstNow(now).date;
  const tomorrow = kstNow(new Date(now.getTime() + 24 * 60 * 60 * 1000)).date;
  const weekday = kstWeekdayLabel(at);
  const time = formatKst(scheduledAt).slice(-5);
  if (day === today) return `오늘 (${weekday}) ${time}`;
  if (day === tomorrow) return `내일 (${weekday}) ${time}`;
  return `${formatKst(scheduledAt).slice(0, 5)} (${weekday}) ${time}`;
}
