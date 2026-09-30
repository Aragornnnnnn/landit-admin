// 첨부 썸네일 동작 검증 — 없으면 안 그리고, 못 불러오면 자리 표시, 누르면 크게 본다
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FeedbackAttachments } from './FeedbackAttachments';

const attachments = [
  {
    attachmentId: 34,
    contentType: 'image/png',
    fileSize: 1024,
    downloadUrl: '/api/v1/mailbox/feedbacks/12/attachments/34',
  },
  {
    attachmentId: 35,
    contentType: 'image/jpeg',
    fileSize: 2048,
    downloadUrl: '/api/v1/mailbox/feedbacks/12/attachments/35',
  },
];

describe('FeedbackAttachments', () => {
  it('첨부가 없으면 아무것도 그리지 않는다', () => {
    const { container } = render(<FeedbackAttachments attachments={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('첨부마다 프록시 경로로 썸네일을 그린다', () => {
    render(<FeedbackAttachments attachments={attachments} />);

    const thumbnails = screen.getAllByRole('img');
    expect(thumbnails.map((img) => img.getAttribute('src'))).toEqual([
      '/api/proxy/api/v1/mailbox/feedbacks/12/attachments/34',
      '/api/proxy/api/v1/mailbox/feedbacks/12/attachments/35',
    ]);
  });

  it('이미지를 불러오지 못하면 깨진 이미지 대신 자리 표시를 둔다', () => {
    render(<FeedbackAttachments attachments={attachments.slice(0, 1)} />);

    fireEvent.error(screen.getByRole('img'));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('이미지를 불러오지 못했어요')).toBeInTheDocument();
  });

  it('썸네일을 누르면 그 이미지를 크게 띄운다', async () => {
    render(<FeedbackAttachments attachments={attachments} />);

    await userEvent.click(
      screen.getByRole('button', { name: '첨부 이미지 2 크게 보기' }),
    );

    const dialog = await screen.findByRole('dialog', {
      name: '첨부 이미지 2 / 2',
    });
    expect(dialog.querySelector('img')).toHaveAttribute(
      'src',
      '/api/proxy/api/v1/mailbox/feedbacks/12/attachments/35',
    );
  });
});
