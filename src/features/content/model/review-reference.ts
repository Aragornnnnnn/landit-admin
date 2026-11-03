// 코멘트 참조 — 질문·표현·별점 줄과 BE targetPath·사람이 읽는 라벨([L1 Q2]·[E 3]·[S 2.5]) 사이의 변환 (docs/screens/content-batches.md "Day 초안 상세").
// 경로 규칙은 BE 검증기(ContentDraftValidationService)와 같다 — 질문은 displayOrder(1부터), 표현은 레벨 안 0부터 또는 전체 0부터, 별점은 starRating 문자열
import type { ContentRuleScope } from '../api/content-rule';
import type { ContentLevel } from '../api/draft-payload';
import { LEVEL_SHORT } from './content-label';

export type ReviewTarget =
  /** index는 열 안 0부터 위치 — 경로엔 displayOrder(index+1)를 적는다 */
  | { kind: 'question'; level: ContentLevel; index: number }
  /** ordinal은 전체 순번 1~12 — 줄을 누를 때는 알고, 검증기 path에서 거꾸로 읽을 때는 모른다 */
  | { kind: 'expression'; level: ContentLevel; index: number; ordinal?: number }
  /** 검증기가 레벨 없이 전체 순번으로 적은 표현 경로(`expressions[3]`) — 줄을 찾을 때만 쓴다 */
  | { kind: 'expression'; ordinal: number }
  /** 별점은 순번이 아니라 starRating('1.0'~'3.0')으로 부른다 — 검증기 경로가 그렇다 */
  | { kind: 'star'; rating: string };

export interface ReviewReference {
  /** 코멘트 본문에 들어가는 표시 */
  label: string;
  /** BE에 저장되는 경로 — 질문은 레벨 안 1부터(displayOrder), 표현은 레벨 안 0부터, 별점은 starRating */
  path: string;
}

export function referenceOf(target: ReviewTarget): ReviewReference {
  switch (target.kind) {
    case 'question':
      return {
        label: `[${LEVEL_SHORT[target.level]} Q${target.index + 1}]`,
        path: `questions[${target.level}][${target.index + 1}]`,
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
        label: `[S ${target.rating}]`,
        path: `starMessages[${target.rating}]`,
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
const FLAT_EXPRESSION = /^expressions\[(\d+)\]/;
const STAR = /^starMessages\[(\d+(?:\.\d+)?)\]/;

/** 검증기·AI 검수의 path를 줄로 — 모르는 경로(scenario.aiRole 등)나 0번 질문(1부터 센다)은 null */
export function targetOfPath(
  path: string | null | undefined,
): ReviewTarget | null {
  if (!path) return null;
  const leveled = LEVELED.exec(path);
  if (leveled) {
    const level = leveled[2] as ContentLevel;
    const number = Number(leveled[3]);
    if (leveled[1] === 'expressions')
      return { kind: 'expression', level, index: number };
    return number >= 1 ? { kind: 'question', level, index: number - 1 } : null;
  }
  const flat = FLAT_EXPRESSION.exec(path);
  if (flat) return { kind: 'expression', ordinal: Number(flat[1]) + 1 };
  const star = STAR.exec(path);
  return star ? { kind: 'star', rating: star[1] } : null;
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
