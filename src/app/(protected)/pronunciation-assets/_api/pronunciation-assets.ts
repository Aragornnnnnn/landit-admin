// 발음 에셋 현황과 S3 매니페스트 임포트 API를 연결한다.
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

const PATH = '/api/v1/admin/expressions/pronunciation-assets';
export const COVERAGE_KEY = ['pronunciation-assets', 'coverage'] as const;
export type ImportStage = 'reference' | 'tts';
export type ImportResult = Required<
  Schema<'AdminPronunciationAssetImportResult'>
>;
export type Coverage = Required<
  Schema<'AdminPronunciationAssetCoverageResponse'>
>;
export const fetchCoverage = () => api.get<Coverage>(`${PATH}/coverage`);
export async function importAssets(
  stage: ImportStage,
  manifestKey: string,
): Promise<ImportResult> {
  const params = new URLSearchParams({ manifestKey: manifestKey.trim() });
  const result = await api.post<Schema<'AdminPronunciationAssetImportResult'>>(
    `${PATH}/import-${stage}-from-s3?${params}`,
  );
  if (
    typeof result?.inserted !== 'number' ||
    typeof result.updated !== 'number' ||
    !Array.isArray(result.failures)
  )
    throw new Error(
      '임포트 결과를 확인하지 못했어요. 현황을 새로 확인해 주세요.',
    );
  return {
    inserted: result.inserted,
    updated: result.updated,
    failures: result.failures,
  };
}
