// 사이드바 그룹의 초기 펼침과 키보드 접기 동작을 검증한다.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Link from 'next/link';
import { describe, expect, it } from 'vitest';

import { SidebarNavGroup } from './SidebarNavGroup';

describe('사이드바 그룹', () => {
  it('현재 화면의 그룹이면 처음부터 메뉴를 보여 준다', () => {
    render(
      <SidebarNavGroup label="시나리오" active>
        <Link href="/scenarios">목록</Link>
      </SidebarNavGroup>,
    );
    expect(screen.getByRole('button', { name: '시나리오' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('link', { name: '목록' })).toBeVisible();
  });
  it('다른 그룹이면 접힌 상태로 시작하고 Enter와 Space로 전환한다', async () => {
    const user = userEvent.setup();
    render(
      <SidebarNavGroup label="설정" active={false}>
        <Link href="/app-versions">앱 버전</Link>
      </SidebarNavGroup>,
    );
    const button = screen.getByRole('button', { name: '설정' });
    expect(
      screen.queryByRole('link', { name: '앱 버전' }),
    ).not.toBeInTheDocument();

    button.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('link', { name: '앱 버전' })).toBeVisible();
    expect(
      document.getElementById(button.getAttribute('aria-controls')!),
    ).toBeVisible();
    await user.keyboard(' ');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('link', { name: '앱 버전' }),
    ).not.toBeInTheDocument();
  });
  it('제목 없는 대시보드는 접기 버튼 없이 계속 표시한다', () => {
    render(
      <SidebarNavGroup label={null} active={false}>
        <Link href="/">대시보드</Link>
      </SidebarNavGroup>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '대시보드' })).toBeVisible();
  });
});
