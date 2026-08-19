import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // 목·스파이를 테스트마다 자동 리셋 — 한 테스트의 목 상태가 다음 테스트로 새지 않게 (docs/testing.md)
    clearMocks: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // server-only는 React 서버 조건 밖(테스트)에서 import하면 throw한다 — 빈 모듈로 대체
      'server-only': fileURLToPath(
        new URL('./vitest.server-only.ts', import.meta.url),
      ),
    },
  },
});
