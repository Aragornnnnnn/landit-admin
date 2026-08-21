'use client';

// 답장 진입점 — 초안은 여기서 들고, 폭에 따라 시트(데스크톱)와 전체화면(모바일) 중 하나를 그린다.
// 상태를 위에 두었으므로 화면을 돌려 폭이 바뀌어도 쓰던 글이 사라지지 않는다
import { useIsMobile } from '@/shared/lib/use-mobile';

import type { FeedbackItem } from '../_model/useFeedbackListQuery';
import { useReplyDraft } from '../_model/useReplyDraft';
import { FeedbackReplyScreen } from './FeedbackReplyScreen';
import { FeedbackReplySheet } from './FeedbackReplySheet';

interface FeedbackReplyProps {
  /** 목록에서 클릭한 피드백 (부모가 feedbackId를 key로 줘서 행이 바뀌면 새로 마운트된다) */
  feedback: FeedbackItem;
  onClose: () => void;
}

export function FeedbackReply({ feedback, onClose }: FeedbackReplyProps) {
  const isMobile = useIsMobile();
  const draft = useReplyDraft(feedback);
  const Layout = isMobile ? FeedbackReplyScreen : FeedbackReplySheet;

  return <Layout feedback={feedback} draft={draft} onClose={onClose} />;
}
