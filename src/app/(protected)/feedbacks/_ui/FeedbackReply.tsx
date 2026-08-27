'use client';

// 상세 진입점 — 처리중이면 답장 폼, 처리완료면 보낸 답장을 보여준다.
// 폼은 폭에 따라 시트(데스크톱)와 전체화면(모바일) 중 하나를 그린다
import { useState } from 'react';

import type { AdminFeedbackDetail } from '@/shared/api/schema-patch';
import { useIsMobile } from '@/shared/lib/use-mobile';

import { useReplyDraft } from '../_model/useReplyDraft';
import { FeedbackReplyScreen } from './FeedbackReplyScreen';
import { FeedbackReplySheet } from './FeedbackReplySheet';
import { SentReplyView } from './SentReplyView';

interface FeedbackReplyProps {
  /** 단건 조회로 받은 상세 (부모가 feedbackId를 key로 줘서 행이 바뀌면 새로 마운트된다) */
  feedback: AdminFeedbackDetail;
  onClose: () => void;
}

export function FeedbackReply({ feedback, onClose }: FeedbackReplyProps) {
  // 분기는 열 때 상태로 고정한다 — 전송 성공이 상세를 다시 불러 COMPLETED가 되어도
  // "보냈어요" 화면이 보낸 답장 뷰로 갑자기 바뀌지 않는다. 다시 열면 그때 보낸 답장이 보인다
  const [openedAsCompleted] = useState(feedback.status === 'COMPLETED');

  if (openedAsCompleted)
    return <SentReplyView feedback={feedback} onClose={onClose} />;
  return <PendingReply feedback={feedback} onClose={onClose} />;
}

// 초안 훅은 처리중일 때만 필요하다 — 분기 아래로 내려 훅 규칙을 지킨다
function PendingReply({ feedback, onClose }: FeedbackReplyProps) {
  const isMobile = useIsMobile();
  const draft = useReplyDraft(feedback);
  const Layout = isMobile ? FeedbackReplyScreen : FeedbackReplySheet;

  return <Layout feedback={feedback} draft={draft} onClose={onClose} />;
}
