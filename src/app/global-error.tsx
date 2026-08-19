'use client';

// 루트 레이아웃까지 죽었을 때의 최후 방어선 — 스타일 시트 없이도 그려지도록 인라인 스타일만 쓴다
import { useEffect } from 'react';

import { reportError } from '@/shared/monitoring/report';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '0 32px',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        <div>
          <h1
            style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111' }}
          >
            문제가 생겼어요
          </h1>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 15,
              lineHeight: '22px',
              color: '#6b7280',
            }}
          >
            잠시 후 다시 시도해 주세요
          </p>
        </div>
        <button
          onClick={reset}
          style={{
            height: 44,
            padding: '0 20px',
            border: 'none',
            borderRadius: 12,
            backgroundColor: '#e07a3a',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
