'use client';

// 사용자 상세 — 헤더(누구인지) · 프로필/학습 요약 · 이 사람이 보낸 피드백 (Figma 1050:11654).
// 어드민이 이 화면을 여는 이유는 대개 "이 사람이 뭐라고 했더라"라서, 피드백 카드가 전체 폭을 쓴다
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { formatDateDot, formatDateTime } from '@/shared/lib/format-time';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { StatusChip } from '@/shared/ui/StatusChip';

import {
  currentScenarioLabel,
  EMPTY_VALUE,
  formatDateTimeDot,
  lastLearningLabel,
  LEARNING_LEVEL_LABEL,
  PUSH_STATUS_LABEL,
} from '../_model/user-detail';
import { USER_STATUS_DOT, USER_STATUS_LABEL } from '../_model/user-label';
import {
  useUserDetailQuery,
  useUserFeedbacksQuery,
} from '../_model/useUserDetailQuery';
import {
  FEEDBACK_STATUS_DOT,
  FEEDBACK_STATUS_LABEL,
  FEEDBACK_TYPE_LABEL,
} from '../../feedbacks/_model/feedback-label';
import type { FeedbackItem } from '../../feedbacks/_model/useFeedbackListQuery';

export function UserDetailPage({ userProfileId }: { userProfileId: number }) {
  const user = useUserDetailQuery(userProfileId);
  const feedbacks = useUserFeedbacksQuery(user.data?.email);

  if (user.isPending) return <ListSkeleton rows={5} className="pt-4" />;
  if (user.isError)
    return (
      <InlineError
        message="사용자를 불러오지 못했어요"
        onRetry={() => user.refetch()}
      />
    );

  const detail = user.data;
  const summary = detail.learningSummary;

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <header className="flex flex-wrap items-center gap-3">
        <Link
          href="/users"
          className="flex items-center gap-1.5 text-[13px] text-body hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          목록
        </Link>
        <span aria-hidden className="size-11 shrink-0 rounded-full bg-muted" />
        <span className="flex flex-col gap-0.5">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[18px] font-bold text-foreground">
              {detail.nickname || EMPTY_VALUE}
            </span>
            {detail.status && (
              <StatusChip dot={USER_STATUS_DOT[detail.status]}>
                {USER_STATUS_LABEL[detail.status]}
              </StatusChip>
            )}
            {/* 역할은 프레임대로 코드 그대로 — 상세는 운영자가 값을 확인하는 자리다 */}
            {detail.role && <StatusChip>{detail.role}</StatusChip>}
          </span>
          <span className="text-[12px] text-subtle">
            {detail.email} · userProfileId {detail.userProfileId} · 가입{' '}
            {detail.createdAt ? formatDateDot(detail.createdAt) : EMPTY_VALUE}
          </span>
        </span>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <Card title="프로필" className="lg:flex-1">
          <Row label="학습 목표 언어" value={detail.targetLocale} />
          <Row label="모국어" value={detail.baseLocale} />
          <Row label="학습 레벨">
            {detail.learningLevel ? (
              <span className="flex items-center gap-2">
                <StatusChip>
                  {LEARNING_LEVEL_LABEL[detail.learningLevel]}
                </StatusChip>
                <span>· currentLevel {detail.currentLevel ?? EMPTY_VALUE}</span>
              </span>
            ) : (
              EMPTY_VALUE
            )}
          </Row>
          {/* 튜터 이름을 주는 API가 없어 번호만 적는다 (docs/screens/users.md "구현 메모") */}
          <Row
            label="AI 튜터"
            value={detail.aiTutorId ? `#${detail.aiTutorId}` : undefined}
          />
          <Row label="푸시 권한">
            {detail.pushPermissionStatus ? (
              <StatusChip>
                {PUSH_STATUS_LABEL[detail.pushPermissionStatus]}
              </StatusChip>
            ) : (
              EMPTY_VALUE
            )}
          </Row>
          <Row
            label="마지막 수정"
            value={formatDateTimeDot(detail.updatedAt)}
          />
        </Card>

        <Card title="학습 요약" className="lg:flex-1">
          <div className="flex flex-wrap gap-2">
            <Tile
              label="완료 시나리오"
              value={String(summary?.completedScenarioCount ?? 0)}
            />
            <Tile
              label="현재 스트릭"
              value={`${summary?.currentStreakDays ?? 0}일`}
            />
            <Tile
              label="마지막 학습"
              value={lastLearningLabel(summary?.lastLearningDate, new Date())}
            />
          </div>
          <div className="mt-2 flex flex-col gap-1 rounded-[14px] bg-muted px-4 py-3.5">
            <span className="text-[12px] text-subtle">
              현재 제공 시나리오 (currentScenario)
            </span>
            <span className="text-[14px] font-medium text-strong">
              {currentScenarioLabel(summary?.currentScenario)}
            </span>
          </div>
        </Card>
      </div>

      <UserFeedbackCard
        items={feedbacks.data?.items ?? []}
        isPending={feedbacks.isPending}
        isError={feedbacks.isError}
        onRetry={() => feedbacks.refetch()}
      />
    </div>
  );
}

