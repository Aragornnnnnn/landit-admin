// 담당자 검수 코멘트 초안 — 대상 경로·본문, 새로고침 대비 sessionStorage 임시 저장, PUT review 몸체 (docs/screens/content-batches.md "담당자 검수")
import type {
  ReviewCommentRequest,
  ReviewVerdict,
} from '@/features/content/api/content-batch';
import type { CommentDraft } from '@/features/content/model/review-reference';

export type { CommentDraft };

export const COMMENT_MAX = 2000;
export const EMPTY_COMMENT: CommentDraft = { text: '', targetPath: '' };

const KEY_PREFIX = 'content-comment:';

function defaultStorage(): Storage | undefined {
  return typeof window === 'undefined' ? undefined : window.sessionStorage;
}

/** 임시 저장을 읽는다 — 없거나 깨졌거나 저장소가 막혀 있으면 빈 초안 */
export function readCommentDraft(
  draftId: number,
  storage = defaultStorage(),
): CommentDraft {
  try {
    const raw = storage?.getItem(`${KEY_PREFIX}${draftId}`);
    if (!raw) return EMPTY_COMMENT;
    const parsed = JSON.parse(raw) as Partial<CommentDraft>;
    return {
      text: typeof parsed.text === 'string' ? parsed.text : '',
      targetPath:
        typeof parsed.targetPath === 'string' ? parsed.targetPath : '',
    };
  } catch {
    return EMPTY_COMMENT;
  }
}

/** 빈 초안은 지운다 — 저장 성공 뒤 비우는 것과 같은 길 */
export function writeCommentDraft(
  draftId: number,
  draft: CommentDraft,
  storage = defaultStorage(),
) {
  try {
    const key = `${KEY_PREFIX}${draftId}`;
    if (!draft.text && !draft.targetPath) storage?.removeItem(key);
    else storage?.setItem(key, JSON.stringify(draft));
  } catch {
    // 못 남겨도 입력은 화면에 있다 — 새로고침 복구만 포기한다
  }
}

/** FIX는 코멘트 1자 이상 필수(BE 400). OK는 코멘트 없이도 된다 */
export function canSaveReview(
  verdict: ReviewVerdict,
  draft: CommentDraft,
): boolean {
  return verdict === 'OK' || draft.text.trim().length > 0;
}

/** PUT review의 comments — 본문이 있을 때만 한 건, 경로는 적었을 때만 */
export function reviewCommentsOf(draft: CommentDraft): ReviewCommentRequest[] {
  const comment = draft.text.trim();
  if (!comment) return [];
  const targetPath = draft.targetPath.trim();
  return [targetPath ? { targetPath, comment } : { comment }];
}
