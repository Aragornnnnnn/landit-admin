'use client';

// 억양별 기준 데이터·음성 보유 수와 누락 표현을 보여준다.
import { useQuery } from '@tanstack/react-query';

import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Button } from '@/shared/ui/shadcn/button';

import { COVERAGE_KEY, fetchCoverage } from '../_api/pronunciation-assets';

const ACCENTS: Record<string, string> = {
  EN_US: '미국',
  EN_GB: '영국',
  EN_AU: '호주',
};
export function CoverageCard() {
  const query = useQuery({ queryKey: COVERAGE_KEY, queryFn: fetchCoverage });
  return (
    <section className="space-y-4 rounded-[20px] bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">발음 에셋 현황</h2>
        <Button
          variant="outline"
          disabled={query.isFetching}
          onClick={() => query.refetch()}
        >
          현황 새로고침
        </Button>
      </div>
      {query.isPending ? (
        <ListSkeleton rows={3} />
      ) : query.isError ? (
        <InlineError onRetry={() => query.refetch()} />
      ) : (
        <>
          <p className="text-sm text-subtle">
            활성 표현 {query.data.totalActiveExpressions}개
          </p>
          {!query.data.locales.length ? (
            <EmptyState title="등록된 억양 현황이 없어요" />
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {query.data.locales.map((locale) => (
                <div
                  key={locale.accentLocale}
                  className="space-y-3 rounded-xl bg-muted p-5"
                >
                  <h3 className="font-bold">
                    {ACCENTS[locale.accentLocale ?? ''] ?? locale.accentLocale}
                  </h3>
                  <p className="text-sm">
                    기준 데이터 {locale.referenceCovered ?? 0}개 · 음성{' '}
                    {locale.audioCovered ?? 0}개
                  </p>
                  <MissingIds
                    label="기준 데이터 누락"
                    ids={locale.referenceMissing ?? []}
                  />
                  <MissingIds
                    label="기준 데이터는 있으나 음성 누락"
                    ids={locale.audioMissing ?? []}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
function MissingIds({ label, ids }: { label: string; ids: number[] }) {
  return (
    <details className="text-xs text-body">
      <summary className="cursor-pointer py-2">
        {label} {ids.length}개
      </summary>
      <p className="max-h-40 overflow-y-auto leading-relaxed break-words text-subtle">
        {ids.length ? ids.join(', ') : '누락 없음'}
      </p>
    </details>
  );
}
