// 공지 발행 전후와 구독 유형 숨김 설정에 따른 푸시 입력을 검증한다.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NoticePushFields } from './NoticePushFields';

const options = {
  blocked: false,
  disabled: false,
  published: false,
  requested: false,
  sendOnPublish: false,
  onSendOnPublishChange: vi.fn(),
  onRequest: vi.fn(),
};

describe('NoticePushFields', () => {
  it('발행 전에는 푸시 선택을 기본으로 끄고 클릭할 때만 켠다', () => {
    render(<NoticePushFields {...options} />);

    const checkbox = screen.getByRole('checkbox', {
      name: '발행할 때 푸시 보내기',
    });
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);

    expect(options.onSendOnPublishChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('button', { name: '푸시 보내기' })).toBeNull();
  });

  it('이미 발행했으면 푸시 요청을 바로 열 수 있다', () => {
    render(<NoticePushFields {...options} published />);

    fireEvent.click(screen.getByRole('button', { name: '푸시 보내기' }));

    expect(options.onRequest).toHaveBeenCalledOnce();
  });

  it('구독 유형을 숨긴 공지에서는 발송 버튼을 비활성화한다', () => {
    render(<NoticePushFields {...options} published blocked />);

    expect(screen.getByRole('button', { name: '푸시 보내기' })).toBeDisabled();
  });
});
