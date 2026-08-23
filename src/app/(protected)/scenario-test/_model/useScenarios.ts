'use client';

// 시나리오 목록과 테스트 세션 시작 (docs/screens/scenario-test.md).
// develop 전용 화면이라 내비도 develop에서만 보인다 — 이 훅은 그 판단을 하지 않는다
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';
import { reportError } from '@/shared/monitoring/report';

export type ScenarioCategory = Schema<'CategoryResponse'>;
export type Scenario = Schema<'ScenarioResponse'>;

const PATH = '/api/v1/admin/scenarios';

export function useScenariosQuery() {
  return useQuery({
    queryKey: ['scenarios'] as const,
    queryFn: () => api.get<Schema<'AdminScenarioListResponse'>>(PATH),
  });
}

/** 난이도는 BE가 자유 문자열로 준다 — 아는 값만 우리 말로 바꾸고 나머지는 그대로 보여 준다 */
const DIFFICULTY_LABEL: Record<string, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

export const difficultyLabel = (difficulty: string | undefined) =>
  difficulty ? (DIFFICULTY_LABEL[difficulty] ?? difficulty) : '';

/** "Day 1 · 초급 · scenarioId 100" — 타일 아래 한 줄 (프레임) */
export function scenarioSubLabel(scenario: Scenario): string {
  return [
    scenario.displayOrder ? `Day ${scenario.displayOrder}` : undefined,
    difficultyLabel(scenario.difficulty),
    scenario.scenarioId ? `scenarioId ${scenario.scenarioId}` : undefined,
  ]
    .filter(Boolean)
    .join(' · ');
}

export function useStartSessionMutation() {
  return useMutation({
    mutationFn: (scenarioId: number) =>
      api.post<{ sessionId?: number }>(`${PATH}/${scenarioId}/sessions`),
    onError: (error) => {
      reportError(error);
      toast.error('세션을 시작하지 못했어요. 다시 시도해 주세요');
    },
  });
}