function UserFeedbackCard({
  items,
  isPending,
  isError,
  onRetry,
}: {
  items: FeedbackItem[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  return (
    <section className="w-full rounded-[20px] bg-card px-6 pt-6 pb-4">
      <header className="flex items-baseline justify-between px-1">
        <h2 className="text-[16px] font-bold text-strong">
          이 사용자가 보낸 피드백
        </h2>
        {!isPending && !isError && (
          <span className="text-[13px] text-subtle">{items.length}건</span>
        )}
      </header>

      {isPending ? (
        <ListSkeleton rows={2} className="pt-3" />
      ) : isError ? (
        <InlineError
          className="my-4"
          message="피드백을 불러오지 못했어요"
          onRetry={onRetry}
        />
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-[14px] text-subtle">
          아직 보낸 피드백이 없어요
        </p>
      ) : (
        <div className="pt-3">
          <div
            role="row"
            className="flex items-center gap-4 px-4 pb-2 text-xs font-medium text-subtle"
          >
            <span className="w-24 shrink-0">유형</span>
            <span className="min-w-px flex-1">내용</span>
            <span className="w-[88px] shrink-0">상태</span>
            <span className="w-[100px] shrink-0">접수</span>
          </div>
          {items.map((item, index) => (
            // 행을 누르면 그 피드백의 답장 화면으로 — 목록 화면이 ?open을 읽는다
            <Link
              key={item.feedbackId}
              href={`/feedbacks?open=${item.feedbackId}`}
              className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-hairline ${
                index % 2 === 0 ? 'bg-stripe' : ''
              }`}
            >
              <span className="w-24 shrink-0 text-[13px] font-medium text-chip-foreground">
                {item.type ? FEEDBACK_TYPE_LABEL[item.type] : ''}
              </span>
              <span className="min-w-px flex-1 truncate text-[13px] text-strong">
                {item.content}
              </span>
              <span className="flex w-[88px] shrink-0 items-center gap-[5px] text-[13px] text-body">
                {item.status && (
                  <>
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full ${
                        FEEDBACK_STATUS_DOT[item.status] === 'done'
                          ? 'bg-success'
                          : 'bg-primary'
                      }`}
                    />
                    {FEEDBACK_STATUS_LABEL[item.status]}
                  </>
                )}
              </span>
              <span className="w-[100px] shrink-0 text-[13px] text-subtle">
                {item.createdAt ? formatDateTime(item.createdAt) : ''}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Card({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`flex w-full flex-col gap-3 rounded-[20px] bg-card px-7 py-6 ${className ?? ''}`}
    >
      <h2 className="text-[16px] font-bold text-strong">{title}</h2>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[120px] shrink-0 text-[13px] text-subtle">
        {label}
      </span>
      <span className="text-[13px] font-medium text-foreground">
        {children ?? value ?? EMPTY_VALUE}
      </span>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-[14px] bg-muted px-4 py-3.5">
      <span className="text-[12px] text-subtle">{label}</span>
      <span className="text-[20px] font-bold text-foreground">{value}</span>
    </div>
  );
}
