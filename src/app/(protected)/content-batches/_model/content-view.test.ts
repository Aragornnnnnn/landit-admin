// 콘텐츠 검수 결과가 없을 때 통과로 오인하지 않는지 검증한다.
import { describe, expect, it } from 'vitest';

import { inspectContent, readReview } from './content-view';

describe('콘텐츠 검수 표시', () => {
  it('검수 결과가 없으면 미확인으로 표시한다', () => {
    expect(readReview(null)).toEqual({ recorded: false, items: [] });
    expect(readReview(undefined)).toEqual({ recorded: false, items: [] });
  });
  it('빈 검수 배열은 기록된 지적 없음으로 구분한다', () => {
    expect(readReview('[]')).toEqual({ recorded: true, items: [] });
  });
  it('깨진 검수 JSON은 통과로 표시하지 않는다', () => {
    expect(readReview('{broken')).toEqual({ recorded: false, items: [] });
  });
  it('누락된 난이도와 실제 질문 수를 그대로 반환한다', () => {
    const result = inspectContent(
      {
        questions: [{ questionLevelGroup: 'LEVEL_1', questionText: 'Hello?' }],
      },
      [],
      [],
    );
    expect(result.questions).toHaveLength(1);
    expect(
      result.questions.filter((q) => q.questionLevelGroup === 'LEVEL_4_TO_5'),
    ).toHaveLength(0);
    expect(result.expressions).toHaveLength(0);
  });
});
