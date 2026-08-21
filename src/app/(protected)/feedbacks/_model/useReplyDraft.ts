'use client';

// 답장 초안 상태 — 데스크톱 시트와 모바일 전체화면이 같은 규칙으로 움직이도록 한 곳에 모은다.
// 레이아웃은 이 값을 그리기만 하고, 무엇을 보낼 수 있는지·무엇이 선택됐는지는 전부 여기서 정한다
import { useState } from 'react';

import { reportError } from '@/shared/monitoring/report';

import {
  canSendReply,
  replyButtonLabel,
  toggleTogetherFeedback,
} from './reply-draft';
import type { FeedbackItem } from './useFeedbackListQuery';
import { useSendReplyMutation } from './useSendReplyMutation';
import { useUserPendingFeedbacksQuery } from './useUserPendingFeedbacksQuery';

export function useReplyDraft(feedback: FeedbackItem) {
  const primaryId = feedback.feedbackId!;
  const others = useUserPendingFeedbacksQuery(feedback.email);
  const sendReply = useSendReplyMutation();

  // 초기값으로만 잡는다 — 다른 행을 열면 부모의 key가 바뀌어 이 화면이 통째로 새로 마운트되므로
  // 남의 피드백에 쓰던 답장이 섞일 일이 없다 (초기화 이펙트가 필요 없는 이유)
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([primaryId]);
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const candidates = (others.data?.items ?? []).filter(
    (item) => item.feedbackId !== primaryId,
  );

  return {
    title,
    setTitle,
    bodyText,
    setBodyText,
    others,
    candidates,
    selectedIds,
    toggleFeedback: (feedbackId: number) =>
      setSelectedIds((ids) =>
        toggleTogetherFeedback(ids, primaryId, feedbackId),
      ),
    expanded,
    toggleExpanded: () => setExpanded((value) => !value),
    confirming,
    openConfirm: () => setConfirming(true),
    closeConfirm: () => setConfirming(false),
    sending: sendReply.isPending,
    sent: sendReply.isSuccess,
    canSend: canSendReply({ title, bodyText, feedbackIds: selectedIds }),
    buttonLabel: replyButtonLabel(selectedIds),
    send: () =>
      sendReply.mutate(
        {
          title: title.trim(),
          bodyText: bodyText.trim(),
          feedbackIds: selectedIds,
        },
        {
          onSettled: () => setConfirming(false),
          onError: (error) => reportError(error),
        },
      ),
  };
}

export type ReplyDraft = ReturnType<typeof useReplyDraft>;
