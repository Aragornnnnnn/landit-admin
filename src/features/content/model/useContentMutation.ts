'use client';

// 콘텐츠 제작 변경 훅 — 배치(접수·라인업·진행·재시작·승인) · Day(검수·재생성) · 규칙(등록·은퇴).
// 성공 토스트 문구는 docs/screens/content-batches.md "정확한 카피", 실패는 BE 메시지까지만 (409 상태 가드가 그대로 보인다)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { failureMessage } from '@/shared/api/api-error';
import { reportError } from '@/shared/monitoring/report';

import {
  approveContentBatch,
  createContentBatch,
  proceedContentBatch,
  regenerateContentDraft,
  regenerateLineup,
  resumeContentBatch,
  reviewContentDraft,
  updateLineup,
  type ContentBatchRequest,
  type LineupRowRequest,
  type ReviewCommentRequest,
  type ReviewVerdict,
} from '../api/content-batch';
import {
  createContentRule,
  retireContentRule,
  type ContentRuleRequest,
} from '../api/content-rule';
import { estimateGeneration } from './batch-request';
import { regenerationScopeOf } from './regeneration-scope';
import { markRegenerated } from './review-visit';
import { CONTENT_KEY } from './useContentQuery';
import { CONTENT_RULES_KEY } from './useContentRuleQuery';

const FAILED_FALLBACK = '처리하지 못했어요. 다시 시도해 주세요';

export type ContentBatchAction =
  | { type: 'create'; body: ContentBatchRequest }
  | { type: 'lineup'; batchId: number; rows: LineupRowRequest[] }
  | { type: 'regenerateLineup'; batchId: number; comment: string }
  | { type: 'proceed'; batchId: number; dayCount: number }
  | { type: 'resume'; batchId: number }
  | { type: 'approve'; batchId: number };

function runBatchAction(action: ContentBatchAction) {
  switch (action.type) {
    case 'create':
      return createContentBatch(action.body);
    case 'lineup':
      return updateLineup(action.batchId, action.rows);
    case 'regenerateLineup':
      return regenerateLineup(action.batchId, action.comment);
    case 'proceed':
      return proceedContentBatch(action.batchId);
    case 'resume':
      return resumeContentBatch(action.batchId);
    case 'approve':
      return approveContentBatch(action.batchId);
  }
}

function batchActionDone(action: ContentBatchAction, batchId: number): string {
  switch (action.type) {
    case 'create':
      return `배치 #${batchId}를 접수했어요`;
    case 'lineup':
      return '라인업을 저장했어요';
    case 'regenerateLineup':
      return '코멘트로 라인업을 다시 만들어요 · 약 1분';
    case 'proceed':
      return `Day 생성을 시작했어요 · 약 ${estimateGeneration(action.dayCount).minutes}분`;
    case 'resume':
      return '재시작했어요';
    case 'approve':
      return '승인했어요 · 표현 id를 예약했어요';
  }
}

/** 배치 여섯 액션 — 끝나면 목록·상세·다음 Day를 모두 다시 읽는다(상태와 예약 Day가 바뀐다) */
export function useContentBatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: runBatchAction,
    onSuccess: (detail, action) => {
      toast.success(batchActionDone(action, detail.batch.batchId));
      queryClient.invalidateQueries({ queryKey: CONTENT_KEY });
    },
    onError: (error) => {
      reportError(error);
      toast.error(failureMessage(error, FAILED_FALLBACK));
    },
  });
}

export type ContentDraftAction =
  | { type: 'review'; verdict: ReviewVerdict; comments: ReviewCommentRequest[] }
  | { type: 'regenerate'; scope: string };

/** Day 검수·재생성 — 재생성은 로컬 "다시 볼 것" 기록을 남긴다 */
export function useContentDraftMutation(batchId: number, draftId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: ContentDraftAction) =>
      action.type === 'review'
        ? reviewContentDraft(batchId, draftId, action.verdict, action.comments)
        : regenerateContentDraft(batchId, draftId, action.scope),
    onSuccess: (_draft, action) => {
      if (action.type === 'review') {
        toast.success(`${action.verdict}로 저장했어요`);
      } else {
        markRegenerated(draftId);
        toast.success(
          `다시 만들고 있어요 · ${regenerationScopeOf(action.scope).label}`,
        );
      }
      queryClient.invalidateQueries({ queryKey: CONTENT_KEY });
    },
    onError: (error) => {
      reportError(error);
      toast.error(failureMessage(error, FAILED_FALLBACK));
    },
  });
}

export type ContentRuleAction =
  | { type: 'create'; body: ContentRuleRequest }
  | { type: 'retire'; ruleId: number };

export function useContentRuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: ContentRuleAction) =>
      action.type === 'create'
        ? createContentRule(action.body)
        : retireContentRule(action.ruleId),
    onSuccess: (rule, action) => {
      toast.success(
        action.type === 'create'
          ? `${rule.ruleCode}로 등록했어요`
          : `${rule.ruleCode}를 은퇴했어요`,
      );
      queryClient.invalidateQueries({ queryKey: CONTENT_RULES_KEY });
    },
    onError: (error) => {
      reportError(error);
      toast.error(failureMessage(error, FAILED_FALLBACK));
    },
  });
}
