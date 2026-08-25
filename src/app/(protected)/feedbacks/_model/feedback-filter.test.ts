// 필터 ↔ URL 규칙 검증 — 기본값 생략, 모르는 값 폴백, 조건 변경 시 페이지 초기화
import { describe, expect, it } from 'vitest';

import {
  changeFeedbackFilter,
  DEFAULT_FEEDBACK_FILTER,
  feedbackOpenPath,
  hasActiveFeedbackFilter,
  readFeedbackFilter,
  toFeedbackQuery,
  writeFeedbackFilter,
} from './feedback-filter';

const read = (query: string) => readFeedbackFilter(new URLSearchParams(query));

describe('readFeedbackFilter', () => {
  it('빈 주소면 기본값 — 처리중·최근 30일·최신순', () => {
    expect(read('')).toEqual(DEFAULT_FEEDBACK_FILTER);
  });

  it('status=ALL은 전체(조건 없음)로 읽는다 — 기본값이 처리중이라 "전체"를 표현할 값이 필요하다', () => {
    expect(read('status=ALL').status).toBeUndefined();
  });

  it.each([
    ['type=NOPE', 'type'],
    ['status=NOPE', 'status'],
    ['days=999', 'days'],
    ['sort=NOPE', 'sort'],
    ['page=-3', 'page'],
  ])('%s처럼 모르는 값이 오면 %s는 기본값으로 되돌린다', (query, key) => {
    expect(read(query)[key as 'type']).toEqual(
      DEFAULT_FEEDBACK_FILTER[key as 'type'],
    );
  });

  it('아는 값은 그대로 읽는다', () => {
    expect(
      read('keyword=녹음&type=BUG_REPORT&days=7&sort=OLDEST&page=2'),
    ).toEqual({
      keyword: '녹음',
      type: 'BUG_REPORT',
      status: 'PENDING',
      days: 7,
      sort: 'OLDEST',
      page: 2,
    });
  });
});

describe('writeFeedbackFilter', () => {
  it('기본값은 주소에 적지 않는다', () => {
    expect(writeFeedbackFilter(DEFAULT_FEEDBACK_FILTER)).toBe('');
  });

  it('전체 상태는 ALL로 적는다 — 기본값(처리중)과 구분해야 한다', () => {
    const query = writeFeedbackFilter({
      ...DEFAULT_FEEDBACK_FILTER,
      status: undefined,
    });

    expect(query).toBe('status=ALL');
  });

  it('읽기와 쓰기가 서로를 되돌린다', () => {
    const filter = read(
      'keyword=결제&type=QUESTION&status=COMPLETED&days=90&page=3',
    );

    expect(read(writeFeedbackFilter(filter))).toEqual(filter);
  });
});

describe('changeFeedbackFilter', () => {
  it('조건을 바꾸면 첫 페이지로 돌아간다 — 3페이지보다 결과가 적을 수 있다', () => {
    const filter = { ...DEFAULT_FEEDBACK_FILTER, page: 3 };

    expect(changeFeedbackFilter(filter, { keyword: '녹음' }).page).toBe(0);
  });

  it('페이지만 바꿀 때는 그 페이지로 간다', () => {
    const filter = { ...DEFAULT_FEEDBACK_FILTER, keyword: '녹음' };

    expect(changeFeedbackFilter(filter, { page: 2 }).page).toBe(2);
  });
});

describe('hasActiveFeedbackFilter', () => {
  it('기본 조건만이면 false — 빈 상태 문구를 "아직 없어요"로 낸다', () => {
    expect(hasActiveFeedbackFilter(DEFAULT_FEEDBACK_FILTER)).toBe(false);
  });

  it('페이지만 넘긴 건 조건이 아니다', () => {
    expect(
      hasActiveFeedbackFilter({ ...DEFAULT_FEEDBACK_FILTER, page: 2 }),
    ).toBe(false);
  });

  it.each([
    ['keyword', { keyword: '녹음' }],
    ['type', { type: 'CHEER' as const }],
    ['status', { status: undefined }],
    ['days', { days: 7 }],
  ])(
    '%s를 바꾸면 true — 빈 상태 문구를 "조건에 맞는 게 없어요"로 낸다',
    (_k, patch) => {
      expect(
        hasActiveFeedbackFilter({ ...DEFAULT_FEEDBACK_FILTER, ...patch }),
      ).toBe(true);
    },
  );
});

describe('toFeedbackQuery', () => {
  const now = new Date('2026-08-20T00:00:00.000Z');

  it('days를 createdFrom 날짜로 바꾼다 — BE 계약이 date라 시각을 붙이면 400', () => {
    const query = toFeedbackQuery({ ...DEFAULT_FEEDBACK_FILTER, days: 7 }, now);

    expect(query.createdFrom).toBe('2026-08-13');
  });

  it('전체 기간(0)이면 createdFrom을 보내지 않는다', () => {
    expect(
      toFeedbackQuery({ ...DEFAULT_FEEDBACK_FILTER, days: 0 }, now).createdFrom,
    ).toBeUndefined();
  });

  it('빈 검색어는 보내지 않는다 — 빈 문자열로 거르면 결과가 0이 될 수 있다', () => {
    expect(
      toFeedbackQuery(DEFAULT_FEEDBACK_FILTER, now).keyword,
    ).toBeUndefined();
  });
});

describe('feedbackOpenPath', () => {
  it('처리완료 건은 상태·전체 기간을 함께 싣는다 — 기본 필터(처리중·30일)가 그 건을 걸러 상세가 안 열린다', () => {
    expect(feedbackOpenPath({ feedbackId: 7, status: 'COMPLETED' })).toBe(
      '/feedbacks?status=COMPLETED&days=0&open=7',
    );
  });

  it('처리중 건은 상태를 싣지 않는다 — 기본값이라 주소만 길어진다', () => {
    expect(feedbackOpenPath({ feedbackId: 7, status: 'PENDING' })).toBe(
      '/feedbacks?days=0&open=7',
    );
  });

  it('상태를 모르면 전체 상태로 연다 — 어느 쪽이든 목록에 걸리게', () => {
    expect(feedbackOpenPath({ feedbackId: 7 })).toBe(
      '/feedbacks?status=ALL&days=0&open=7',
    );
  });
});
