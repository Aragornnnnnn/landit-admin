// 시나리오 검색·정렬·페이지 경계를 검증한다.
import { describe, expect, it } from 'vitest';

import {
  catalogPage,
  collectScenarios,
  filterScenarios,
} from './scenario-catalog';

const rows = collectScenarios({
  categories: [
    {
      categoryId: 2,
      categoryName: '여행',
      scenarios: [
        {
          scenarioId: 50,
          displayOrder: 2,
          scenarioTitle: 'Airport Check-in',
          difficulty: 'BEGINNER',
          conversationGoal: '좌석 요청',
        },
      ],
    },
    {
      categoryId: 1,
      categoryName: '일상',
      scenarios: [
        {
          scenarioId: 10,
          displayOrder: 1,
          scenarioTitle: '카페 주문',
          briefing: '우유 바꾸기',
          difficulty: 'INTERMEDIATE',
        },
      ],
    },
  ],
});
describe('시나리오 목록', () => {
  it('카테고리가 섞여 있으면 Day 순으로 정렬한다', () => {
    expect(rows.map((row) => row.scenarioId)).toEqual([10, 50]);
  });
  it.each(['AIRPORT 좌석', 'Day 2', '50'])(
    '%s로 검색하면 관련 시나리오를 찾는다',
    (q) => {
      expect(
        filterScenarios(rows, new URLSearchParams({ q })).map(
          (row) => row.scenarioId,
        ),
      ).toEqual([50]);
    },
  );
  it('검색과 필터를 함께 지정하면 모두 만족하는 항목만 반환한다', () => {
    expect(
      filterScenarios(
        rows,
        new URLSearchParams({
          q: '우유',
          category: '1',
          difficulty: 'INTERMEDIATE',
        }),
      ),
    ).toHaveLength(1);
    expect(
      filterScenarios(rows, new URLSearchParams({ q: '우유', category: '2' })),
    ).toHaveLength(0);
  });
  it.each(['-1', 'abc', '1.5', 'Infinity'])(
    '페이지가 %s이면 첫 페이지로 보정한다',
    (page) => {
      expect(catalogPage(page, 40)).toBe(0);
    },
  );
  it('페이지가 결과 범위를 벗어나면 마지막 페이지로 보정한다', () => {
    expect(catalogPage('99', 21)).toBe(1);
    expect(catalogPage('99', 0)).toBe(0);
  });
  it('ID 없는 항목을 받으면 잘못된 선택 대신 오류를 알린다', () => {
    expect(() =>
      collectScenarios({ categories: [{ scenarios: [{}] }] }),
    ).toThrow('시나리오 ID');
  });
});
