// Day 재생성 범위 — BE RegenerationScope 표기(ALL · QUESTIONS_AND_EXPRESSIONS:{level} · EXPRESSIONS:{level} · STAR_MESSAGES)와 사람이 읽는 라벨·어림 비용
import { CONTENT_LEVELS } from '../api/draft-payload';
import { LEVEL_LABEL } from './content-label';

export interface RegenerationScope {
  value: string;
  label: string;
  minutes: number;
  dollars: number;
}

// 실측(design.md 9-1절) — 전체는 Day 하나 값, 레벨 하나는 약 2분 · 0.3달러
const FULL = { minutes: 7, dollars: 1.1 };
const PARTIAL = { minutes: 2, dollars: 0.3 };

/** Select 순서 — 전체, 레벨별 질문+표현, 레벨별 표현만, 별점 */
export const REGENERATION_SCOPES: RegenerationScope[] = [
  { value: 'ALL', label: '전체', ...FULL },
  ...CONTENT_LEVELS.map((level) => ({
    value: `QUESTIONS_AND_EXPRESSIONS:${level}`,
    label: `질문+표현 · ${LEVEL_LABEL[level]}`,
    ...PARTIAL,
  })),
  ...CONTENT_LEVELS.map((level) => ({
    value: `EXPRESSIONS:${level}`,
    label: `표현만 · ${LEVEL_LABEL[level]}`,
    ...PARTIAL,
  })),
  { value: 'STAR_MESSAGES', label: '별점', ...PARTIAL },
];

export function regenerationScopeOf(value: string): RegenerationScope {
  return (
    REGENERATION_SCOPES.find((scope) => scope.value === value) ??
    REGENERATION_SCOPES[0]
  );
}
