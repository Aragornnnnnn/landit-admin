'use client';

// 활성 시나리오를 검색·필터링하고 선택한 항목의 상세 정보를 보여 준다.
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { scenarioQuery } from '@/features/scenario/model/scenario-query';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Pagination } from '@/shared/ui/Pagination';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';

import {
  catalogPage,
  collectScenarios,
  DIFFICULTIES,
  filterScenarios,
  PAGE_SIZE,
} from '../_model/scenario-catalog';
import { useApiHost } from '../../_model/api-host';
import { isDevelopServer } from '../../_model/navigation';
import { ScenarioDetail } from './ScenarioDetail';

export function ScenarioCatalogPage() {
  const host = useApiHost();
  return isDevelopServer(host) ? (
    <Catalog />
  ) : (
    <EmptyState
      title="develop에서 조회할 수 있어요"
      description="현재 시나리오 조회 API는 develop 서버에서만 제공돼요."
    />
  );
}

function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const query = useQuery({ ...scenarioQuery, select: collectScenarios });
  const all = query.data ?? [];
  const filtered = filterScenarios(all, new URLSearchParams(params.toString()));
  const page = catalogPage(params.get('page'), filtered.length);
  const selected = filtered.find(
    (row) => String(row.scenarioId) === params.get('scenario'),
  );
  const categories = [
    ...new Map(all.map((row) => [row.categoryKey, row.categoryName])).entries(),
  ];
  const difficulties = [
    ...new Set(all.flatMap((row) => (row.difficulty ? [row.difficulty] : []))),
  ];
  function navigate(changes: Record<string, string>, reset = false) {
    const next = new URLSearchParams(params.toString());
    if (reset) {
      next.delete('page');
      next.delete('scenario');
    }
    Object.entries(changes).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    router.push(`/scenarios?${next.toString()}`, { scroll: false });
  }
  return (
    <div className="space-y-5 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-body">
          develop에 등록된 활성 시나리오를 조회해요. 관리자 프로필의 언어 설정이
          적용돼요.
        </p>
        <Button
          variant="outline"
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          {query.isFetching ? '불러오는 중' : '새로고침'}
        </Button>
      </header>
      <form
        key={params.get('q') ?? ''}
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(
            {
              q: String(
                new FormData(event.currentTarget).get('q') ?? '',
              ).trim(),
            },
            true,
          );
        }}
      >
        <label className="min-w-48 flex-1 text-xs text-subtle">
          검색
          <Input
            name="q"
            aria-label="시나리오 검색"
            defaultValue={params.get('q') ?? ''}
            placeholder="제목·설명·목표·Day·ID"
            className="mt-1"
          />
        </label>
        <Button type="submit">검색</Button>
        <label className="text-xs text-subtle">
          카테고리
          <select
            aria-label="카테고리"
            value={params.get('category') ?? ''}
            onChange={(e) => navigate({ category: e.target.value }, true)}
            className="mt-1 block h-9 max-w-48 rounded-md border bg-card px-2 text-sm text-foreground"
          >
            <option value="">전체 카테고리</option>
            {categories.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-subtle">
          난이도
          <select
            aria-label="난이도"
            value={params.get('difficulty') ?? ''}
            onChange={(e) => navigate({ difficulty: e.target.value }, true)}
            className="mt-1 block h-9 rounded-md border bg-card px-2 text-sm text-foreground"
          >
            <option value="">전체 난이도</option>
            {difficulties.map((value) => (
              <option key={value} value={value}>
                {DIFFICULTIES[value] ?? value}
              </option>
            ))}
          </select>
        </label>
        <Button
          type="button"
          variant="ghost"
          onClick={(event) => {
            event.currentTarget.form?.reset();
            router.push('/scenarios');
          }}
        >
          초기화
        </Button>
      </form>
      {query.isPending ? (
        <ListSkeleton rows={5} />
      ) : query.isError ? (
        <InlineError
          message={query.error.message}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <>
          <p className="text-sm text-subtle" role="status">
            전체 {all.length}개 중 {filtered.length}개
          </p>
          <div className="grid items-start gap-5 xl:grid-cols-2">
            <section aria-label="시나리오 목록" className="min-w-0 space-y-4">
              {filtered.length === 0 ? (
                <EmptyState
                  title={
                    all.length
                      ? '검색 조건에 맞는 시나리오가 없어요'
                      : '활성 시나리오가 없어요'
                  }
                  description={
                    all.length ? '검색어나 필터를 바꿔 보세요.' : undefined
                  }
                />
              ) : (
                <div className="divide-y rounded-xl bg-card">
                  {filtered
                    .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
                    .map((row) => (
                      <button
                        type="button"
                        key={row.scenarioId}
                        aria-pressed={selected?.scenarioId === row.scenarioId}
                        onClick={() =>
                          navigate({ scenario: String(row.scenarioId) })
                        }
                        className="flex w-full items-start gap-4 p-4 text-left hover:bg-muted aria-pressed:bg-muted"
                      >
                        <span className="shrink-0 text-sm font-semibold">
                          Day {row.displayOrder ?? '—'}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium break-words">
                            {row.scenarioTitle ?? '제목 미등록'}
                          </span>
                          <span className="mt-1 block text-xs text-subtle">
                            ID {row.scenarioId} · {row.categoryName} ·{' '}
                            {DIFFICULTIES[row.difficulty ?? ''] ??
                              row.difficulty ??
                              '난이도 미등록'}
                          </span>
                        </span>
                      </button>
                    ))}
                </div>
              )}
              <Pagination
                page={page}
                size={PAGE_SIZE}
                totalElements={filtered.length}
                totalPages={Math.ceil(filtered.length / PAGE_SIZE)}
                onChangePage={(target) =>
                  navigate({ page: String(target + 1), scenario: '' })
                }
              />
            </section>
            {selected ? (
              <ScenarioDetail
                row={selected}
                onClose={() => navigate({ scenario: '' })}
              />
            ) : (
              <EmptyState
                title={
                  params.has('scenario')
                    ? '선택한 시나리오가 현재 조회 목록에 없어요'
                    : '시나리오를 선택하면 상세 정보가 표시돼요'
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
