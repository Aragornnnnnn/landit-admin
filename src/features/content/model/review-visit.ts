// "다시 볼 것" 로컬 기록 — 재생성을 누른 시각과 상세를 연 시각을 브라우저에 남긴다. 서버엔 열람 기록이 없다 (docs/screens/content-batches.md "Day 목록")
import type { ContentDraftStatus } from '../api/content-batch';

const KEY_PREFIX = 'content-review:';

interface VisitRecord {
  regeneratedAt?: string;
  viewedAt?: string;
}

function defaultStorage(): Storage | undefined {
  return typeof window === 'undefined' ? undefined : window.localStorage;
}

// 사생활 모드·용량 초과면 저장소가 던진다 — 기록이 없는 것으로 치고 화면은 계속 그린다
function readRecord(
  draftId: number,
  storage: Storage | undefined,
): VisitRecord {
  try {
    const raw = storage?.getItem(`${KEY_PREFIX}${draftId}`);
    return raw ? (JSON.parse(raw) as VisitRecord) : {};
  } catch {
    return {};
  }
}

function writeRecord(
  draftId: number,
  patch: VisitRecord,
  storage: Storage | undefined,
) {
  try {
    const next = { ...readRecord(draftId, storage), ...patch };
    storage?.setItem(`${KEY_PREFIX}${draftId}`, JSON.stringify(next));
  } catch {
    // 못 남겨도 기능은 "다시 볼 것" 표시 하나뿐이다
  }
}

export function markRegenerated(
  draftId: number,
  now: Date = new Date(),
  storage = defaultStorage(),
) {
  writeRecord(draftId, { regeneratedAt: now.toISOString() }, storage);
}

/** 상세를 열었을 때 — 아직 만드는 중(GENERATING)이면 부르지 않는다. 그때 본 건 새 결과를 본 게 아니다 */
export function markViewed(
  draftId: number,
  now: Date = new Date(),
  storage = defaultStorage(),
) {
  writeRecord(draftId, { viewedAt: now.toISOString() }, storage);
}

/** 재생성을 눌렀고, 생성이 끝났는데, 그 뒤로 연 적이 없으면 true */
export function needsRevisit(
  draftId: number,
  status: ContentDraftStatus,
  storage = defaultStorage(),
): boolean {
  if (status === 'GENERATING') return false;
  const { regeneratedAt, viewedAt } = readRecord(draftId, storage);
  if (!regeneratedAt) return false;
  return !viewedAt || viewedAt < regeneratedAt;
}
