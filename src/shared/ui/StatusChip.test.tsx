// 칩 검증 — 라벨 표시와 점 유무 갈림길
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it('점을 주지 않으면 라벨만 보여준다', () => {
    const { container } = render(<StatusChip>공지</StatusChip>);

    expect(screen.getByText('공지')).toBeInTheDocument();
    expect(container.querySelector('[data-dot]')).toBeNull();
  });

  it('점을 주면 라벨 앞에 붙이되 스크린리더에는 숨긴다 — 뜻은 라벨이 전한다', () => {
    const { container } = render(
      <StatusChip dot="progress">처리중</StatusChip>,
    );

    const dotElement = container.querySelector('[data-dot="progress"]');
    expect(dotElement).not.toBeNull();
    expect(dotElement).toHaveAttribute('aria-hidden');
    expect(screen.getByText('처리중')).toBeInTheDocument();
  });
});
