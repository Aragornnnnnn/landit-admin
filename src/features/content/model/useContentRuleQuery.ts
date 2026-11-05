'use client';

// 제작 규칙 조회 훅 — 규칙 화면과 Day 상세의 승격 Dialog가 같은 키를 쓴다. 등록·은퇴가 이 키를 무효화한다
import { useQuery } from '@tanstack/react-query';

import { fetchContentRules } from '../api/content-rule';

export const CONTENT_RULES_KEY = ['content-rules'] as const;

export function useContentRulesQuery() {
  return useQuery({ queryKey: CONTENT_RULES_KEY, queryFn: fetchContentRules });
}
