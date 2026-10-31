'use client';

// 라인업 확인 화면 — 요약 카드 · 라인업 표(행 클릭 편집) · 저장/재생성 코멘트 (Figma 4129:939).
// 편집 초안은 여기 하나에 두고 표·푸터에 내려 준다. 서버가 새 라인업을 주면(updatedAt 변경) 부모가 key로 다시 마운트한다
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { ContentBatchDetail } from '@/features/content/api/content-batch';
import { canEditLineup } from '@/features/content/model/content-actions';
import { useContentBatchMutation } from '@/features/content/model/useContentMutation';
import { scenarioQuery } from '@/features/scenario/model/scenario-query';

import {
  categoryOptionsOf,
  hasLineupChanges,
  lineupRowsOf,
  toLineupRequest,
  validateLineupRows,
  type LineupDraftRow,
} from '../../_model/lineup-draft';
import { useApiHost } from '../../../../_model/api-host';
import { isDevelopServer } from '../../../../_model/navigation';
import { LineupFooter } from './LineupFooter';
import { LineupSummaryCard } from './LineupSummaryCard';
import { LineupTable } from './LineupTable';
import { ProceedDialog } from './ProceedDialog';

export function LineupStage({ detail }: { detail: ContentBatchDetail }) {
  const { batch } = detail;
  const editable = canEditLineup(batch.status);
  const [original] = useState(() => lineupRowsOf(detail.days));
  const [rows, setRows] = useState<LineupDraftRow[]>(original);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [askingProceed, setAskingProceed] = useState(false);
  const mutation = useContentBatchMutation();

  const develop = isDevelopServer(useApiHost());
  // 카테고리 이름은 시나리오 목록 API(develop 전용)에서만 — 운영에선 번호만 보인다
  const catalog = useQuery({ ...scenarioQuery, enabled: develop && editable });
  const categories = categoryOptionsOf(catalog.data);

  const dirty = hasLineupChanges(original, rows);
  const validation = validateLineupRows(rows, batch.characterRatio);
  const invalid =
    Object.keys(validation.rows).length > 0 || validation.table !== null;
  const busy = mutation.isPending;

  const updateRow = (day: number, next: LineupDraftRow) =>
    setRows((current) => current.map((row) => (row.day === day ? next : row)));

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <LineupSummaryCard
        batch={batch}
        canAct={editable && !dirty && !busy}
        dirty={dirty}
        onRegenerate={() => document.getElementById('lineup-comment')?.focus()}
        onProceed={() => setAskingProceed(true)}
      />

      {editable ? (
        <LineupTable
          rows={rows}
          errors={validation.rows}
          categories={categories}
          editingDay={editingDay}
          develop={develop}
          onToggleEdit={(day) =>
            setEditingDay((current) => (current === day ? null : day))
          }
          onChange={updateRow}
        />
      ) : (
        <p
          role="status"
          className="rounded-[20px] bg-card px-6 py-16 text-center text-[15px] font-medium text-body"
        >
          라인업을 만들고 있어요 · 약 1분
        </p>
      )}

      {editable && (
        <LineupFooter
          dirty={dirty}
          tableError={validation.table}
          saveDisabled={!dirty || invalid || busy}
          comment={comment}
          regenerateDisabled={!comment.trim() || dirty || busy}
          onSave={() =>
            mutation.mutate(
              {
                type: 'lineup',
                batchId: batch.batchId,
                rows: toLineupRequest(rows),
              },
              { onSuccess: () => setEditingDay(null) },
            )
          }
          onChangeComment={setComment}
          onRegenerate={() =>
            mutation.mutate(
              {
                type: 'regenerateLineup',
                batchId: batch.batchId,
                comment: comment.trim(),
              },
              { onSuccess: () => setComment('') },
            )
          }
        />
      )}

      <ProceedDialog
        open={askingProceed}
        dayCount={batch.dayCount}
        pending={busy}
        onCancel={() => setAskingProceed(false)}
        onConfirm={() =>
          mutation.mutate(
            {
              type: 'proceed',
              batchId: batch.batchId,
              dayCount: batch.dayCount,
            },
            { onSuccess: () => setAskingProceed(false) },
          )
        }
      />
    </div>
  );
}
