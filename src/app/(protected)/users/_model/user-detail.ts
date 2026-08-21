// 사용자 상세가 쓰는 말 — 코드 값을 사람 말로 바꾼다 (docs/screens/users.md "상세")
import type { Schema } from '@/shared/api/schema-patch';
import { formatDateDot } from '@/shared/lib/format-time';

export type UserDetail = Schema<'AdminUserDetailResponse'>;
type LearningLevel = NonNullable<UserDetail['learningLevel']>;
type PushStatus = NonNullable<UserDetail['pushPermissionStatus']>;
type ScenarioType = NonNullable<
  NonNullable<
    NonNullable<UserDetail['learningSummary']>['currentScenario']
  >['dailyScenarioType']
>;

export const LEARNING_LEVEL_LABEL: Record<LearningLevel, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

export const PUSH_STATUS_LABEL: Record<PushStatus, string> = {
  GRANTED: '허용',
  DENIED: '거부',
  NOT_DETERMINED: '미정',
};

export const SCENARIO_TYPE_LABEL: Record<ScenarioType, string> = {
  NEW: '오늘의 시나리오',
  RETRY: '다시 도전',
  CLEARED: '완료',
};

/** 값이 없을 때 쓰는 표시 — 빈칸으로 두면 줄이 밀려 보인다 */
export const EMPTY_VALUE = '—';

/** "카페에서 주문하기 · Day 13 · 오늘의 시나리오" */
export function currentScenarioLabel(
  scenario: NonNullable<UserDetail['learningSummary']>['currentScenario'],
): string {
  if (!scenario?.scenarioTitle) return EMPTY_VALUE;
  return [
    scenario.scenarioTitle,
    scenario.displayOrder ? `Day ${scenario.displayOrder}` : undefined,
    scenario.dailyScenarioType
      ? SCENARIO_TYPE_LABEL[scenario.dailyScenarioType]
      : undefined,
  ]
    .filter(Boolean)
    .join(' · ');
}

/**
 * 마지막 학습일 — 어드민이 알고 싶은 건 "요즘 쓰고 있나"라서 오늘·어제는 말로 적는다.
 * @param today 오늘 날짜 (테스트에서 고정한다)
 */
export function lastLearningLabel(
  date: string | undefined,
  today: Date,
): string {
  if (!date) return EMPTY_VALUE;
  const day = new Date(date);
  if (Number.isNaN(day.getTime())) return EMPTY_VALUE;
  const days = daysBetween(day, today);
  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  return formatDateDot(date);
}

// 시각이 아니라 날짜로 잰다 — 새벽 1시에 한 학습도 "오늘"이다
function daysBetween(from: Date, to: Date): number {
  const day = 86_400_000;
  const at = (date: Date) =>
    Math.floor(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() /
        day,
    );
  return at(to) - at(from);
}

/** "2026.08.18 09:12" — 마지막 수정 */
export function formatDateTimeDot(iso: string | undefined): string {
  if (!iso) return EMPTY_VALUE;
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return EMPTY_VALUE;
  const two = (value: number) => String(value).padStart(2, '0');
  return `${formatDateDot(iso)} ${two(at.getHours())}:${two(at.getMinutes())}`;
}
