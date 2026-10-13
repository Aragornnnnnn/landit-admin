'use client';

// 대시보드 — 들어오자마자 "오늘 처리할 게 있나"를 본다 (Figma 1050:7662 · 7905).
// 카드별 조회 상태를 분리해 한 조회가 다른 카드의 표시를 막지 않게 한다
import { FEEDBACK_TYPE_LABEL } from '@/features/feedback/model/feedback-label';
import { cn } from '@/shared/lib/cn';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import {
  countCreatedToday,
  countsByType,
  dailyCounts,
  formatDelta,
  oldestPending,
  todayLabel,
} from '../_model/dashboard-metrics';
import { useDashboardData } from '../_model/useDashboardData';
import {
  AppVersionSummaryCard,
  MailboxSummaryCard,
} from './DashboardSideCards';
import { RecentFeedbackCard } from './RecentFeedbackCard';

export function DashboardPage() {
  // 이번 렌더에서 표시하는 피드백 날짜와 대기 일수의 기준 시각이다.
  const now = new Date();
  const data = useDashboardData(now);

  const oldest = oldestPending(data.pendingFeedbacks, now);
  const signups = data.signups;
  const bars = dailyCounts(data.recentFeedbacks, now);
  const byType = countsByType(data.pendingFeedbacks);

  return (
    <div className="flex flex-col gap-5 pt-1 pb-12">
      <p className="text-[13px] text-subtle">{todayLabel(now)}</p>

      {/* 모바일은 2열로 두 장, 마지막 한 장이 아래 전체 폭 (프레임 1050:7905) */}
      <div className="grid grid-cols-2 gap-3 md:flex md:flex-row">
        <SummaryCard
          label="답장 기다리는 피드백"
          pending={data.pendingPending}
          error={data.pendingError}
          onRetry={data.refetchPending}
          value={data.pendingError ? '—' : String(data.pendingTotal)}
          hint={
            data.pendingError
              ? '불러오지 못했어요'
              : `건 · 오늘 +${countCreatedToday(data.pendingFeedbacks, now)}`
          }
        />
        <SummaryCard
          label="가장 오래 기다린 건"
          pending={data.pendingPending}
          error={data.pendingError}
          onRetry={data.refetchPending}
          value={
            data.pendingError
              ? '—'
              : oldest
                ? `${oldest.waitingDays}일`
                : '없음'
          }
          hint={
            data.pendingError
              ? '불러오지 못했어요'
              : oldest
                ? `· ${oldest.type ? FEEDBACK_TYPE_LABEL[oldest.type] : ''} · ${oldest.nickname ?? ''}`
                : '· 다 답장했어요'
          }
        />
        <SummaryCard
          className="col-span-2 md:col-span-1"
          label="이번 주 가입"
          pending={data.signupsPending}
          error={data.signupsError}
          onRetry={data.refetchSignups}
          value={signups ? String(signups.thisWeek) : '—'}
          hint={
            !signups ? (
              '불러오지 못했어요'
            ) : (
              <>
                명 · 지난주 {signups.lastWeek}{' '}
                <Delta current={signups.thisWeek} previous={signups.lastWeek} />
              </>
            )
          }
          footer={
            !signups ? undefined : (
              <>
                서울 기준 · 이번 달 {signups.thisMonth} · 지난달{' '}
                {signups.lastMonth}{' '}
                <Delta
                  current={signups.thisMonth}
                  previous={signups.lastMonth}
                />
              </>
            )
          }
        />
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <section
          aria-label="피드백 접수"
          className="flex w-full flex-1 flex-col gap-4 rounded-[20px] bg-card px-6 py-5"
        >
          <header className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-bold text-foreground">
              피드백 접수
            </h2>
            <span className="text-[12px] text-subtle">
              {data.recentPending || data.recentError
                ? '최근 7일'
                : `최근 7일 · 총 ${data.recentTotal}건`}
            </span>
          </header>

          <ChartBody data={data} bars={bars} byType={byType} />
        </section>

        {/* 오른쪽 열은 "지금 나가 있는 것" — 앱 버전과 편지함 맨 위 (프레임의 400px 열) */}
        <div className="flex w-full flex-col gap-5 xl:w-[400px] xl:shrink-0">
          <AppVersionSummaryCard
            versions={data.appVersions}
            error={data.appVersionsError}
            pending={data.appVersionsPending}
            onRetry={data.refetchAppVersions}
          />
          {/* 편지함 카드도 좁은 화면 프레임에 없다 — 대시보드는 현황판이고 편지는 그 화면에서 본다 */}
          <div className="hidden md:block">
            <MailboxSummaryCard
              letters={data.publishedLetters}
              draftCount={data.draftLetterCount}
              error={data.lettersError}
              pending={data.lettersPending}
              onRetry={data.refetchLetters}
            />
          </div>
        </div>
      </div>

      <RecentFeedbackCard
        items={data.recentFeedbacks}
        error={data.recentError}
        pending={data.recentPending}
        onRetry={data.refetchRecent}
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
      {data.recentPending ? (
        <ListSkeleton rows={2} />
      ) : data.recentError ? (
        <InlineError
          message="피드백을 불러오지 못했어요"
          onRetry={data.refetchRecent}
          className="py-10"
        />
      ) : (
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
      )}

      {/* 좁은 화면 프레임에는 유형별 분포가 없다 — 막대만으로 추세를 본다 */}
      <div className="hidden h-px bg-muted md:block" />

      <div className="hidden items-baseline justify-between md:flex">
        <h3 className="text-[13px] font-medium text-strong">처리중 유형별</h3>
        <span className="text-[12px] text-subtle">
          {data.pendingPending || data.pendingError
            ? '—'
            : `${data.pendingTotal}건`}
        </span>
      </div>
      <div className="hidden flex-col gap-2 md:flex">
        {data.pendingPending ? (
          <ListSkeleton rows={2} />
        ) : data.pendingError ? (
          <InlineError
            message="처리중 피드백을 불러오지 못했어요"
            onRetry={data.refetchPending}
            className="py-4"
          />
        ) : (
          byType.map(({ type, count }) => (
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
          ))
        )}
      </div>
    </>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  footer,
  className,
  pending,
  error,
  onRetry,
}: {
  label: string;
  value: string;
  hint: React.ReactNode;
  /** 큰 숫자 아래 한 줄 더 — 가입 카드의 월 비교 */
  footer?: React.ReactNode;
  className?: string;
  pending: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        'flex flex-1 flex-col gap-1 rounded-[20px] bg-card px-5 py-4.5',
        className,
      )}
    >
      <span className="text-[13px] text-subtle">{label}</span>
      {pending ? (
        <ListSkeleton rows={1} />
      ) : error ? (
        <InlineError onRetry={onRetry} className="py-3" />
      ) : (
        <>
          <span className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-[28px] leading-tight font-bold text-foreground">
              {value}
            </span>
            <span className="text-[12px] text-subtle">{hint}</span>
          </span>
          {footer && <span className="text-[12px] text-subtle">{footer}</span>}
        </>
      )}
    </section>
  );
}

// 늘면 초록, 줄면 빨강 — 어드민 색 규칙(빨강은 오류·파괴적 행동)의 예외다. 증감은 한눈에 방향이 보여야 한다
function Delta({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  return (
    <span
      className={cn(
        'font-medium',
        diff > 0 && 'text-success',
        diff < 0 && 'text-destructive',
      )}
    >
      {formatDelta(current, previous)}
    </span>
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
