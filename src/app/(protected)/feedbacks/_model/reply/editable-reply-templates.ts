// 답장 템플릿의 브라우저 저장 — BE 저장 API가 없어 localStorage에 둔다.
// 이 브라우저에서만 유지된다(기기·브라우저를 바꾸면 기본값). 팀 공유가 필요해지면 BE 저장으로 옮긴다
import { REPLY_TEMPLATES, type ReplyTemplate } from './reply-templates';

export const REPLY_TEMPLATES_STORAGE_KEY = 'landit-admin.reply-templates.v1';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** 저장값이 깨졌으면 null — 화면이 빈 칩으로 깨지는 대신 기본값으로 돌아가게 */
function parseStoredTemplates(raw: string | null): ReplyTemplate[] | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value) || value.length === 0) return null;
    const valid = value.every(
      (one) =>
        typeof (one as ReplyTemplate).id === 'string' &&
        typeof (one as ReplyTemplate).label === 'string' &&
        typeof (one as ReplyTemplate).title === 'string' &&
        typeof (one as ReplyTemplate).body === 'string',
    );
    return valid ? (value as ReplyTemplate[]) : null;
  } catch {
    return null;
  }
}

export function readStoredTemplates(storage: StorageLike): ReplyTemplate[] {
  return (
    parseStoredTemplates(storage.getItem(REPLY_TEMPLATES_STORAGE_KEY)) ??
    REPLY_TEMPLATES
  );
}

export function writeStoredTemplates(
  storage: StorageLike,
  templates: ReplyTemplate[],
): void {
  storage.setItem(REPLY_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
}

/** 기본값 복원 — 저장값을 지우면 코드의 공식 템플릿으로 돌아간다 */
export function clearStoredTemplates(storage: StorageLike): void {
  storage.removeItem(REPLY_TEMPLATES_STORAGE_KEY);
}
