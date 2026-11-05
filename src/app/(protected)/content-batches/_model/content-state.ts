// 백엔드 상태 전이와 생성 입력 조건을 화면의 행동 가능 여부로 변환한다.
import type { Schema } from '@/shared/api/schema-patch';

type BatchState = {
  batch: { status: string; dayCount?: number };
  days: { status: string }[];
};
export function creationError(
  request: Schema<'AdminContentBatchCreateRequest'>,
): string | null {
  const count = request.dayCount ?? 0;
  const amounts = ['chloe', 'marco', 'teddy'].map(
    (key) =>
      request.characterRatio[key as keyof typeof request.characterRatio] ?? 0,
  );
  if (!Number.isInteger(count) || count < 1 || count > 30)
    return 'Day 수는 1~30 사이 정수로 입력해 주세요.';
  if (
    amounts.some((n) => !Number.isInteger(n) || n < 0) ||
    amounts.reduce((a, b) => a + b, 0) !== count
  )
    return '캐릭터별 Day 수의 합을 제작 수와 맞춰 주세요.';
  if ((request.note?.length ?? 0) > 2000)
    return '요청 사항은 2,000자까지 입력해 주세요.';
  return null;
}
export function shouldPoll(data: BatchState | undefined): boolean {
  return (
    !!data &&
    (['REQUESTED', 'LINEUP_GENERATING', 'GENERATING'].includes(
      data.batch.status,
    ) ||
      data.days.some((d) => d.status === 'GENERATING'))
  );
}
export function canReview(batch: string, draft: string): boolean {
  return (
    ['GENERATING', 'REVIEW_READY'].includes(batch) &&
    ['REVIEW_READY', 'NEEDS_FIX', 'OK'].includes(draft)
  );
}
export function canApprove(data: BatchState | undefined): boolean {
  return (
    !!data &&
    data.batch.status === 'REVIEW_READY' &&
    data.days.length > 0 &&
    data.days.length === data.batch.dayCount &&
    data.days.every((d) => d.status === 'OK')
  );
}
export const REGENERATION_SCOPES = [
  ['ALL', 'Day 전체'],
  ['STAR_MESSAGES', '별점 문구'],
  ...['LEVEL_1', 'LEVEL_2_TO_3', 'LEVEL_4_TO_5'].flatMap((level, i) => [
    [
      `QUESTIONS_AND_EXPRESSIONS:${level}`,
      `레벨 ${['1', '2~3', '4~5'][i]} 질문·표현`,
    ],
    [`EXPRESSIONS:${level}`, `레벨 ${['1', '2~3', '4~5'][i]} 표현`],
  ]),
];
