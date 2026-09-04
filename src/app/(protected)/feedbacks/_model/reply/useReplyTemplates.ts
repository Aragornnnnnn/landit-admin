'use client';

// 답장 템플릿 상태 — 브라우저 저장(localStorage)을 읽고 쓰는 한 곳.
// 외부 저장소 동기화라 useSyncExternalStore를 쓴다(이펙트 내 setState는 린트가 막는다, use-mobile과 같은 방식)
import { useSyncExternalStore } from 'react';

import {
  clearStoredTemplates,
  readStoredTemplates,
  REPLY_TEMPLATES_STORAGE_KEY,
  writeStoredTemplates,
} from './editable-reply-templates';
import { REPLY_TEMPLATES, type ReplyTemplate } from './reply-templates';

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// 스냅샷은 같은 저장값이면 같은 참조여야 한다 — 매번 새 배열을 주면 무한 렌더가 된다
let cachedRaw: string | null | undefined;
let cached: ReplyTemplate[] = REPLY_TEMPLATES;

function getSnapshot(): ReplyTemplate[] {
  const raw = window.localStorage.getItem(REPLY_TEMPLATES_STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = readStoredTemplates(window.localStorage);
  }
  return cached;
}

// 서버 렌더에는 저장소가 없다 — 기본값으로 그리고 하이드레이션 후 저장값으로 맞는다
const getServerSnapshot = () => REPLY_TEMPLATES;

export function useReplyTemplates() {
  const templates = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    templates,
    save: (next: ReplyTemplate[]) => {
      writeStoredTemplates(window.localStorage, next);
      emit();
    },
    reset: () => {
      clearStoredTemplates(window.localStorage);
      emit();
    },
  };
}

export type ReplyTemplatesStore = ReturnType<typeof useReplyTemplates>;
