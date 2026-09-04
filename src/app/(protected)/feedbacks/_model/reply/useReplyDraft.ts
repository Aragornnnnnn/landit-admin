'use client';

// 답장 초안 상태 — 데스크톱 시트와 모바일 전체화면이 같은 규칙으로 움직이도록 한 곳에 모은다.
// 레이아웃은 이 값을 그리기만 하고, 무엇을 보낼 수 있는지·무엇이 선택됐는지는 전부 여기서 정한다
import { useState } from 'react';

import type { FeedbackItem } from '@/features/feedback/api/feedback-list';
import { reportError } from '@/shared/monitoring/report';

import {
  canSendReply,
  replyButtonLabel,
  toggleTogetherFeedback,
} from './reply-draft';
import {
  defaultTemplateFor,
  fillTemplate,
  type ReplyTemplate,
} from './reply-templates';
import { useReplyTemplates } from './useReplyTemplates';
import { useSendReplyMutation } from './useSendReplyMutation';
import { useUserPendingFeedbacksQuery } from './useUserPendingFeedbacksQuery';

export function useReplyDraft(feedback: FeedbackItem) {
  const primaryId = feedback.feedbackId!;
  const others = useUserPendingFeedbacksQuery(feedback.email);
  const sendReply = useSendReplyMutation();
  const templatesStore = useReplyTemplates();

  // 유형에 맞는 템플릿을 미리 채워 시작한다 — 어드민은 필요한 부분만 고치면 된다
  const initialTemplate = defaultTemplateFor(
    feedback.type,
    templatesStore.templates,
  );
  const initialFill = initialTemplate
    ? fillTemplate(initialTemplate, feedback.nickname)
    : null;

  // 초기값으로만 잡는다 — 다른 행을 열면 부모의 key가 바뀌어 이 화면이 통째로 새로 마운트되므로
  // 남의 피드백에 쓰던 답장이 섞일 일이 없다 (초기화 이펙트가 필요 없는 이유)
  const [title, setTitle] = useState(initialFill?.title ?? '');
  const [bodyText, setBodyText] = useState(initialFill?.bodyText ?? '');
  const [appliedId, setAppliedId] = useState(initialTemplate?.id ?? null);
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
    templatesStore,
    /** 지금 적용돼 있는 템플릿 — 칩 강조 표시용 */
    appliedTemplateId: appliedId,
    /**
     * 제목·본문이 적용된 템플릿 그대로인가 — 그렇다면 다른 템플릿으로 바꿀 때 확인 없이 덮는다.
     * 직접 고친 글자가 있을 때만 "덮어쓸까요?"를 묻는다
     */
    isTemplateUntouched: (() => {
      const applied = templatesStore.templates.find(
        (one) => one.id === appliedId,
      );
      if (!applied) return title === '' && bodyText === '';
      const filled = fillTemplate(applied, feedback.nickname);
      return title === filled.title && bodyText === filled.bodyText;
    })(),
    /** 템플릿을 제목·본문에 채운다 — {닉네임}은 이 피드백의 닉네임으로 바뀐다. 쓰던 내용은 덮인다(확인은 UI가 한다) */
    applyTemplate: (template: ReplyTemplate) => {
      const filled = fillTemplate(template, feedback.nickname);
      setTitle(filled.title);
      setBodyText(filled.bodyText);
      setAppliedId(template.id);
    },
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
