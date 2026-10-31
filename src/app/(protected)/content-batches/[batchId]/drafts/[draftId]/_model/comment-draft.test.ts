import { describe, expect, it } from 'vitest';

import {
  canSaveReview,
  readCommentDraft,
  reviewCommentsOf,
  writeCommentDraft,
} from './comment-draft';

function memoryStorage(seed: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(seed));
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

describe('readCommentDraft · writeCommentDraft', () => {
  it('저장해 둔 초안을 새로고침 뒤에 그대로 읽는다', () => {
    const storage = memoryStorage();
    writeCommentDraft(601, { text: '[L1 Q2] 기댐', targetPath: 'q' }, storage);

    expect(readCommentDraft(601, storage)).toEqual({
      text: '[L1 Q2] 기댐',
      targetPath: 'q',
    });
  });

  it('기록이 깨졌으면 빈 초안으로 시작한다', () => {
    const storage = memoryStorage({ 'content-comment:601': '{broken' });

    expect(readCommentDraft(601, storage)).toEqual({
      text: '',
      targetPath: '',
    });
  });

  it('빈 초안을 저장하면 기록을 지운다 — 저장 성공 뒤 비우는 길', () => {
    const storage = memoryStorage({ 'content-comment:601': '{"text":"a"}' });

    writeCommentDraft(601, { text: '', targetPath: '' }, storage);

    expect(storage.getItem('content-comment:601')).toBeNull();
  });

  it('저장소가 막혀 있어도 던지지 않는다', () => {
    const storage = {
      ...memoryStorage(),
      setItem: () => {
        throw new Error('quota');
      },
    } as Storage;

    expect(() =>
      writeCommentDraft(601, { text: 'a', targetPath: '' }, storage),
    ).not.toThrow();
  });
});

describe('canSaveReview', () => {
  it('FIX는 코멘트가 있어야 하고 OK는 없어도 된다', () => {
    const empty = { text: '   ', targetPath: 'questions[LEVEL_1][0]' };

    expect(canSaveReview('FIX', empty)).toBe(false);
    expect(canSaveReview('OK', empty)).toBe(true);
  });
});

describe('reviewCommentsOf', () => {
  it('본문이 없으면 코멘트를 보내지 않고, 경로는 적었을 때만 싣는다', () => {
    expect(reviewCommentsOf({ text: ' ', targetPath: 'x' })).toEqual([]);
    expect(reviewCommentsOf({ text: ' 어색함 ', targetPath: '' })).toEqual([
      { comment: '어색함' },
    ]);
    expect(
      reviewCommentsOf({
        text: '[E 1] 겹침',
        targetPath: 'expressions[LEVEL_1][0]',
      }),
    ).toEqual([
      { targetPath: 'expressions[LEVEL_1][0]', comment: '[E 1] 겹침' },
    ]);
  });
});
