'use client';

// 라인업 표 — 행을 누르면 그 행이 인라인 편집 폼으로 바뀐다. 다른 행을 누르면 닫히고 값은 유지 (Figma 4129:939)
import Link from 'next/link';

import { CONTENT_CHARACTERS } from '@/features/content/api/content-batch';
import { cn } from '@/shared/lib/cn';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import {
  categoryLabel,
  DIFFICULTIES,
  setCategory,
  SPEAKERS,
  type CategoryOption,
  type LineupDraftRow,
} from '../../_model/lineup-draft';

// Figma 셀 너비 — Day 60 / 제목 flex / 카테고리 90 / 난이도 80 / 캐릭터 80 / 선발화 60 / 겹침 경고 260
const CELL = {
  day: 'w-[60px] shrink-0',
  title: 'flex-1 min-w-px',
  category: 'w-[90px] shrink-0',
  difficulty: 'w-[80px] shrink-0',
  character: 'w-[80px] shrink-0',
  speaker: 'w-[60px] shrink-0',
  overlap: 'w-[260px] shrink-0',
};

interface LineupTableProps {
  rows: LineupDraftRow[];
  errors: Record<number, string[]>;
  categories: CategoryOption[];
  editingDay: number | null;
  /** develop 서버면 겹침 경고의 Day를 시나리오 목록으로 연다 */
  develop: boolean;
  onToggleEdit: (day: number) => void;
  onChange: (day: number, next: LineupDraftRow) => void;
}

