// 공지 발행 전후와 복수 그룹을 선택하는 푸시 입력을 검증한다.
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  EMPTY_NOTICE_PUSH_SELECTION,
  toNoticePushAudience,
} from '../../_model/notice-push-audience';
import { NoticePushFields } from './NoticePushFields';

const options = {
  selection: EMPTY_NOTICE_PUSH_SELECTION,
  onSelectionChange: vi.fn(),
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

  it('선택한 구독 유형을 여러 개 포함할 수 있다', () => {
    const client = new QueryClient();
    const onChange = vi.fn();
    function Editor() {
      const [selection, setSelection] = useState(EMPTY_NOTICE_PUSH_SELECTION);
      return (
        <NoticePushFields
          {...options}
          published
          selection={selection}
          onSelectionChange={(next) => {
            setSelection(next);
            onChange(toNoticePushAudience(next));
          }}
        />
      );
    }
    render(
      <QueryClientProvider client={client}>
        <Editor />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '선택한 사용자' }));
    expect(screen.getByRole('button', { name: '푸시 보내기' })).toBeDisabled();
    fireEvent.click(screen.getByRole('checkbox', { name: '월간' }));
    fireEvent.click(screen.getByRole('checkbox', { name: '무료 체험' }));

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        audienceType: 'SELECTED',
        includedAudiences: ['MONTHLY', 'TRIAL'],
      }),
    );
    expect(screen.getByRole('button', { name: '푸시 보내기' })).toBeEnabled();
  });
});
