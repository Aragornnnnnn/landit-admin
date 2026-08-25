// 대시보드가 보여 주는 숫자들 — 집계 API가 없어 목록으로 받은 것을 여기서 센다 (docs/screens/dashboard.md).
// 세는 규칙이 곧 화면의 뜻이라 순수 함수로 떼어 테스트로 고정한다
import type { Schema } from '@/shared/api/schema-patch';

type Feedback = Schema<'AdminMailboxFeedbackResponse'>;
export type FeedbackType = NonNullable<Feedback['type']>;

/** 하루의 시작 — 시각이 아니라 날짜로 세기 위한 기준 */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** 이번 주 시작(월요일 00:00). 가입 수를 "이번 주"로 묶는 기준이다 */
export function startOfWeek(date: Date): Date {
  const day = startOfDay(date);
  // getDay(): 일=0 … 토=6. 월요일을 주의 시작으로 본다
  const offset = (day.getDay() + 6) % 7;
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() - offset);
}

const DAY_MS = 86_400_000;

/** 오늘 접수된 건수 — 요약 카드의 "오늘 +3" */
export function countCreatedToday(items: Feedback[], now: Date): number {
  const from = startOfDay(now).getTime();
  return items.filter((item) => timeOf(item.createdAt) >= from).length;
}

export interface OldestPending {
  waitingDays: number;
  type: FeedbackType | undefined;
  nickname: string | undefined;
}

/** 가장 오래 기다린 처리중 건 — 어드민이 가장 먼저 알아야 하는 한 건이다 */
export function oldestPending(
  items: Feedback[],
  now: Date,
): OldestPending | null {
  const pending = items.filter((item) => item.status === 'PENDING');
  if (pending.length === 0) return null;
  const oldest = pending.reduce((left, right) =>
    timeOf(left.createdAt) <= timeOf(right.createdAt) ? left : right,
  );
  return {
    waitingDays: Math.max(
      0,
      Math.floor(
        (startOfDay(now).getTime() -
          startOfDay(new Date(timeOf(oldest.createdAt))).getTime()) /
          DAY_MS,
      ),
    ),
    type: oldest.type,
    nickname: oldest.nickname,
  };
}

export interface DayBar {
  /** 그 날 0시 */
  date: Date;
  count: number;
  /** 오늘 막대만 진하게 그린다 */
  today: boolean;
}

/** 최근 7일 접수 막대 — 받은 목록에 없는 날도 0으로 채운다(빈 날이 빠지면 추세가 거짓말을 한다) */
export function dailyCounts(items: Feedback[], now: Date, days = 7): DayBar[] {
  const today = startOfDay(now).getTime();
  return Array.from({ length: days }, (_, index) => {
    const start = today - (days - 1 - index) * DAY_MS;
    const count = items.filter((item) => {
      const at = timeOf(item.createdAt);
      return at >= start && at < start + DAY_MS;
    }).length;
    return { date: new Date(start), count, today: start === today };
  });
}

/** 처리중 유형별 — 프레임 순서 그대로 늘 네 줄을 그린다(0건도 줄을 지우지 않는다) */
export const FEEDBACK_TYPE_ORDER: FeedbackType[] = [
  'BUG_REPORT',
  'FEATURE_REQUEST',
  'QUESTION',
  'CHEER',
];

export function countsByType(
  items: Feedback[],
): { type: FeedbackType; count: number }[] {
  return FEEDBACK_TYPE_ORDER.map((type) => ({
    type,
    count: items.filter((item) => item.type === type).length,
  }));
}

/** 이번 주·지난주 가입 수 — 가입 시각만 보면 되므로 사용자 전체 타입을 요구하지 않는다 */
export function signupCounts(
  users: { createdAt?: string }[],
  now: Date,
): { thisWeek: number; lastWeek: number } {
  const weekStart = startOfWeek(now).getTime();
  const lastWeekStart = weekStart - 7 * DAY_MS;
  const joined = users.map((user) => timeOf(user.createdAt));
  return {
    thisWeek: joined.filter((at) => at >= weekStart).length,
    lastWeek: joined.filter((at) => at >= lastWeekStart && at < weekStart)
      .length,
  };
}

/** "2026년 8월 18일 (화)" — 화면 맨 위 한 줄 */
export function todayLabel(now: Date): string {
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${weekday})`;
}

function timeOf(iso: string | undefined): number {
  const at = iso ? new Date(iso).getTime() : Number.NaN;
  return Number.isNaN(at) ? 0 : at;
}
