// 목록 조회와 테스트 화면에서 같은 시나리오 API 응답을 공유한다.
import { queryOptions } from '@tanstack/react-query';

import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export const scenarioQuery = queryOptions({
  queryKey: ['scenarios'] as const,
  queryFn: () =>
    api.get<Schema<'AdminScenarioListResponse'>>('/api/v1/admin/scenarios'),
});
