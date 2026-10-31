// 접수 입력 규칙 — Day 수 범위·캐릭터 합·메모 길이는 BE가 400으로 거르지만, 담당자는 보내기 전에 알아야 한다 (docs/screens/content-batches.md "검증")
import {
  CONTENT_CHARACTERS,
  type CharacterRatio,
  type ContentBatchRequest,
  type ContentCharacter,
} from '../api/content-batch';

export const DAY_COUNT_MIN = 1;
export const DAY_COUNT_MAX = 30;
export const NOTE_MAX = 2000;

/** 실측 평균(design.md 9-1절) — Day 1개 약 7분 · 1.1달러 */
const MINUTES_PER_DAY = 7;
const DOLLARS_PER_DAY = 1.1;

/** 못 보내는 이유 한 줄 — 보낼 수 있으면 null */
export function validateBatchRequest(
  request: ContentBatchRequest,
): string | null {
  const { dayCount, characterRatio, note } = request;
  if (
    !Number.isInteger(dayCount) ||
    dayCount < DAY_COUNT_MIN ||
    dayCount > DAY_COUNT_MAX
  )
    return `Day 수는 ${DAY_COUNT_MIN}~${DAY_COUNT_MAX} 사이 정수로 입력해 주세요`;
  const amounts = CONTENT_CHARACTERS.map((name) => characterRatio[name]);
  if (amounts.some((amount) => !Number.isInteger(amount) || amount < 0))
    return '캐릭터별 Day 수는 0 이상 정수로 입력해 주세요';
  if (amounts.reduce((sum, amount) => sum + amount, 0) !== dayCount)
    return '캐릭터별 Day 수의 합을 Day 수와 맞춰 주세요';
  if (note.length > NOTE_MAX)
    return `메모는 ${NOTE_MAX.toLocaleString()}자까지 입력해 주세요`;
  return null;
}

/**
 * 기본 비율 — Day 수를 셋으로 나누고, 나머지는 운영 누적(`characterCounts`)이 적은 캐릭터부터 1씩 더 준다.
 * 누적이 같으면 chloe · marco · teddy 순
 */
export function defaultCharacterRatio(
  dayCount: number,
  counts: Partial<Record<ContentCharacter, number>>,
): CharacterRatio {
  const base = Math.floor(dayCount / CONTENT_CHARACTERS.length);
  const remainder = dayCount % CONTENT_CHARACTERS.length;
  const byFewest = [...CONTENT_CHARACTERS].sort(
    (a, b) => (counts[a] ?? 0) - (counts[b] ?? 0),
  );
  const ratio = { chloe: base, marco: base, teddy: base };
  byFewest.slice(0, remainder).forEach((name) => {
    ratio[name] += 1;
  });
  return ratio;
}

/** 확인창·안내 타일의 어림 시간·비용 */
export function estimateGeneration(dayCount: number) {
  return {
    minutes: dayCount * MINUTES_PER_DAY,
    dollars: Math.round(dayCount * DOLLARS_PER_DAY * 10) / 10,
  };
}
