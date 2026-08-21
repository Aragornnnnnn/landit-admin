'use client';

// 답장 진입점 — 초안은 여기서 들고 레이아웃에 내려준다
import type { FeedbackItem } from '../_model/useFeedbackListQuery';
import { useReplyDraft } from '../_model/useReplyDraft';
import { FeedbackReplySheet } from './FeedbackReplySheet';

interface FeedbackReplyProps {
  /** 목록에서 클릭한 피드백 (부모가 feedbackId를 key로 줘서 행이 바뀌면 새로 마운트된다) */
  feedback: FeedbackItem;
  onClose: () => void;
}

export function FeedbackReply({ feedback, onClose }: FeedbackReplyProps) {
  const draft = useReplyDraft(feedback);

  return (
    <FeedbackReplySheet feedback={feedback} draft={draft} onClose={onClose} />
  );
}
