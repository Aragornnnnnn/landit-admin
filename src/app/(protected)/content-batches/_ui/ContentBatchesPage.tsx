'use client';

// 1차 배치 상세 — 라인업 읽기·Day 선택·검수·승인을 한 화면에. LAN-811·812·813이 Figma 안으로 나누면 지운다. 배치는 라우트가 정하고 Day만 URL(draft)에 둔다
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/shared/ui/shadcn/button';

import { shouldPoll } from '../_model/content-state';
import { readObject, readText, STATUS_LABELS } from '../_model/content-view';
import {
  useContentBatchQuery,
  useContentDraftQuery,
} from '../_model/useContentQuery';
import { BatchActions } from './BatchActions';
import { ContentDraftView } from './ContentDraftView';
import { DraftActions } from './DraftActions';

function positive(value: string | null): number | undefined {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : undefined;
}
export function ContentBatchesPage({ batchId }: { batchId: number }) {
  const params = useSearchParams();
  const router = useRouter();
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
  function select(values: { draft?: number }) {
    const next = new URLSearchParams();
    if (values.draft !== undefined) next.set('draft', String(values.draft));
    router.replace(`/content-batches/${batchId}?${next.toString()}`, {
      scroll: false,
    });
  }
  const failure = batch.error ?? draft.error;
  return (
    <div className="space-y-5 pb-10">
      {failure && (
        <div
          role="alert"
          className="space-y-2 rounded-xl border border-destructive p-4 text-sm"
        >
          <p>{failure.message}</p>
          <Button
            variant="outline"
            onClick={() => {
              void batch.refetch();
              if (selected) void draft.refetch();
            }}
          >
            다시 불러오기
          </Button>
        </div>
      )}
      {batch.isPending && <p role="status">배치를 불러오는 중이에요.</p>}
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
                  onClick={() => select({ draft: day.draftId })}
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
      {batch.data && (
        <BatchActions key={batch.data.batch.batchId} data={batch.data} />
      )}
      {draft.data && (
        <>
          <p role="status" className="text-sm text-subtle">
            {STATUS_LABELS[draft.data.status]}
            {draft.data.errorMessage ? ` · ${draft.data.errorMessage}` : ''}
          </p>
          {batch.data && (
            <DraftActions
              key={`${draft.data.batchId}:${draft.data.draftId}`}
              batchStatus={batch.data.batch.status}
              draft={draft.data}
            />
          )}
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
