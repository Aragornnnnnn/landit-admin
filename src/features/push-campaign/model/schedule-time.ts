// 예약 시각 규칙 — 입력은 한국 시간, BE로는 +09:00 오프셋 문자열, 표시는 Asia/Seoul (docs/screens/push-campaigns.md "예약 발송" · "상태 · 시각").
// 운영자가 어디서 열든 한국 시간으로 읽고 쓰게 브라우저 시간대에 기대지 않는다

const KST = 'Asia/Seoul';
const KST_OFFSET = '+09:00';
const MIN_LEAD_MS = 60_000;

export interface ScheduleInput {
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
}

export function toKstIso(input: ScheduleInput): string {
  return `${input.date}T${input.time}:00${KST_OFFSET}`;
}

/** 지금을 한국 날짜·시각으로 */
export function kstNow(now: Date = new Date()): ScheduleInput {
  const parts = kstParts(now);
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

/** 예약을 막을 이유. 없으면 null. BE도 같은 검사(1분 이후)를 하지만 확인창에서 먼저 말해 준다 */
export function scheduleError(
  input: ScheduleInput,
  now: Date = new Date(),
): string | null {
  const at = new Date(toKstIso(input));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(at.getTime()))
    return '날짜와 시간을 입력해 주세요';
  if (at.getTime() < now.getTime() + MIN_LEAD_MS)
    return '지금부터 1분 이후만 예약할 수 있어요';
  return null;
}

/** 빠른 선택 칩 — 오늘·내일·다음 월요일. 이미 지난 칩은 past로 표시해 화면이 비활성화한다 */
export function quickSchedulePicks(
  now: Date = new Date(),
): { label: string; input: ScheduleInput; past: boolean }[] {
  const today = kstNow(now).date;
  const weekday = Number(kstParts(now).weekday); // 1(월)~7(일)
  const nextMonday = addDays(
    today,
    ((8 - weekday) % 7) + (weekday === 1 ? 7 : 0),
  );
  return [
    ['오늘 19:00', today, '19:00'],
    ['내일 09:00', addDays(today, 1), '09:00'],
    ['내일 19:00', addDays(today, 1), '19:00'],
    ['다음 월요일 09:00', nextMonday, '09:00'],
  ].map(([label, date, time]) => {
    const input = { date, time };
    return { label, input, past: scheduleError(input, now) !== null };
  });
}

/** "9월 12일 (토) 오후 7:00에 발송" — 확인창 요약 */
export function scheduleSummary(input: ScheduleInput): string {
  const at = new Date(toKstIso(input));
  if (Number.isNaN(at.getTime())) return '';
  const p = kstParts(at);
  const hour24 = Number(p.hour);
  const meridiem = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 || 12;
  return `${Number(p.month)}월 ${Number(p.day)}일 (${WEEKDAY[Number(p.weekday)]}) ${meridiem} ${hour12}:${p.minute}에 발송`;
}

/**
 * "09.12 19:00" — 목록·상세의 시각. UTC ISO(scheduledAt)는 한국 시간으로 옮기고,
 * 오프셋 없는 LocalDateTime(createdAt·completedAt)은 BE가 준 숫자 그대로 읽는다
 */
export function formatKst(iso: string): string {
  const hasOffset = /(Z|[+-]\d{2}:\d{2})$/.test(iso);
  const at = new Date(hasOffset ? iso : `${iso}${KST_OFFSET}`);
  if (Number.isNaN(at.getTime())) return '';
  const p = kstParts(at);
  return `${p.month}.${p.day} ${p.hour}:${p.minute}`;
}

const WEEKDAY = ['', '월', '화', '수', '목', '금', '토', '일'];

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: KST,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  weekday: 'short',
});
const WEEKDAY_INDEX: Record<string, string> = {
  Mon: '1',
  Tue: '2',
  Wed: '3',
  Thu: '4',
  Fri: '5',
  Sat: '6',
  Sun: '7',
};

function kstParts(date: Date) {
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    parts[part.type] = part.value;
  }
  parts.weekday = WEEKDAY_INDEX[parts.weekday] ?? '';
  return parts as Record<
    'year' | 'month' | 'day' | 'hour' | 'minute' | 'weekday',
    string
  >;
}

// 한국 날짜 문자열에 날짜를 더한다 — 자정 기준 오프셋 시각으로 계산하면 서머타임 없는 KST에서 하루가 정확히 24시간이다
function addDays(date: string, days: number): string {
  const at = new Date(`${date}T00:00:00${KST_OFFSET}`);
  at.setUTCDate(at.getUTCDate() + days);
  return kstNow(at).date;
}
