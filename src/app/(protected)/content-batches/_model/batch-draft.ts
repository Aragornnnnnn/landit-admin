// 접수 Dialog의 안내 문구 — 예약 범위와 캐릭터 누적 권장. 입력 검증은 features/content/model/batch-request.ts
import {
  CONTENT_CHARACTERS,
  type ContentCharacter,
} from '@/features/content/api/content-batch';
import {
  DAY_COUNT_MAX,
  DAY_COUNT_MIN,
} from '@/features/content/model/batch-request';
import { formatCharacterRatio } from '@/features/content/model/content-label';

/** "Day 301 ~ 310 예약" — 다음 Day를 모르거나 Day 수가 범위 밖이면 빈 문자열 */
export function reservedDayRange(
  nextDay: number | undefined,
  dayCount: number,
): string {
  if (
    nextDay === undefined ||
    !Number.isInteger(dayCount) ||
    dayCount < DAY_COUNT_MIN ||
    dayCount > DAY_COUNT_MAX
  )
    return '';
  const last = nextDay + dayCount - 1;
  return last === nextDay
    ? `Day ${nextDay} 예약`
    : `Day ${nextDay} ~ ${last} 예약`;
}

/**
 * "누적 분포 chloe 80 · marco 74 · teddy 146 — teddy가 많으니 chloe·marco 비중을 올리는 쪽을 권해요".
 * 누적이 전부 같으면 분포만, 아직 못 받았으면 빈 문자열
 */
export function ratioAdvice(
  counts: Partial<Record<ContentCharacter, number>> | undefined,
): string {
  if (!counts) return '';
  const distribution = `누적 분포 ${formatCharacterRatio(counts)}`;
  const max = Math.max(...CONTENT_CHARACTERS.map((name) => counts[name] ?? 0));
  const most = CONTENT_CHARACTERS.filter((name) => (counts[name] ?? 0) === max);
  if (most.length === CONTENT_CHARACTERS.length) return distribution;
  const others = CONTENT_CHARACTERS.filter((name) => !most.includes(name));
  return `${distribution} — ${most.join('·')}가 많으니 ${others.join('·')} 비중을 올리는 쪽을 권해요`;
}
