// 루트 레이아웃 — 언어·메타데이터·전역 스타일. 셸(사이드바)은 (protected) 그룹 레이아웃이 담당한다
import type { Metadata } from 'next';

import { Toaster } from '@/shared/ui/shadcn/sonner';

import './globals.css';

import { Providers } from './providers';

// 모든 페이지를 요청 시 렌더한다 — CSP nonce가 요청마다 달라 정적 프리렌더와 양립하지 않는다 (src/proxy.ts).
// 어드민은 공개 정적 페이지가 없어 잃는 것도 없다
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Landit 어드민',
  // 어드민은 검색에 안 잡히게 한다 (robots.txt와 함께 이중으로)
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
        {/* 결과 토스트 — 사용자 웹과 같은 알약(성공 초록 ✓ / 오류 빨강 !) */}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