export function LineupTable({
  rows,
  errors,
  categories,
  editingDay,
  develop,
  onToggleEdit,
  onChange,
}: LineupTableProps) {
  return (
    <section className="w-full rounded-[20px] bg-card pt-2 pb-1">
      <div className="px-1">
        <div
          role="row"
          className="flex w-full items-center gap-4 px-5 pt-3 pb-2 text-xs font-medium text-subtle"
        >
          <span className={CELL.day}>Day</span>
          <span className={CELL.title}>제목 (클릭해 수정)</span>
          <span className={CELL.category}>카테고리</span>
          <span className={CELL.difficulty}>난이도</span>
          <span className={CELL.character}>캐릭터</span>
          <span className={CELL.speaker}>선발화</span>
          <span className={CELL.overlap}>겹침 경고 (AI 자기 신고)</span>
        </div>
        <div className="flex flex-col gap-0.5">
          {rows.map((row) =>
            editingDay === row.day ? (
              <RowEditor
                key={row.day}
                row={row}
                errors={errors[row.day] ?? []}
                categories={categories}
                onChange={(next) => onChange(row.day, next)}
                onClose={() => onToggleEdit(row.day)}
              />
            ) : (
              <button
                key={row.day}
                type="button"
                aria-label={`Day ${row.day} 수정`}
                onClick={() => onToggleEdit(row.day)}
                className={cn(
                  'flex w-full items-center gap-4 rounded-lg px-5 py-3 text-left transition-colors hover:bg-hairline',
                  errors[row.day] && 'ring-1 ring-destructive ring-inset',
                )}
              >
                <span
                  className={cn(
                    CELL.day,
                    'text-[14px] font-medium text-strong',
                  )}
                >
                  {row.day}
                </span>
                <span
                  className={cn(CELL.title, 'truncate text-[14px] text-strong')}
                >
                  {row.title}
                </span>
                <span
                  className={cn(
                    CELL.category,
                    'truncate text-[13px] text-body',
                  )}
                >
                  {categoryLabel(row, categories)}
                </span>
                <span className={cn(CELL.difficulty, 'text-[13px] text-body')}>
                  {row.difficulty}
                </span>
                <span className={cn(CELL.character, 'text-[13px] text-body')}>
                  {row.characterId}
                </span>
                <span
                  className={cn(
                    CELL.speaker,
                    'text-[13px]',
                    row.firstSpeaker === 'USER'
                      ? 'font-medium text-primary'
                      : 'text-body',
                  )}
                >
                  {row.firstSpeaker}
                </span>
                <span
                  className={cn(
                    CELL.overlap,
                    'text-[12px] leading-[1.4] text-primary',
                  )}
                >
                  <OverlapWarnings row={row} develop={develop} />
                </span>
              </button>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function OverlapWarnings({
  row,
  develop,
}: {
  row: LineupDraftRow;
  develop: boolean;
}) {
  const warnings = row.overlapWarnings ?? [];
  if (warnings.length === 0) return <span className="text-subtle">—</span>;
  return (
    <>
      {warnings.map((warning, index) => (
        <span key={index} className="block">
          {develop ? (
            // 기존 Day를 새 탭으로 — 시나리오 목록은 develop 전용이라 운영에선 글자만
            <Link
              href={`/scenarios?q=${warning.day}`}
              target="_blank"
              onClick={(event) => event.stopPropagation()}
              className="underline-offset-2 hover:underline"
            >
              Day {warning.day}
            </Link>
          ) : (
            <>Day {warning.day}</>
          )}{' '}
          — {warning.reason}
        </span>
      ))}
    </>
  );
}

const FIELD =
  'h-auto rounded-lg border-transparent bg-muted px-3 py-2 text-[13px] shadow-none';
const SELECT = `${FIELD} w-full appearance-none`;

function RowEditor({
  row,
  errors,
  categories,
  onChange,
  onClose,
}: {
  row: LineupDraftRow;
  errors: string[];
  categories: CategoryOption[];
  onChange: (next: LineupDraftRow) => void;
  onClose: () => void;
}) {
  return (
    <div
      role="group"
      aria-label={`Day ${row.day} 편집`}
      className="flex flex-col gap-3 rounded-lg bg-muted/40 px-5 py-4 ring-1 ring-primary/40 ring-inset"
    >
      <div className="flex items-center gap-4">
        <span className="w-[60px] shrink-0 text-[14px] font-bold text-strong">
          {row.day}
        </span>
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-[11px] text-subtle">제목</span>
          <Input
            value={row.title}
            onChange={(event) =>
              onChange({ ...row, title: event.target.value })
            }
            className={FIELD}
          />
        </label>
        <button
          type="button"
          onClick={onClose}
          className="self-end rounded-lg px-3 py-2 text-[13px] text-subtle hover:bg-hairline"
        >
          닫기
        </button>
      </div>
      <div className="grid grid-cols-5 gap-3 pl-[76px]">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-subtle">기존 카테고리</span>
          <select
            value={row.categoryDisplayOrder ?? ''}
            onChange={(event) =>
              event.target.value &&
              onChange(
                setCategory(row, {
                  categoryDisplayOrder: Number(event.target.value),
                }),
              )
            }
            className={SELECT}
          >
            <option value="">— 새 이름 사용 —</option>
            {categories.length === 0 && row.categoryDisplayOrder !== null && (
              <option value={row.categoryDisplayOrder}>
                #{row.categoryDisplayOrder}
              </option>
            )}
            {categories.map((option) => (
              <option key={option.displayOrder} value={option.displayOrder}>
                {option.displayOrder}. {option.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-subtle">새 카테고리 이름</span>
          <Input
            value={row.proposedCategory ?? ''}
            placeholder="예: 건강"
            onChange={(event) =>
              onChange(
                setCategory(row, { proposedCategory: event.target.value }),
              )
            }
            className={FIELD}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-subtle">난이도</span>
          <select
            value={row.difficulty}
            onChange={(event) =>
              onChange({
                ...row,
                difficulty: event.target.value as LineupDraftRow['difficulty'],
              })
            }
            className={SELECT}
          >
            {DIFFICULTIES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-subtle">캐릭터</span>
          <select
            value={row.characterId}
            onChange={(event) =>
              onChange({ ...row, characterId: event.target.value })
            }
            className={SELECT}
          >
            {CONTENT_CHARACTERS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-subtle">선발화</span>
          <select
            value={row.firstSpeaker}
            onChange={(event) =>
              onChange({
                ...row,
                firstSpeaker: event.target
                  .value as LineupDraftRow['firstSpeaker'],
              })
            }
            className={SELECT}
          >
            {SPEAKERS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 pl-[76px]">
        <span className="text-[11px] text-subtle">
          줄거리 (한 줄에 하나, 2~5줄)
        </span>
        <Textarea
          value={row.beats.join('\n')}
          rows={Math.max(3, row.beats.length)}
          onChange={(event) =>
            onChange({ ...row, beats: event.target.value.split('\n') })
          }
          className="min-h-0 rounded-lg border-transparent bg-muted px-3 py-2 text-[13px] shadow-none"
        />
      </label>
      {errors.length > 0 && (
        <ul role="alert" className="pl-[76px] text-[12px] text-destructive">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
