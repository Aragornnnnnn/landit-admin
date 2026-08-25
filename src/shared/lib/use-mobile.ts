// 뷰포트가 모바일 폭(<768)인지 — shadcn Sidebar가 쓴다. 생성본은 effect 안에서 setState를 불러 lint(set-state-in-effect)에 걸려
// useSyncExternalStore로 다시 썼다. 파일명은 shadcn 별칭(@/hooks/use-mobile) 그대로 둔다
import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
// 서버 렌더에선 판단할 수 없으므로 데스크톱으로 가정한다 — 하이드레이션 후 실제 값으로 바뀐다
const getServerSnapshot = () => false;

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
