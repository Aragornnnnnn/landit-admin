// 코멘트 참조 — 질문·표현·별점 줄과 BE targetPath·사람이 읽는 라벨([L1 Q2]·[E 3]) 사이의 변환 (docs/screens/content-batches.md "Day 초안 상세")
import type { ContentRuleScope } from '../api/content-rule';
import type { ContentLevel } from '../api/draft-payload';
import { LEVEL_SHORT } from './content-label';

export type ReviewTarget =
  | { kind: 'question'; level: ContentLevel; index: number }
  /** ordinal은 전체 순번 1~12 — 줄을 누를 때는 알고, 검증기 path에서 거꾸로 읽을 때는 모른다 */
  | { kind: 'expression'; level: ContentLevel; index: number; ordinal?: number }
  /** 검증기가 레벨 없이 전체 순번으로 적은 표현 경로(`expressions[3]`) — 줄을 찾을 때만 쓴다 */
  | { kind: 'expression'; ordinal: number }
  | { kind: 'star'; index: number };

export interface ReviewReference {
  /** 코멘트 본문에 들어가는 표시 */
  label: string;
  /** BE에 저장되는 경로 — 질문·표현은 레벨 안 0부터 인덱스 */
  path: string;
}

export function referenceOf(target: ReviewTarget): ReviewReference {
  switch (target.kind) {
    case 'question':
      return {
        label: `[${LEVEL_SHORT[target.level]} Q${target.index + 1}]`,
        path: `questions[${target.level}][${target.index}]`,
      };
    case 'expression':
      if (!('level' in target)) {
        return {
          label: `[E ${target.ordinal}]`,
          path: `expressions[${target.ordinal - 1}]`,
        };
      }
      return {
        label: `[E ${target.ordinal ?? `${LEVEL_SHORT[target.level]}-${target.index + 1}`}]`,
        path: `expressions[${target.level}][${target.index}]`,
      };
    case 'star':
      return {
        label: `[S ${target.index + 1}]`,
        path: `starMessages[${target.index}]`,
      };
  }
}

export interface CommentDraft {
  text: string;
  targetPath: string;
}

/**
 * 줄을 누를 때 — 없는 참조면 끝에 붙이고 경로를 그 줄로, 이미 있으면 참조를 지운다.
 * 경로는 그 줄의 것이었을 때만 비운다(다른 줄로 바뀐 뒤 해제해도 경로는 남는다)
 */
export function toggleReference(
  draft: CommentDraft,
  reference: ReviewReference,
): CommentDraft {
  if (!draft.text.includes(reference.label)) {
    const spaced =
      draft.text && !draft.text.endsWith(' ') ? `${draft.text} ` : draft.text;
    return { text: `${spaced}${reference.label} `, targetPath: reference.path };
  }
  const text = draft.text
    .replace(`${reference.label} `, '')
    .replace(reference.label, '')
    .trimStart();
  return {
    text,
    targetPath: draft.targetPath === reference.path ? '' : draft.targetPath,
  };
}

const LEVELED =
  /^(questions|expressions)\[(LEVEL_1|LEVEL_2_TO_3|LEVEL_4_TO_5)\]\[(\d+)\]/;
const FLAT = /^(expressions|starMessages)\[(\d+)\]/;

/** 검증기·AI 검수의 path를 줄로 — 모르는 경로(scenario.aiRole 등)는 null */
export function targetOfPath(
  path: string | null | undefined,
): ReviewTarget | null {
  if (!path) return null;
  const leveled = LEVELED.exec(path);
  if (leveled) {
    const level = leveled[2] as ContentLevel;
    const index = Number(leveled[3]);
    return leveled[1] === 'questions'
      ? { kind: 'question', level, index }
      : { kind: 'expression', level, index };
  }
  const flat = FLAT.exec(path);
  if (!flat) return null;
  const index = Number(flat[2]);
  return flat[1] === 'starMessages'
    ? { kind: 'star', index }
    : { kind: 'expression', ordinal: index + 1 };
}

/** "규칙으로 승격"의 scope 기본값 — 경로가 가리키는 단계. 모르면 COMMON */
export function ruleScopeForPath(
  path: string | null | undefined,
): ContentRuleScope {
  if (path?.startsWith('questions')) return 'QUESTION';
  if (path?.startsWith('expressions')) return 'EXPRESSION';
  if (path?.startsWith('starMessages')) return 'STAR_MESSAGE';
  return 'COMMON';
}
