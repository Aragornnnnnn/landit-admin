import { describe, expect, it } from 'vitest';

import { markRegenerated, markViewed, needsRevisit } from './review-visit';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
  };
}

describe('needsRevisit', () => {
  it('재생성을 누른 Day가 생성을 마쳤는데 아직 안 봤으면 다시 볼 것이다', () => {
    const storage = memoryStorage();
    markRegenerated(301, new Date('2026-10-22T10:00:00'), storage);

    expect(needsRevisit(301, 'GENERATING', storage)).toBe(false);
    expect(needsRevisit(301, 'REVIEW_READY', storage)).toBe(true);
  });

  it('재생성 뒤에 열어 봤으면 더는 다시 볼 것이 아니다', () => {
    const storage = memoryStorage();
    markRegenerated(301, new Date('2026-10-22T10:00:00'), storage);
    markViewed(301, new Date('2026-10-22T10:05:00'), storage);

    expect(needsRevisit(301, 'NEEDS_FIX', storage)).toBe(false);
  });

  it('재생성 전에 본 기록은 다시 볼 것을 지우지 못한다', () => {
    const storage = memoryStorage();
    markViewed(301, new Date('2026-10-22T09:00:00'), storage);
    markRegenerated(301, new Date('2026-10-22T10:00:00'), storage);

    expect(needsRevisit(301, 'OK', storage)).toBe(true);
  });

  it('기록이 없거나 저장소가 깨져 있으면 다시 볼 것이 아니다', () => {
    const broken = {
      ...memoryStorage(),
      getItem: () => {
        throw new Error('blocked');
      },
    } as Storage;

    expect(needsRevisit(301, 'OK', memoryStorage())).toBe(false);
    expect(needsRevisit(301, 'OK', broken)).toBe(false);
  });
});
