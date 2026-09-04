// 답장 본문에 이미지를 붙여넣는 규칙 — 어떤 파일을 받고, 커서 자리에 무엇을 끼우고, 업로드가 끝나면 자리표시를 어떻게 바꾸는지 (docs/screens/feedbacks.md "답장 본문 마크다운")
import { MAX_IMAGE_BYTES } from '@/features/content-image/api/upload-content-image';

/** 올라가는 동안 커서 자리를 지키는 글. 앱에서도 그려질 수 있는 정상 마크다운이라 실수로 보내져도 깨지지 않는다 */
export const UPLOAD_PLACEHOLDER = '![업로드 중...]()';

/** 본문 안에서 자리표시가 차지하는 구간 */
export interface Slot {
  start: number;
  end: number;
}

/** 붙여넣은 것 중 이미지만 고른다. 이미지가 아닌 건 조용히 무시하고, 너무 큰 건 알려야 하니 따로 돌려준다 */
export function pickImageFiles(files: Iterable<File>): {
  accepted: File[];
  oversized: File[];
} {
  const accepted: File[] = [];
  const oversized: File[] = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    (file.size > MAX_IMAGE_BYTES ? oversized : accepted).push(file);
  }
  return { accepted, oversized };
}

/** 커서 자리에 자리표시를 count개 끼운다(한 장씩 줄바꿈). 커서는 끼운 글 뒤로 */
export function insertPlaceholders(
  text: string,
  cursor: number,
  count: number,
): { text: string; cursor: number; slots: Slot[] } {
  const slots: Slot[] = [];
  let at = cursor;
  for (let index = 0; index < count; index += 1) {
    if (index > 0) at += 1; // '\n'
    slots.push({ start: at, end: at + UPLOAD_PLACEHOLDER.length });
    at += UPLOAD_PLACEHOLDER.length;
  }
  const snippet = Array.from({ length: count }, () => UPLOAD_PLACEHOLDER).join(
    '\n',
  );
  return {
    text: text.slice(0, cursor) + snippet + text.slice(cursor),
    cursor: cursor + snippet.length,
    slots,
  };
}

/** 파일명의 대괄호·소괄호는 뺀다 — 마크다운 문법을 깨뜨린다 */
export function imageMarkdown(fileName: string, url: string): string {
  return `![${fileName.replace(/[[\]()]/g, '')}](${url})`;
}

/**
 * 자리표시 하나를 결과로 바꾼다. 기억한 자리에 자리표시가 그대로면 거기를, 사용자가 앞쪽을 고쳐 밀렸으면
 * 가장 가까운 자리표시를 찾아 바꾼다. 자리표시를 아예 지웠으면 본문을 건드리지 않는다(null).
 * 같은 글자의 자리표시가 여러 개라 문자열 치환으로는 어느 것인지 알 수 없어 위치로 잡는다.
 * 업로드 중에 자리표시 사이 거리보다 많이 고치면 다른 자리표시와 바뀔 수 있다 — 그 정도는 감수한다
 */
export function replacePlaceholder(
  text: string,
  slot: Slot,
  replacement: string,
): { text: string; at: number; delta: number } | null {
  const at = locatePlaceholder(text, slot);
  if (at === null) return null;
  return {
    text:
      text.slice(0, at) +
      replacement +
      text.slice(at + UPLOAD_PLACEHOLDER.length),
    at,
    delta: replacement.length - UPLOAD_PLACEHOLDER.length,
  };
}

function locatePlaceholder(text: string, slot: Slot): number | null {
  if (text.slice(slot.start, slot.end) === UPLOAD_PLACEHOLDER)
    return slot.start;

  let nearest: number | null = null;
  let from = text.indexOf(UPLOAD_PLACEHOLDER);
  while (from !== -1) {
    if (
      nearest === null ||
      Math.abs(from - slot.start) < Math.abs(nearest - slot.start)
    )
      nearest = from;
    from = text.indexOf(UPLOAD_PLACEHOLDER, from + 1);
  }
  return nearest;
}

/** 한 자리가 바뀌어 길이가 달라지면 그 뒤의 슬롯들을 그만큼 민다 */
export function shiftSlots(slots: Slot[], at: number, delta: number): Slot[] {
  return slots.map((slot) =>
    slot.start > at
      ? { start: slot.start + delta, end: slot.end + delta }
      : slot,
  );
}
