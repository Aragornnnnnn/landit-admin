'use client';

// Day별 검수 의견 저장과 범위별 재생성을 서버가 허용하는 상태에서 제공한다.
import { useState } from 'react';

import type { Schema } from '@/shared/api/schema-patch';

import { canReview, REGENERATION_SCOPES } from '../_model/content-state';
import { ContentAction } from './ContentAction';

export function DraftActions({
  batchStatus,
  draft,
}: {
  batchStatus: string;
  draft: Schema<'AdminContentDraftDetail'>;
}) {
  const [verdict, setVerdict] = useState<'OK' | 'FIX'>('OK');
  const [comment, setComment] = useState('');
  const [scope, setScope] = useState('ALL');
  const reviewable = canReview(batchStatus, draft.status);
  const regenerable =
    batchStatus === 'REVIEW_READY' &&
    ['REVIEW_READY', 'NEEDS_FIX', 'OK', 'FAILED'].includes(draft.status);
  if (!reviewable && !regenerable) return null;
  return (
    <section className="space-y-4 rounded-xl border bg-card p-5">
      <h3 className="font-bold">Day {draft.plannedDay} 검수·수정</h3>
      {reviewable && (
        <>
          <label className="block text-sm">
            검수 판정
            <select
              aria-label="검수 판정"
              value={verdict}
              onChange={(e) => setVerdict(e.target.value as 'OK' | 'FIX')}
              className="ml-3 rounded-lg border p-2"
            >
              <option value="OK">OK · 검수 완료</option>
              <option value="FIX">FIX · 수정 필요</option>
            </select>
          </label>
          <label className="block text-sm">
            검수 의견
            <textarea
              aria-label="검수 의견"
              maxLength={2000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>
          <ContentAction
            label="검수 저장"
            disabled={verdict === 'FIX' && !comment.trim()}
            command={{
              kind: 'review',
              batchId: draft.batchId,
              draftId: draft.draftId,
              request: {
                verdict,
                comments: comment.trim() ? [{ comment: comment.trim() }] : [],
              },
            }}
            onComplete={() => setComment('')}
          >
            <p>
              Day {draft.plannedDay}을 {verdict}로 저장합니다.
            </p>
            {verdict === 'OK' && (
              <p>남아 있는 수정 요청도 해결로 처리됩니다.</p>
            )}
          </ContentAction>
          {verdict === 'FIX' && !comment.trim() && (
            <p className="text-sm text-subtle">수정할 내용을 입력해 주세요.</p>
          )}
        </>
      )}
      {regenerable && (
        <div className="flex flex-wrap items-center gap-3 border-t pt-4">
          <label className="text-sm">
            재생성 범위
            <select
              aria-label="재생성 범위"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="ml-3 max-w-full rounded-lg border p-2"
            >
              {REGENERATION_SCOPES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <ContentAction
            label="선택 범위 다시 생성"
            command={{
              kind: 'regenerate',
              batchId: draft.batchId,
              draftId: draft.draftId,
              scope,
            }}
          >
            <p>
              Day {draft.plannedDay}의{' '}
              {REGENERATION_SCOPES.find(([value]) => value === scope)?.[1]}을
              다시 생성합니다. 기존 해당 초안이 교체되며 AI 호출 비용이
              발생합니다.
            </p>
            <p>수정 의견은 먼저 FIX로 저장해야 재생성에 반영됩니다.</p>
          </ContentAction>
        </div>
      )}
    </section>
  );
}
