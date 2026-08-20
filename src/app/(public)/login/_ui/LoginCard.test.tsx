// 로그인 카드 동작 검증 — 버튼 클릭·진행 중 비활성·관리자 아님 변형
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { LoginCard } from './LoginCard';

describe('LoginCard', () => {
  it('카카오·Google 버튼을 누르면 해당 provider로 로그인을 시작한다', async () => {
    const onLogin = vi.fn();
    render(
      <LoginCard
        pending={null}
        forbidden={null}
        onLogin={onLogin}
        onDismissForbidden={() => {}}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: '카카오로 로그인' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Google로 로그인' }),
    );

    expect(onLogin).toHaveBeenNthCalledWith(1, 'kakao');
    expect(onLogin).toHaveBeenNthCalledWith(2, 'google');
  });

  it('진행 중이면 두 버튼 모두 비활성이고 누른 버튼만 busy다 — 중복 클릭 방지', () => {
    render(
      <LoginCard
        pending="kakao"
        forbidden={null}
        onLogin={() => {}}
        onDismissForbidden={() => {}}
      />,
    );

    const kakao = screen.getByRole('button', { name: '카카오로 로그인' });
    const google = screen.getByRole('button', { name: 'Google로 로그인' });
    expect(kakao).toBeDisabled();
    expect(google).toBeDisabled();
    expect(kakao).toHaveAttribute('aria-busy', 'true');
    expect(google).toHaveAttribute('aria-busy', 'false');
  });

  it('관리자 아님이면 마스킹된 이메일로 안내하고 "다른 계정으로 로그인"을 보여준다', async () => {
    const onDismiss = vi.fn();
    render(
      <LoginCard
        pending={null}
        forbidden={{ maskedEmail: 'suj***@gmail.com' }}
        onLogin={() => {}}
        onDismissForbidden={onDismiss}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'suj***@gmail.com 계정은 관리자 권한이 없어요',
    );
    await userEvent.click(
      screen.getByRole('button', { name: '다른 계정으로 로그인' }),
    );
    expect(onDismiss).toHaveBeenCalled();
  });

  it('관리자 아님이 아니면 안내 박스와 다른 계정 버튼이 없다', () => {
    render(
      <LoginCard
        pending={null}
        forbidden={null}
        onLogin={() => {}}
        onDismissForbidden={() => {}}
      />,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '다른 계정으로 로그인' }),
    ).not.toBeInTheDocument();
  });
});
