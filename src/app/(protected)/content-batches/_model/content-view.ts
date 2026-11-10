// 제작 응답을 화면에서 읽을 수 있는 구조로 정리하고 기록 없음과 검수 통과를 구분한다.
export const LEVELS = ['LEVEL_1', 'LEVEL_2_TO_3', 'LEVEL_4_TO_5'] as const;
export const LEVEL_LABELS = ['레벨 1', '레벨 2–3', '레벨 4–5'];
export type ContentRow = Record<string, unknown>;

export function readObject(value: unknown): ContentRow {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as ContentRow)
    : {};
}

function decode(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function readRows(value: unknown): ContentRow[] {
  const parsed = decode(value);
  return Array.isArray(parsed) ? parsed.map(readObject) : [];
}

export function readText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : '';
}

export function readReview(value: unknown) {
  const parsed = decode(value);
  return { recorded: Array.isArray(parsed), items: readRows(parsed) };
}

export function inspectContent(
  scenario: unknown,
  expressions: unknown,
  stars: unknown,
) {
  const payload = readObject(scenario);
  return {
    core: readObject(payload.scenario),
    language: readObject(payload.languageVariant),
    questions: readRows(payload.questions),
    expressions: readRows(expressions),
    stars: readRows(stars),
  };
}

export const STATUS_LABELS: Record<string, string> = {
  REQUESTED: '접수',
  LINEUP_GENERATING: '라인업 생성 중',
  LINEUP_READY: '라인업 확인',
  LINEUP: '라인업',
  GENERATING: '초안 생성 중',
  REVIEW_READY: '검수 대기',
  NEEDS_FIX: '수정 필요',
  OK: '검수 완료',
  APPROVED: '승인 완료',
  ASSETS_READY: '에셋 준비 완료',
  PUBLISHED: '발행 완료',
  FAILED: '처리 실패',
};
