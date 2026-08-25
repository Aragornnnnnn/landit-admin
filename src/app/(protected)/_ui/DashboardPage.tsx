'use client';

// 대시보드 — 들어오자마자 "오늘 처리할 게 있나"를 본다 (Figma 1050:7662 · 7905).
// 집계 API가 없어 목록으로 받아 세므로, 숫자가 무엇을 센 것인지 카드마다 보조 문구로 밝힌다
import { cn } from '@/shared/lib/cn';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import {
  countCreatedToday,
  countsByType,
  dailyCounts,
  oldestPending,
  signupCounts,
  todayLabel,
} from '../_model/dashboard-metrics';
import { useDashboardData } from '../_model/useDashboardData';
import { FEEDBACK_TYPE_LABEL } from '../feedbacks/_model/feedback-label';
import {
  AppVersionSummaryCard,
  MailboxSummaryCard,
} from './DashboardSideCards';
import { RecentFeedbackCard } from './RecentFeedbackCard';

export function DashboardPage() {
  // 렌더마다 시각이 달라지면 숫자가 흔들린다 — 한 번 잡아 모든 계산이 같은 "지금"을 쓰게 한다
  const now = new Date();
  const data = useDashboardData(now);

  if (data.isPending) return <ListSkeleton rows={6} className="pt-4" />;

  const oldest = oldestPending(data.pendingFeedbacks, now);
  const signups = signupCounts(data.users, now);
  const bars = dailyCounts(data.recentFeedbacks, now);
  const byType = countsByType(data.pendingFeedbacks);

  return (
    <div className="flex flex-col gap-5 pt-1 pb-12">
      <p className="text-[13px] text-subtle">{todayLabel(now)}</p>

      {/* 모바일은 2열로 두 장, 마지막 한 장이 아래 전체 폭 (프레임 1050:7905) */}
      <div className="grid grid-cols-2 gap-3 md:flex md:flex-row">
        <SummaryCard
          label="답장 기다리는 피드백"
          value={data.feedbacksError ? '—' : String(data.pendingTotal)}
          hint={
            data.feedbacksError
              ? '불러오지 못했어요'
              : `건 · 오늘 +${countCreatedToday(data.pendingFeedbacks, now)}`
          }
        />
        <SummaryCard
          label="가장 오래 기다린 건"
          value={
            data.feedbacksError
              ? '—'
              : oldest
                ? `${oldest.waitingDays}일`
                : '없음'
          }
          hint={
            data.feedbacksError
              ? '불러오지 못했어요'
              : oldest
                ? `· ${oldest.type ? FEEDBACK_TYPE_LABEL[oldest.type] : ''} · ${oldest.nickname ?? ''}`
                : '· 다 답장했어요'
          }
        />
        <SummaryCard
          className="col-span-2 md:col-span-1"
          label="이번 주 가입"
          value={data.usersError ? '—' : String(signups.thisWeek)}
          hint={
            data.usersError
              ? '불러오지 못했어요'
              : `명 · 지난주 ${signups.lastWeek}`
          }
        />
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <section className="flex w-full flex-1 flex-col gap-4 rounded-[20px] bg-card px-6 py-5">
          <header className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-bold text-foreground">
              피드백 접수
            </h2>
            <span className="text-[12px] text-subtle">
              {data.feedbacksError
                ? '최근 7일'
                : `최근 7일 · 총 ${data.recentTotal}건`}
            </span>
          </header>

          {data.feedbacksError ? (
            <InlineError
              message="피드백을 불러오지 못했어요"
              onRetry={data.refetchFeedbacks}
              className="py-10"
            />
          ) : (
            <ChartBody data={data} bars={bars} byType={byType} />
          )}
        </section>

        {/* 오른쪽 열은 "지금 나가 있는 것" — 앱 버전과 편지함 맨 위 (프레임의 400px 열) */}
        <div className="flex w-full flex-col gap-5 xl:w-[400px] xl:shrink-0">
          <AppVersionSummaryCard
            versions={data.appVersions}
            error={data.appVersionsError}
          />
          {/* 편지함 카드도 좁은 화면 프레임에 없다 — 대시보드는 현황판이고 편지는 그 화면에서 본다 */}
          <div className="hidden md:block">
            <MailboxSummaryCard
              letters={data.publishedLetters}
              draftCount={data.draftLetterCount}
              error={data.lettersError}
            />
          </div>
        </div>
      </div>

      <RecentFeedbackCard
        items={data.recentFeedbacks}
        error={data.feedbacksError}
        onRetry={data.refetchFeedbacks}
      />
    </div>
  );
}

function ChartBody({
  data,
  bars,
  byType,
}: {
  data: ReturnType<typeof useDashboardData>;
  bars: ReturnType<typeof dailyCounts>;
  byType: ReturnType<typeof countsByType>;
}) {
  return (
    <>
      <div className="flex items-end gap-2">
        {bars.map((bar) => (
          <span
            key={bar.date.toISOString()}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <span
              aria-hidden
              style={{
                height: `${barHeight(
                  bar.count,
                  bars.map((one) => one.count),
                )}px`,
              }}
              className={`w-full max-w-10 rounded ${bar.today ? 'bg-foreground' : 'bg-hairline'}`}
            />
            <span className="text-[11px] text-subtle">
              {bar.date.getMonth() + 1}.{bar.date.getDate()}
            </span>
            <span className="sr-only">{bar.count}건</span>
          </span>
        ))}
      </div>

      {/* 좁은 화면 프레임에는 유형별 분포가 없다 — 막대만으로 추세를 본다 */}
      <div className="hidden h-px bg-muted md:block" />

      <div className="hidden items-baseline justify-between md:flex">
        <h3 className="text-[13px] font-medium text-strong">처리중 유형별</h3>
        <span className="text-[12px] text-subtle">{data.pendingTotal}건</span>
      </div>
      <div className="hidden flex-col gap-2 md:flex">
        {byType.map(({ type, count }) => (
          <div key={type} className="flex items-center gap-3">
            <span className="w-[72px] shrink-0 text-[13px] text-body">
              {FEEDBACK_TYPE_LABEL[type]}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                aria-hidden
                style={{ width: `${share(count, byType)}%` }}
                className="block h-full rounded-full bg-foreground"
              />
            </span>
            <span className="w-6 shrink-0 text-right text-[13px] font-medium text-strong">
              {count}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'flex flex-1 flex-col gap-1 rounded-[20px] bg-card px-5 py-4.5',
        className,
      )}
    >
      <span className="text-[13px] text-subtle">{label}</span>
      <span className="flex flex-wrap items-baseline gap-x-1.5">
        <span className="text-[28px] leading-tight font-bold text-foreground">
          {value}
        </span>
        <span className="text-[12px] text-subtle">{hint}</span>
      </span>
    </section>
  );
}

// 가장 높은 막대를 96px로 두고 나머지를 그 비율로 — 모두 0이면 바닥선만 남는다
const BAR_MAX = 96;
function barHeight(count: number, all: number[]): number {
  const max = Math.max(...all);
  if (max === 0) return 2;
  return Math.max(2, Math.round((count / max) * BAR_MAX));
}

function share(count: number, all: { count: number }[]): number {
  const max = Math.max(...all.map((one) => one.count));
  return max === 0 ? 0 : Math.round((count / max) * 100);
}
