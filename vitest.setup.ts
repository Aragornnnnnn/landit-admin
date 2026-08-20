// 모든 테스트 파일 앞에 실행 — jest-dom 매처(toBeInTheDocument 등)를 Vitest expect에 붙이고, 테스트마다 렌더 결과를 정리한다
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// vitest는 globals가 꺼져 있어 Testing Library의 자동 cleanup이 안 걸린다 — 직접 건다 (안 걸면 앞 테스트의 DOM이 다음 테스트에 남는다)
afterEach(() => {
  cleanup();
});
