// 1차 Day 상세(검수·재생성)가 쓰는 규칙 — LAN-813에서 features/content/model의 content-actions·regeneration-scope로 대체하고 지운다.
// 접수 검증·폴링·승인 판정은 features/content/model로 옮겨져 여기서 뺐다

export function canReview(batch: string, draft: string): boolean {
  return (
    ['GENERATING', 'REVIEW_READY'].includes(batch) &&
    ['REVIEW_READY', 'NEEDS_FIX', 'OK'].includes(draft)
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
