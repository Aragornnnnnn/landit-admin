// 등록 카드 — 쓰는 도중에 보고 있는 scope가 바뀌어도 입력은 지키고, 등록에 성공하면 비운다
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';

import { CreateRuleCard } from './CreateRuleCard';

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

it('문장을 쓰는 중에 기본 scope가 바뀌어도 입력이 남는다', async () => {
  const user = userEvent.setup();
  const { rerender } = render(
    <CreateRuleCard
      defaultScope="QUESTION"
      pending={false}
      onCreate={vi.fn()}
    />,
  );
  await user.type(screen.getByLabelText(/규칙 문장/), '쓰던 문장');

  rerender(
    <CreateRuleCard defaultScope="COMMON" pending={false} onCreate={vi.fn()} />,
  );

  expect(screen.getByLabelText(/규칙 문장/)).toHaveValue('쓰던 문장');
});

it('등록이 끝났다고 알리면 입력을 비운다', async () => {
  const user = userEvent.setup();
  render(
    <CreateRuleCard
      defaultScope="QUESTION"
      pending={false}
      onCreate={(_, done) => done()}
    />,
  );
  await user.type(screen.getByLabelText(/규칙 문장/), '새 규칙');

  await user.click(screen.getByRole('button', { name: '등록' }));

  expect(screen.getByLabelText(/규칙 문장/)).toHaveValue('');
});
