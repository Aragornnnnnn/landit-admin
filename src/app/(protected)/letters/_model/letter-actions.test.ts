import { describe, expect, it } from 'vitest';

import {
  LETTER_CONFIRM,
  letterActionPatch,
  letterMenuItems,
} from './letter-actions';
import type { LetterItem } from './useLetterGroupQuery';

const letter = (patch: Partial<LetterItem> = {}): LetterItem => ({
  letterId: 1,
  type: 'NOTICE',
  title: '점검 안내',
  publicationStatus: 'PUBLISHED',
  pinned: false,
  ...patch,
});

describe('letterMenuItems', () => {
  it('발행된 편지는 고정과 숨기기', () => {
    expect(letterMenuItems(letter()).map((menu) => menu.label)).toEqual([
      '고정',
      '숨기기',
    ]);
  });

  it('이미 고정됐으면 고정 해제로 바뀐다', () => {
    expect(letterMenuItems(letter({ pinned: true }))[0]).toMatchObject({
      action: 'unpin',
      label: '고정 해제',
    });
  });

  it('업데이트는 고정할 수 없고 이유를 함께 말한다', () => {
    expect(letterMenuItems(letter({ type: 'UPDATE' }))[0]).toMatchObject({
      disabledReason: '공지만 고정할 수 있어요',
    });
  });

  it('임시저장은 발행하기, 숨김은 다시 보이기', () => {
    expect(
      letterMenuItems(letter({ publicationStatus: 'DRAFT' })).map(
        (menu) => menu.action,
      ),
    ).toEqual(['publish']);
    expect(
      letterMenuItems(letter({ publicationStatus: 'UNPUBLISHED' })).map(
        (menu) => menu.action,
      ),
    ).toEqual(['unhide']);
  });

  it('숨기기만 빨간 항목이다 — 사용자에게 보이는 걸 없애는 유일한 행동', () => {
    const destructive = letterMenuItems(letter()).filter(
      (menu) => menu.destructive,
    );
    expect(destructive.map((menu) => menu.action)).toEqual(['hide']);
  });
});

describe('letterActionPatch', () => {
  it('바꿀 것만 보낸다 — PATCH는 부분 수정이다', () => {
    expect(letterActionPatch('publish')).toEqual({
      publicationStatus: 'PUBLISHED',
    });
    expect(letterActionPatch('hide')).toEqual({
      publicationStatus: 'UNPUBLISHED',
    });
    expect(letterActionPatch('unhide')).toEqual({
      publicationStatus: 'PUBLISHED',
    });
    expect(letterActionPatch('pin')).toEqual({ pinned: true });
    expect(letterActionPatch('unpin')).toEqual({ pinned: false });
  });
});

describe('LETTER_CONFIRM', () => {
  it('편지함이 바로 바뀌는 일만 묻는다 — 고정은 순서만 바꾸므로 묻지 않는다', () => {
    expect(Object.keys(LETTER_CONFIRM).sort()).toEqual([
      'hide',
      'publish',
      'unhide',
    ]);
  });
});
