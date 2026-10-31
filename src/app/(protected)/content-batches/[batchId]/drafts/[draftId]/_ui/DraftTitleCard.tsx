// 제목 카드 — 제목 + 상태 칩 · 캐릭터·난이도·카테고리·선발화 · 브리핑·대화 목표(1차에서 살림) (Figma 4131:766)
import type { ContentDraft } from '@/features/content/api/content-batch';
import type {
  LineupRow,
  ScenarioDraft,
} from '@/features/content/api/draft-payload';
import {
  DRAFT_STATUS_DOT,
  DRAFT_STATUS_LABEL,
} from '@/features/content/model/content-label';
import { StatusChip } from '@/shared/ui/StatusChip';

import { draftMeta } from '../_model/draft-content';

interface DraftTitleCardProps {
  draft: ContentDraft;
  scenario: ScenarioDraft | null;
  lineup: LineupRow | null;
}

export function DraftTitleCard({
  draft,
  scenario,
  lineup,
}: DraftTitleCardProps) {
  const title =
    scenario?.languageVariant.title ??
    lineup?.title ??
    `Day ${draft.plannedDay}`;
  const meta = draftMeta(scenario, lineup);
  return (
    <section className="flex flex-col gap-2 rounded-[20px] bg-card px-6 py-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[13px] font-medium text-subtle">
          Day {draft.plannedDay}
        </span>
        <h2 className="text-[18px] font-bold text-strong">{title}</h2>
        <StatusChip
          dot={DRAFT_STATUS_DOT[draft.status]}
          className={draft.status === 'FAILED' ? 'text-destructive' : undefined}
        >
          {DRAFT_STATUS_LABEL[draft.status]}
        </StatusChip>
      </div>
      {meta && <p className="text-[13px] text-subtle">{meta}</p>}
      {scenario && (
        <dl className="mt-1 grid gap-1 text-[13px] leading-[1.5]">
          <div className="flex gap-2">
            <dt className="w-[60px] shrink-0 text-subtle">브리핑</dt>
            <dd className="text-body">{scenario.languageVariant.briefing}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-[60px] shrink-0 text-subtle">대화 목표</dt>
            <dd className="text-body">
              {scenario.languageVariant.conversationGoal}
            </dd>
          </div>
        </dl>
      )}
      {draft.errorMessage && (
        <p role="alert" className="text-[13px] text-destructive">
          {draft.errorMessage}
        </p>
      )}
    </section>
  );
}
