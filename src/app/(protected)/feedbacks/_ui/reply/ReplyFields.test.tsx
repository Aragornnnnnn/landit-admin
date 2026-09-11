// 템플릿 칩 동작 검증 — 누르면 채워지고, 쓰던 내용이 있으면 묻는다
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type FeedbackDetail } from '../../_model/reply/useFeedbackDetailQuery';
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

function renderPending(type: FeedbackDetail['type'] = 'QUESTION') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FeedbackReply feedback={{ ...pending, type }} onClose={() => {}} />
    </QueryClientProvider>,
  );
}

describe('답장 템플릿', () => {
  beforeEach(() => localStorage.clear());

  it('문의 피드백을 열면 문의 답변 템플릿이 미리 채워지고, 문의용 칩만 보인다', () => {
    renderPending('QUESTION');

    expect(screen.getByLabelText('답장 제목')).toHaveValue(
      '문의하신 내용에 답변드립니다',
    );
    const body = screen.getByLabelText('답장 본문') as HTMLTextAreaElement;
    expect(body.value).toContain('안녕하세요, 랜딧입니다.');
    expect(body.value).toContain('랜딧 팀 드림');
    // 다른 유형의 템플릿은 숨긴다 — 고를 게 적어야 빠르다
    expect(
      screen.queryByRole('button', { name: '응원 감사' }),
    ).not.toBeInTheDocument();
  });

  it('템플릿 그대로면 다른 칩을 눌렀을 때 확인 없이 바로 바뀐다', async () => {
    renderPending('BUG_REPORT');

    await userEvent.click(
      screen.getByRole('button', { name: '버그 수정 완료' }),
    );

    expect(
      screen.queryByText('쓰던 내용을 지우고 템플릿을 적용할까요?'),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('답장 제목')).toHaveValue(
      '제보하신 오류를 수정했습니다',
    );
  });

  it('직접 고친 글자가 있으면 바로 덮지 않고 확인 창을 거친다', async () => {
    renderPending('BUG_REPORT');
    await userEvent.type(screen.getByLabelText('답장 제목'), ' 추가로 씀');

    await userEvent.click(
      screen.getByRole('button', { name: '버그 수정 완료' }),
    );

    // 아직 안 덮였다 — 확인 창이 먼저다
    expect(
      screen.getByText('쓰던 내용을 지우고 템플릿을 적용할까요?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '적용' }));
    expect(screen.getByLabelText('답장 제목')).toHaveValue(
      '제보하신 오류를 수정했습니다',
    );
  });

  it('관리에서 칩 이름을 바꿔 저장하면 칩에 바로 반영된다', async () => {
    // 관리 목록의 첫 템플릿이 응원 감사라, 그 칩이 보이는 응원 유형으로 연다
    renderPending('CHEER');

    await userEvent.click(screen.getByRole('button', { name: '관리' }));
    const label = screen.getByLabelText('칩 이름');
    await userEvent.clear(label);
    await userEvent.type(label, '나만의 인사');
    await userEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(
      screen.getByRole('button', { name: '나만의 인사' }),
    ).toBeInTheDocument();
  });
});
