// 라인업 행 탭 — 읽기 전용(수정은 LINEUP_READY 단계에서만 가능했다)
import type { LineupRow } from '@/features/content/api/draft-payload';

export function LineupRowView({ lineup }: { lineup: LineupRow | null }) {
  if (!lineup)
    return (
      <section className="rounded-[20px] bg-card px-6 py-10 text-center text-[13px] text-subtle">
        라인업 행을 읽지 못했어요
      </section>
    );
  const category = lineup.proposedCategory
    ? `새: ${lineup.proposedCategory}`
    : lineup.categoryDisplayOrder !== null
      ? `#${lineup.categoryDisplayOrder}`
      : '—';
  const fields: [string, string][] = [
    ['제목', lineup.title],
    ['카테고리', category],
    ['난이도', lineup.difficulty],
    ['캐릭터', lineup.characterId],
    ['선발화', lineup.firstSpeaker],
  ];
  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-card px-6 py-5">
      <h3 className="text-[15px] font-bold text-strong">
        라인업 행 (읽기 전용)
      </h3>
      <dl className="grid grid-cols-[80px_1fr] gap-x-3 gap-y-1.5 text-[13px]">
        {fields.map(([name, value]) => (
          <div key={name} className="contents">
            <dt className="text-subtle">{name}</dt>
            <dd className="text-strong">{value}</dd>
          </div>
        ))}
        <dt className="text-subtle">줄거리</dt>
        <dd>
          <ol className="list-decimal pl-4 text-strong">
            {lineup.beats.map((beat, index) => (
              <li key={index}>{beat}</li>
            ))}
          </ol>
        </dd>
        <dt className="text-subtle">겹침 경고</dt>
        <dd className="text-primary">
          {lineup.overlapWarnings?.length
            ? lineup.overlapWarnings.map((warning) => (
                <span key={warning.day} className="block">
                  Day {warning.day} — {warning.reason}
                </span>
              ))
            : '—'}
        </dd>
      </dl>
    </section>
  );
}
