// 상세 분기 검증 — 처리완료면 답장 폼 대신 보낸 답장을 보여준다
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { type FeedbackDetail } from '../_model/useFeedbackDetailQuery';
import { FeedbackReply } from './FeedbackReply';

const completed: FeedbackDetail = {
  feedbackId: 7,
  userProfileId: 3,
  email: 'sujin@example.com',
  nickname: '수진',
  type: 'QUESTION',
  content: '스트릭은 몇 시에 초기화되나요?',
  status: 'COMPLETED',
  createdAt: '2026-08-20T10:00:00',
  updatedAt: '2026-08-21T09:00:00',
  reply: {
    letterId: 55,
    title: '문의 주신 내용 답변드려요',
    bodyText: '스트릭은 자정에 초기화돼요.',
    sentAt: '2026-08-21T09:00:00',
  },
};

describe('FeedbackReply', () => {
  it('처리완료면 보낸 답장을 보여주고 답장 폼은 그리지 않는다', () => {
    render(<FeedbackReply feedback={completed} onClose={() => {}} />);

    expect(
      screen.getByRole('heading', { name: '보낸 답장' }),
    ).toBeInTheDocument();
    expect(screen.getByText('문의 주신 내용 답변드려요')).toBeInTheDocument();
    expect(screen.getByText('스트릭은 자정에 초기화돼요.')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('제목')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /보내기/ }),
    ).not.toBeInTheDocument();
  });

  it('처리완료인데 답장 연결이 없으면 기록이 없다고 알린다 — 옛 데이터 방어', () => {
    render(
      <FeedbackReply
        feedback={{ ...completed, reply: null }}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText('답장 기록을 찾지 못했어요')).toBeInTheDocument();
  });
});
