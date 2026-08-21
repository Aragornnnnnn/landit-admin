'use client';

// 행 액션의 흐름 — 물어볼 일은 확인 창을 띄우고, 아닌 일은 바로 보낸다.
// 어떤 일이 물어볼 일인지는 letter-actions가 알고, 여기선 그 답에 따라 창을 열지만 정한다
import { useState } from 'react';

import { LETTER_CONFIRM, type LetterAction } from './letter-actions';
import { useLetterActionMutation } from './useLetterActionMutation';

export function useLetterActions() {
  const mutation = useLetterActionMutation();
  const [asked, setAsked] = useState<{
    letterId: number;
    action: LetterAction;
  } | null>(null);

  const run = (letterId: number, action: LetterAction) =>
    mutation.mutate({ letterId, action }, { onSuccess: () => setAsked(null) });

  return {
    /** 지금 묻고 있는 행동. 없으면 창이 닫혀 있다 */
    asked: asked?.action ?? null,
    pending: mutation.isPending,
    request: (letterId: number, action: LetterAction) =>
      LETTER_CONFIRM[action]
        ? setAsked({ letterId, action })
        : run(letterId, action),
    cancel: () => setAsked(null),
    // 실패해도 창을 닫지 않는다 — 토스트를 보고 다시 누를 수 있게
    confirm: () => asked && run(asked.letterId, asked.action),
  };
}
