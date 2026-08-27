// 템플릿 칩 동작 검증 — 누르면 채워지고, 쓰던 내용이 있으면 묻는다
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type FeedbackDetail } from '../_model/useFeedbackDetailQuery';
import { FeedbackReply } from './FeedbackReply';

// 답장 화면은 "이 사용자의 다른 피드백"을 조회한다 — 경계만 목으로 막는다 (docs/testing.md)
vi.mock('@/shared/api/client', () => ({
  api: { get: vi.fn().mockResolvedValue({ items: [] }) },
}));

// jsdom엔 matchMedia가 없다 — 데스크톱(시트) 분기로 고정한다
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia;

const pending: FeedbackDetail = {
  feedbackId: 5,
  userProfileId: 3,
  email: 'sujin@example.com',
  nickname: '수진',
  type: 'QUESTION',
  content: '스트릭은 몇 시에 초기화되나요?',
  status: 'PENDING',
  createdAt: '2026-08-20T10:00:00',
  updatedAt: '2026-08-20T10:00:00',
  reply: null,
};

function renderPending() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FeedbackReply feedback={pending} onClose={() => {}} />
    </QueryClientProvider>,
  );
}

describe('답장 템플릿', () => {
  it('칩을 누르면 공식 문구가 제목·본문에 채워진다', async () => {
    renderPending();

    await userEvent.click(screen.getByRole('button', { name: '문의 답변' }));

    expect(screen.getByLabelText('답장 제목')).toHaveValue(
      '문의하신 내용에 답변드립니다',
    );
    const body = screen.getByLabelText('답장 본문') as HTMLTextAreaElement;
    expect(body.value).toContain('안녕하세요, 랜딧입니다.');
    expect(body.value).toContain('랜딧 팀 드림');
  });

  it('쓰던 내용이 있으면 바로 덮지 않고 확인 창을 거친다', async () => {
    renderPending();
    await userEvent.type(screen.getByLabelText('답장 제목'), '직접 쓴 제목');

    await userEvent.click(screen.getByRole('button', { name: '응원 감사' }));

    // 아직 안 덮였다 — 확인 창이 먼저다
    expect(screen.getByLabelText('답장 제목')).toHaveValue('직접 쓴 제목');
    expect(
      screen.getByText('쓰던 내용을 지우고 템플릿을 적용할까요?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '적용' }));
    expect(screen.getByLabelText('답장 제목')).toHaveValue(
      '따뜻한 응원 감사합니다',
    );
  });
});
