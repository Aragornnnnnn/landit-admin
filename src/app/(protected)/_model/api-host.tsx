'use client';

// 지금 보고 있는 BE 호스트 — 서버 레이아웃이 env에서 읽어 셸에 내려주고, 아래 화면들은 이 컨텍스트로 읽는다.
// 호스트는 비밀이 아니고(사이드바 카드에 이미 적혀 있다) 화면마다 prop으로 내리기엔 너무 깊다
import { createContext, use } from 'react';

const ApiHostContext = createContext('');

export function ApiHostProvider({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <ApiHostContext value={value}>{children}</ApiHostContext>;
}

export function useApiHost() {
  return use(ApiHostContext);
}
