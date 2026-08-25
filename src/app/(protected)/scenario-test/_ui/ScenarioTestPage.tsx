'use client';

// 시나리오 테스트 — 진행 순서·하루 1개 제한을 무시하고 바로 대화를 열어 QA한다 (Figma 1050:12764).
// develop 전용이라 내비 자체가 develop에서만 보인다
import { useState } from 'react';
import Image from 'next/image';

import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { StatusChip } from '@/shared/ui/StatusChip';

import {
  scenarioSubLabel,
  useScenariosQuery,
  useStartSessionMutation,
  type Scenario,
  type ScenarioCategory,
} from '../_model/useScenarios';

/** 세션을 시작하면 열어 줄 사용자 웹 — 환경마다 달라 env로 받는다. 없으면 새 탭을 열지 않는다 */
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export function ScenarioTestPage() {
  const scenarios = useScenariosQuery();
  const start = useStartSessionMutation();
  const [starting, setStarting] = useState<number | null>(null);

  const categories = (scenarios.data?.categories ?? []) as ScenarioCategory[];

  const startSession = (scenarioId: number) => {
    // 응답을 기다렸다 열면 팝업 차단에 걸린다 — 클릭 순간에 빈 탭을 먼저 열고 주소만 나중에 채운다
    const tab = WEB_BASE_URL ? window.open('', '_blank') : null;
    setStarting(scenarioId);
    start.mutate(scenarioId, {
      onSuccess: () => {
        if (tab)
          tab.location.href = `${WEB_BASE_URL}/conversation/scenario/${scenarioId}`;
      },
      onError: () => tab?.close(),
      onSettled: () => setStarting(null),
    });
  };

  return (
    <div className="flex flex-col gap-5 pt-1 pb-12">
      <div className="flex flex-wrap items-center gap-3 rounded-[10px] border border-primary-light/50 bg-muted px-4 py-3">
        <StatusChip>develop 전용</StatusChip>
        <span className="text-[13px] text-body">
          진행 순서·하루 1개 제한을 무시하고 활성 시나리오를 바로 시작해요.
          실서비스 사용자 데이터에는 영향이 없어요.
        </span>
      </div>

      {scenarios.isPending ? (
        <ListSkeleton rows={4} />
      ) : scenarios.isError ? (
        <InlineError
          message="시나리오를 불러오지 못했어요"
          onRetry={() => scenarios.refetch()}
        />
      ) : categories.length === 0 ? (
        <EmptyState
          className="rounded-[20px] bg-card"
          title="활성 시나리오가 없어요"
        />
      ) : (
        categories.map((category) => (
          <section
            key={category.categoryId}
            className="flex w-full flex-col gap-3 rounded-[20px] bg-card px-7 py-6"
          >
            <header className="flex items-baseline justify-between">
              <h2 className="text-[19px] font-bold text-foreground">
                {category.categoryName}
              </h2>
              <span className="text-[12px] text-subtle">
                {category.scenarios?.length ?? 0}개 · 활성
              </span>
            </header>

            <div className="flex flex-wrap gap-3">
              {(category.scenarios ?? []).map((scenario) => (
                <ScenarioTile
                  key={scenario.scenarioId}
                  scenario={scenario}
                  starting={starting === scenario.scenarioId}
                  onStart={() =>
                    scenario.scenarioId && startSession(scenario.scenarioId)
                  }
                />
              ))}
            </div>
          </section>
        ))
      )}

      <p className="text-[12px] text-subtle">
        {WEB_BASE_URL
          ? '세션을 시작하면 사용자 웹의 대화 화면이 새 탭으로 열려요.'
          : '사용자 웹 주소(NEXT_PUBLIC_WEB_BASE_URL)가 설정되지 않아 세션만 만들어요.'}
      </p>
    </div>
  );
}

function ScenarioTile({
  scenario,
  starting,
  onStart,
}: {
  scenario: Scenario;
  starting: boolean;
  onStart: () => void;
}) {
  return (
    <div className="flex min-w-[260px] flex-1 items-center gap-3 rounded-xl bg-muted px-3.5 py-3">
      {scenario.thumbnailUrl ? (
        <Image
          src={scenario.thumbnailUrl}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-lg object-cover"
          unoptimized
        />
      ) : (
        <span aria-hidden className="size-10 shrink-0 rounded-lg bg-card" />
      )}
      <span className="flex min-w-px flex-1 flex-col">
        <span className="truncate text-[14px] font-medium text-strong">
          {scenario.scenarioTitle}
        </span>
        <span className="truncate text-[12px] text-subtle">
          {scenarioSubLabel(scenario)}
        </span>
      </span>
      <button
        type="button"
        onClick={onStart}
        disabled={starting}
        className="shrink-0 rounded-[10px] bg-card px-3 py-1.5 text-[12px] font-medium text-body hover:bg-secondary disabled:opacity-50"
      >
        {starting ? '시작 중' : '세션 시작'}
      </button>
    </div>
  );
}
