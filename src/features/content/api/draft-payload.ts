// Day 초안 payload의 모양과 읽기 — 스웨거가 unknown/string으로 찍는 JSON을 BE dto/draft·dto/validation 모양으로 좁힌다.
// "없음(아직 전 단계)"과 "깨짐(형태가 다름)"을 가른다 — 깨진 값을 통과로 보이게 하지 않기 위해 (1차 결정 유지)
import type { ContentReviewComment } from './content-batch';

export const CONTENT_LEVELS = [
  'LEVEL_1',
  'LEVEL_2_TO_3',
  'LEVEL_4_TO_5',
] as const;
export type ContentLevel = (typeof CONTENT_LEVELS)[number];

export interface LineupRow {
  day: number;
  title: string;
  categoryDisplayOrder: number | null;
  proposedCategory: string | null;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  firstSpeaker: 'AI' | 'USER';
  characterId: string;
  beats: string[];
  overlapWarnings?: { day: number; reason: string }[];
}

export interface DraftQuestion {
  questionLevelGroup: ContentLevel;
  displayOrder: number;
  responseDemand: string;
  questionText: string;
  questionTranslation: string;
  requiredResponseElement: string;
  innerThought: string | null;
  innerThoughtType: 'GOOD' | 'NORMAL' | null;
}

export interface ScenarioDraft {
  scenario: {
    categoryDisplayOrder: number | null;
    aiRole: string;
    characterId: string;
    difficulty: LineupRow['difficulty'];
    firstSpeaker: LineupRow['firstSpeaker'];
    totalQuestionCount: number;
  };
  languageVariant: {
    title: string;
    briefing: string;
    userOpeningInstruction: string | null;
    conversationGoal: string;
  };
  questions: DraftQuestion[];
}

export interface PracticeExample {
  sentenceText: string;
  sentenceTranslation: string;
  practiceQuestion: string;
  practiceQuestionTranslation: string;
}

export interface DraftExpression {
  levelGroup: ContentLevel;
  answerToQuestionDisplayOrder: number;
  expressionType: string;
  usageFrequencyLevel: string;
  difficultyLevel: number;
  targetExpressionText: string;
  baseExpressionMeaningText: string;
  usageSummary: string;
  usageDescription: string;
  representativeQuestionText: string;
  representativeQuestionTranslation: string;
  representativeSentenceText: string;
  representativeSentenceTranslation: string;
  practiceExamples: PracticeExample[];
}

export interface StarMessage {
  starRating: string;
  message: string;
}

export type ValidationLevel = 'PASS' | 'WARN' | 'FAIL' | 'UNCHECKED';

export interface ValidationFinding {
  ruleId: string;
  level: ValidationLevel;
  path: string | null;
  message: string | null;
}

export interface ValidationReport {
  findings: ValidationFinding[];
  surfaceDuplicates: {
    index: number;
    targetExpressionText: string;
    existingMatches: { id: number; targetExpressionText?: string }[];
    batchMatchIndexes: number[];
  }[];
  semanticDuplicates: {
    index: number;
    targetExpressionText: string;
    duplicateOfId: number;
    duplicateOfText: string;
    reason: string;
  }[];
  /** 기계가 못 보는 항목 — 화면에 늘 띄운다 */
  humanOnlyChecks: string[];
}

/** 독립 AI 검수가 찾은 결함 한 건 */
export interface ReviewDefect {
  type: string;
  path: string | null;
  excerpt: string | null;
  reason: string;
  ruleCode: string | null;
}

/** 읽기 결과 — missing은 전 단계라 아직 없음, broken은 와야 할 모양이 아님 */
export type Reading<T> =
  { state: 'missing' } | { state: 'broken' } | { state: 'ok'; value: T };

const missing = { state: 'missing' } as const;
const broken = { state: 'broken' } as const;

// 저장된 JSON이 문자열로 올 수도 있다(스웨거 표기가 string인 필드) — 한 번 풀어 본다
function decode(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return Symbol('broken');
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isRecordArray = (value: unknown): value is Record<string, unknown>[] =>
  Array.isArray(value) && value.every(isRecord);

function readRecordArray<T>(value: unknown): Reading<T[]> {
  if (value === null || value === undefined) return missing;
  const decoded = decode(value);
  return isRecordArray(decoded)
    ? { state: 'ok', value: decoded as unknown as T[] }
    : broken;
}

export function readLineupRow(value: unknown): Reading<LineupRow> {
  if (value === null || value === undefined) return missing;
  const decoded = decode(value);
  return isRecord(decoded) && typeof decoded.title === 'string'
    ? { state: 'ok', value: decoded as unknown as LineupRow }
    : broken;
}

export function readScenarioDraft(value: unknown): Reading<ScenarioDraft> {
  if (value === null || value === undefined) return missing;
  const decoded = decode(value);
  return isRecord(decoded) && isRecordArray(decoded.questions)
    ? { state: 'ok', value: decoded as unknown as ScenarioDraft }
    : broken;
}

export const readExpressions = (value: unknown) =>
  readRecordArray<DraftExpression>(value);

export const readStarMessages = (value: unknown) =>
  readRecordArray<StarMessage>(value);

/** 통과면 빈 배열 — "결함 없음"과 "검수 전"이 다르다 */
export const readReviewDefects = (value: unknown) =>
  readRecordArray<ReviewDefect>(value);

export function readValidationReport(
  value: unknown,
): Reading<ValidationReport> {
  if (value === null || value === undefined) return missing;
  const decoded = decode(value);
  if (!isRecord(decoded) || !isRecordArray(decoded.findings)) return broken;
  const list = (field: unknown) => (Array.isArray(field) ? field : []);
  return {
    state: 'ok',
    value: {
      findings: decoded.findings as unknown as ValidationFinding[],
      surfaceDuplicates: list(decoded.surfaceDuplicates),
      semanticDuplicates: list(decoded.semanticDuplicates),
      humanOnlyChecks: list(decoded.humanOnlyChecks).filter(
        (item): item is string => typeof item === 'string',
      ),
    },
  };
}

/** 레벨 안 순서(displayOrder)대로 — AI 응답 순서를 믿지 않는다 */
export function questionsOfLevel(
  questions: DraftQuestion[],
  level: ContentLevel,
): DraftQuestion[] {
  return questions
    .filter((question) => question.questionLevelGroup === level)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function expressionsOfLevel(
  expressions: DraftExpression[],
  level: ContentLevel,
): DraftExpression[] {
  return expressions.filter((expression) => expression.levelGroup === level);
}

export type { ContentReviewComment };
