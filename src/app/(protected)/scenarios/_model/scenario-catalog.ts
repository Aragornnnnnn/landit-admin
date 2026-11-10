// API 목록을 검색 가능한 행으로 바꾸고 정렬·페이지 범위를 계산한다.
import type { Schema } from '@/shared/api/schema-patch';

export type ScenarioRow = Schema<'ScenarioResponse'> & {
  scenarioId: number;
  categoryKey: string;
  categoryName: string;
};
export const PAGE_SIZE = 20;
export const DIFFICULTIES: Record<string, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

export function collectScenarios(
  data: Schema<'AdminScenarioListResponse'>,
): ScenarioRow[] {
  return (data.categories ?? [])
    .flatMap((category) =>
      (category.scenarios ?? []).map((scenario) => {
        const id = scenario.scenarioId;
        if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) {
          throw new Error(
            '시나리오 ID를 확인할 수 없어요. 다시 불러와 주세요.',
          );
        }
        return {
          ...scenario,
          scenarioId: id,
          categoryKey: String(category.categoryId ?? ''),
          categoryName: category.categoryName ?? '미등록',
        };
      }),
    )
    .sort(
      (a, b) =>
        (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity) ||
        a.scenarioId - b.scenarioId,
    );
}

export function filterScenarios(rows: ScenarioRow[], params: URLSearchParams) {
  const words = (params.get('q') ?? '')
    .normalize('NFC')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return rows.filter((row) => {
    const text = [
      row.scenarioId,
      `Day ${row.displayOrder ?? ''}`,
      row.scenarioTitle,
      row.briefing,
      row.conversationGoal,
    ]
      .join(' ')
      .normalize('NFC')
      .toLowerCase();
    return (
      words.every((word) => text.includes(word)) &&
      (!params.get('category') || row.categoryKey === params.get('category')) &&
      (!params.get('difficulty') || row.difficulty === params.get('difficulty'))
    );
  });
}

export function catalogPage(value: string | null, count: number) {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0
    ? Math.min(page - 1, Math.max(0, Math.ceil(count / PAGE_SIZE) - 1))
    : 0;
}
