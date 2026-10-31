// 라인업 편집 초안 — Day 요약의 lineupRow를 편집 행으로 펴고, 저장 전 검증(행 단위·표 단위)과 PUT 요청 모양을 만든다 (docs/screens/content-batches.md "라인업 확인")
import {
  CONTENT_CHARACTERS,
  type CharacterRatio,
  type ContentDaySummary,
  type LineupRowRequest,
} from '@/features/content/api/content-batch';
import {
  readLineupRow,
  type LineupRow,
} from '@/features/content/api/draft-payload';
import { formatCharacterRatio } from '@/features/content/model/content-label';
import type { Schema } from '@/shared/api/schema-patch';

export type LineupDraftRow = LineupRow;

export const TITLE_MAX = 100;
export const CATEGORY_NAME_MAX = 100;
export const BEAT_MAX = 200;
export const BEATS_MIN = 2;
export const BEATS_MAX = 5;

export const DIFFICULTIES: LineupRow['difficulty'][] = [
  'EASY',
  'NORMAL',
  'HARD',
];
export const SPEAKERS: LineupRow['firstSpeaker'][] = ['AI', 'USER'];

/** 편집 원본 — 라인업이 아직 없거나 깨진 Day는 뺀다(BE가 PUT에서 "Day 전부"를 요구하므로 그런 Day가 있으면 저장이 400이 난다) */
export function lineupRowsOf(days: ContentDaySummary[]): LineupDraftRow[] {
  return days.flatMap((day) => {
    const reading = readLineupRow(day.lineupRow);
    return reading.state === 'ok' ? [reading.value] : [];
  });
}

export interface LineupValidation {
  /** day → 그 행의 오류 문구들 */
  rows: Record<number, string[]>;
  /** 표 전체 오류 — 캐릭터 수가 접수 비중과 다를 때 */
  table: string | null;
}

export function validateLineupRows(
  rows: LineupDraftRow[],
  // 스웨거는 비율 세 칸을 optional로 찍는다 — 빠진 캐릭터는 0으로 본다
  ratio: Partial<CharacterRatio>,
): LineupValidation {
  const result: LineupValidation = { rows: {}, table: null };
  rows.forEach((row) => {
    const errors = rowErrors(row);
    if (errors.length) result.rows[row.day] = errors;
  });
  const counted = countCharacters(rows);
  if (CONTENT_CHARACTERS.some((name) => counted[name] !== (ratio[name] ?? 0))) {
    result.table = `캐릭터 수가 접수 비중(${formatCharacterRatio(ratio)})과 달라요 — 지금 ${formatCharacterRatio(counted)}`;
  }
  return result;
}

function rowErrors(row: LineupDraftRow): string[] {
  const errors: string[] = [];
  const title = row.title.trim();
  if (!title) errors.push('제목을 적어 주세요');
  else if (title.length > TITLE_MAX) errors.push(`제목은 ${TITLE_MAX}자까지`);
  const named = (row.proposedCategory ?? '').trim();
  if (row.categoryDisplayOrder === null && !named)
    errors.push('기존 카테고리 번호나 새 카테고리 이름 중 하나를 골라 주세요');
  if (named.length > CATEGORY_NAME_MAX)
    errors.push(`새 카테고리 이름은 ${CATEGORY_NAME_MAX}자까지`);
  const beats = cleanBeats(row.beats);
  if (beats.length < BEATS_MIN || beats.length > BEATS_MAX)
    errors.push(`줄거리는 ${BEATS_MIN}~${BEATS_MAX}줄`);
  if (beats.some((beat) => beat.length > BEAT_MAX))
    errors.push(`줄거리는 한 줄 ${BEAT_MAX}자까지`);
  return errors;
}

function countCharacters(rows: LineupDraftRow[]): CharacterRatio {
  const counted: CharacterRatio = { chloe: 0, marco: 0, teddy: 0 };
  rows.forEach((row) => {
    if (row.characterId in counted)
      counted[row.characterId as keyof CharacterRatio] += 1;
  });
  return counted;
}

// 빈 줄은 줄바꿈 편집 중 생긴 것 — 검증·저장 모두 빼고 본다
const cleanBeats = (beats: string[]) =>
  beats.map((beat) => beat.trim()).filter(Boolean);

/** 카테고리는 번호 또는 새 이름 중 하나 — 한쪽을 정하면 다른 쪽은 비운다 */
export function setCategory(
  row: LineupDraftRow,
  patch: { categoryDisplayOrder: number } | { proposedCategory: string },
): LineupDraftRow {
  return 'categoryDisplayOrder' in patch
    ? {
        ...row,
        categoryDisplayOrder: patch.categoryDisplayOrder,
        proposedCategory: null,
      }
    : {
        ...row,
        categoryDisplayOrder: null,
        proposedCategory: patch.proposedCategory,
      };
}

/** PUT 몸체 — 겹침 경고는 BE가 AI 제안을 그대로 두므로 보내지 않는다 */
export function toLineupRequest(rows: LineupDraftRow[]): LineupRowRequest[] {
  return rows.map((row) => ({
    day: row.day,
    title: row.title.trim(),
    categoryDisplayOrder: row.categoryDisplayOrder ?? undefined,
    proposedCategory: row.proposedCategory?.trim() || undefined,
    difficulty: row.difficulty,
    firstSpeaker: row.firstSpeaker,
    characterId: row.characterId,
    beats: cleanBeats(row.beats),
  }));
}

export function hasLineupChanges(
  original: LineupDraftRow[],
  current: LineupDraftRow[],
): boolean {
  return (
    JSON.stringify(toLineupRequest(original)) !==
    JSON.stringify(toLineupRequest(current))
  );
}

export interface CategoryOption {
  displayOrder: number;
  name: string;
}

/** 라인업 행의 카테고리 번호 → 이름. 시나리오 목록 API(develop 전용)에서 — 운영에선 비어 번호만 보인다 */
export function categoryOptionsOf(
  response: Schema<'AdminScenarioListResponse'> | undefined,
): CategoryOption[] {
  return (response?.categories ?? [])
    .flatMap((category) =>
      category.displayOrder !== undefined && category.categoryName
        ? [{ displayOrder: category.displayOrder, name: category.categoryName }]
        : [],
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function categoryLabel(
  row: Pick<LineupDraftRow, 'categoryDisplayOrder' | 'proposedCategory'>,
  options: CategoryOption[],
): string {
  if (row.proposedCategory) return `새: ${row.proposedCategory}`;
  if (row.categoryDisplayOrder === null) return '—';
  const found = options.find(
    (option) => option.displayOrder === row.categoryDisplayOrder,
  );
  return found ? found.name : `#${row.categoryDisplayOrder}`;
}
