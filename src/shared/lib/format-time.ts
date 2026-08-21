// 목록에 시각을 적는 두 가지 방법 — 데스크톱은 정확한 시각, 모바일은 상대 시각(Figma 프레임 기준)

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const two = (n: number) => String(n).padStart(2, '0');

/** "08.18 10:12" — 데스크톱 테이블의 접수 열 */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${two(date.getMonth() + 1)}.${two(date.getDate())} ${two(date.getHours())}:${two(date.getMinutes())}`;
}

/** "8.16" — 모바일에서 날짜만 적을 때. 월은 0을 채우지 않는다(프레임 기준) */
export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getMonth() + 1}.${two(date.getDate())}`;
}

/**
 * "방금", "10분 전", "3시간 전", "어제", "8.16" — 모바일 목록.
 * 하루가 넘으면 어제까지만 말로 쓰고 그 뒤로는 날짜를 적는다. "3일 전"보다 날짜가 찾기 쉽다
 */
export function formatRelativeTime(
  iso: string,
  now: Date = new Date(),
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const elapsed = now.getTime() - date.getTime();

  if (elapsed < MINUTE) return '방금';
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}분 전`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}시간 전`;
  if (elapsed < 2 * DAY) return '어제';
  return formatShortDate(iso);
}
