'use client';

// URL에 선택을 보관하며 제작 배치와 각 Day의 실제 서버 상태를 조회한다.
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/shared/ui/shadcn/button';

import { shouldPoll } from '../_model/content-state';
import { readObject, readText, STATUS_LABELS } from '../_model/content-view';
import {
  useContentBatchesQuery,
  useContentBatchQuery,
  useContentDraftQuery,
} from '../_model/useContentQuery';
import { ContentDraftView } from './ContentDraftView';

function positive(value: string | null): number | undefined {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : undefined;
}
export function ContentBatchesPage() {
  const params = useSearchParams();
  const router = useRouter();
  const page = positive(params.get('page')) ?? 0;
  const list = useContentBatchesQuery(page);
  const batchId = positive(params.get('batch')) ?? list.data?.items[0]?.batchId;
  const batch = useContentBatchQuery(batchId);
  const selected =
    batch.data?.days.find(
      (day) => day.draftId === positive(params.get('draft')),
    ) ?? batch.data?.days[0];
  const draft = useContentDraftQuery(
    batchId,
    selected?.draftId,
    shouldPoll(batch.data),
    selected?.status,
  );
  function select(values: { page?: number; batch?: number; draft?: number }) {
    const next = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) next.set(key, String(value));
    });
    router.replace(`/content-batches?${next.toString()}`, { scroll: false });
  }
  const failure = list.error ?? batch.error ?? draft.error;
  return (
    <div className="space-y-5 pb-10">
      <p className="text-sm text-body">
        제작 배치의 진행 상태와 Day별 질문·표현을 확인하세요.
      </p>
      {failure && (
        <div
          role="alert"
          className="space-y-2 rounded-xl border border-destructive p-4 text-sm"
        >
          <p>{failure.message}</p>
          <Button
            variant="outline"
            onClick={() => {
              void list.refetch();
              if (batchId) void batch.refetch();
              if (selected) void draft.refetch();
            }}
          >
            다시 불러오기
          </Button>
        </div>
      )}
      {list.isPending ? (
        <p role="status">제작 목록을 불러오는 중이에요.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="제작 배치"
              className="min-w-0 rounded-lg border bg-card px-3 py-2"
              value={batchId ?? ''}
              onChange={(e) => select({ page, batch: Number(e.target.value) })}
            >
              {!list.data?.items.length && (
                <option value="">제작 배치 없음</option>
              )}
              {batchId &&
                !list.data?.items.some((b) => b.batchId === batchId) && (
                  <option value={batchId}>배치 {batchId}</option>
                )}
              {list.data?.items.map((b) => (
                <option key={b.batchId} value={b.batchId}>
                  Day {b.startDay}~{b.endDay} · {STATUS_LABELS[b.status]}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              disabled={page === 0}
              onClick={() => select({ page: page - 1 })}
            >
              이전
            </Button>
            <span className="text-sm">{page + 1}페이지</span>
            <Button
              variant="outline"
              disabled={!list.data?.hasNext}
              onClick={() => select({ page: page + 1 })}
            >
              다음
            </Button>
          </div>
          {!list.data?.items.length && !batchId && (
            <p className="rounded-xl bg-card p-8">아직 제작한 배치가 없어요.</p>
          )}
        </>
      )}
      {batch.isPending && batchId && (
        <p role="status">배치를 불러오는 중이에요.</p>
      )}
      {batch.data && (
        <>
          <section className="space-y-3 rounded-xl border bg-card p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <h2 className="text-xl font-bold">
                Day {batch.data.batch.startDay}~{batch.data.batch.endDay}
              </h2>
              <span>{STATUS_LABELS[batch.data.batch.status]}</span>
            </div>
            <p className="text-sm text-body">
              전체 {batch.data.days.length}개 중 초안 준비{' '}
              {
                batch.data.days.filter((d) =>
                  [
                    'REVIEW_READY',
                    'NEEDS_FIX',
                    'OK',
                    'APPROVED',
                    'PUBLISHED',
                  ].includes(d.status),
                ).length
              }
              개
            </p>
            {batch.data.batch.note && (
              <p className="text-sm text-subtle">{batch.data.batch.note}</p>
            )}
            {batch.data.batch.errorMessage && (
              <p role="alert" className="text-destructive">
                {batch.data.batch.errorMessage}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {batch.data.days.map((day) => (
                <Button
                  key={day.draftId}
                  variant={
                    selected?.draftId === day.draftId ? 'default' : 'outline'
                  }
                  onClick={() =>
                    select({ page, batch: batchId, draft: day.draftId })
                  }
                >
                  Day {day.plannedDay} · {STATUS_LABELS[day.status]}
                </Button>
              ))}
            </div>
          </section>
          {batch.data.batch.status === 'LINEUP_READY' && (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <h3 className="font-bold">시나리오 목록 확인</h3>
              {batch.data.days.map((day) => {
                const row = readObject(day.lineupRow);
                return (
                  <article
                    className="space-y-2 border-t pt-3"
                    key={day.draftId}
                  >
                    <h4 className="font-semibold">
                      Day {day.plannedDay} · {day.title ?? readText(row.title)}
                    </h4>
                    <p className="text-sm text-subtle">
                      {readText(row.characterId)} · {readText(row.difficulty)} ·
                      시작 {readText(row.firstSpeaker)} · 카테고리{' '}
                      {readText(row.categoryDisplayOrder) ||
                        readText(row.proposedCategory)}
                    </p>
                    <p className="text-sm">
                      {Array.isArray(row.beats)
                        ? row.beats.map(readText).join(' / ')
                        : '대화 구성 없음'}
                    </p>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
      {draft.data && (
        <>
          <p role="status" className="text-sm text-subtle">
            {STATUS_LABELS[draft.data.status]}
            {draft.data.errorMessage ? ` · ${draft.data.errorMessage}` : ''}
          </p>
          <ContentDraftView
            key={draft.data.draftId}
            draft={draft.data}
            note={undefined}
          />
        </>
      )}
    </div>
  );
}
