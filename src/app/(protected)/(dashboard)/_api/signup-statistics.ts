// 개인정보 목록 대신 서울 달력 기준 가입 통계만 조회한다.
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export async function fetchSignupStatistics() {
  const data = await api.get<Schema<'AdminSignupStatisticsResponse'>>(
    '/api/v1/admin/users/signup-statistics',
  );
  if (
    !data ||
    ![data.thisWeek, data.lastWeek, data.thisMonth, data.lastMonth].every(
      (value) => Number.isSafeInteger(value) && value >= 0,
    ) ||
    !data.asOf
  ) {
    throw new Error('가입 통계 응답이 올바르지 않습니다.');
  }
  return data;
}
