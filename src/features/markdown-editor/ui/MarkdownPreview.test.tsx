// 미리보기 — 앱과 같은 렌더 조합이라는 약속과, 운영자가 실수로 넣은 HTML·javascript: 주소가 앱에서처럼 무해한지
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MarkdownPreview } from './MarkdownPreview';

describe('MarkdownPreview', () => {
  it('엔터 한 번도 줄바꿈으로 그린다 — 앱(remark-breaks)과 같다', () => {
    const { container } = render(<MarkdownPreview text={'첫 줄\n둘째 줄'} />);

    expect(container.querySelector('br')).not.toBeNull();
  });

  it('![설명](주소)를 이미지로, [글자](주소)를 링크로 그린다', () => {
    render(
      <MarkdownPreview
        text={'![캡처](https://img.landit.im/a.png)\n[랜딧](https://landit.im)'}
      />,
    );

    expect(screen.getByRole('img', { name: '캡처' })).toHaveAttribute(
      'src',
      'https://img.landit.im/a.png',
    );
    expect(screen.getByRole('link', { name: '랜딧' })).toHaveAttribute(
      'href',
      'https://landit.im',
    );
  });

  it('javascript: 주소는 링크로 만들지 않는다', () => {
    render(<MarkdownPreview text="[눌러봐](javascript:alert(1))" />);

    expect(screen.getByText('눌러봐').getAttribute('href') ?? '').not.toContain(
      'javascript',
    );
  });

  it('본문에 적은 HTML 태그는 그리지도, 글자로 보여주지도 않는다', () => {
    const { container } = render(
      <MarkdownPreview
        text={
          '<script>alert(1)</script><img src=x onerror=alert(1)>\n\n다음 문단'
        }
      />,
    );

    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).not.toContain('<script>');
    expect(screen.getByText('다음 문단')).toBeInTheDocument();
  });

  it('비어 있으면 미리볼 게 없다고 알린다', () => {
    render(<MarkdownPreview text="" />);

    expect(screen.getByText('미리볼 내용이 없어요')).toBeInTheDocument();
  });
});
