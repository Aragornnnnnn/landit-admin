// 인라인 오류 검증 — 다시 시도 유무 갈림길과 기본 문구 폴백
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InlineError } from './InlineError';

describe('InlineError', () => {
  it('다시 시도를 누르면 넘겨받은 함수를 부른다', async () => {
    const retry = vi.fn();
    render(<InlineError message="불러오지 못했어요" onRetry={retry} />);

    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(retry).toHaveBeenCalledOnce();
  });

  it('다시 시도할 방법이 없으면 버튼을 그리지 않는다', () => {
    render(<InlineError message="권한이 없어요" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('문구를 주지 않으면 기본 문구를 쓴다', () => {
    render(<InlineError />);

    expect(screen.getByRole('alert')).toHaveTextContent('불러오지 못했어요');
  });
});
