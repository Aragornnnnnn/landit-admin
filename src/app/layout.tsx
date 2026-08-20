// 루트 레이아웃 — 언어·메타데이터·전역 스타일. 셸(사이드바)은 (protected) 그룹 레이아웃이 담당한다
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Landit 어드민',
  // 어드민은 검색에 안 잡히게 한다 (robots.txt와 함께 이중으로)
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
