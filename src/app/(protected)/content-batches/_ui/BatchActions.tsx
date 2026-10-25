'use client';

// 시나리오 목록 재생성·본문 생성 진행·전체 Day 승인을 실제 배치 상태에 맞춰 제공한다.
import { useState } from 'react';

import type { Schema } from '@/shared/api/schema-patch';

import { canApprove } from '../_model/content-state';
import { ContentAction } from './ContentAction';

export function BatchActions({
  data,
}: {
  data: Schema<'AdminContentBatchResponse'>;
}) {
  const [comment, setComment] = useState('');
  const batchId = data.batch.batchId;
  if (data.batch.status === 'LINEUP_READY')
    return (
      <div className="space-y-3 border-t pt-4">
        <label className="block text-sm">
          목록 수정 요청
          <textarea
            aria-label="목록 수정 요청"
            maxLength={2000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="mt-2 w-full rounded-lg border p-3"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <ContentAction
            label="목록 다시 생성"
            command={{ kind: 'lineup', batchId, comment: comment.trim() }}
            disabled={!comment.trim()}
          >
            <p>
              Day {data.batch.startDay}~{data.batch.endDay}의 시나리오 목록을
              다시 생성합니다. AI 호출 비용이 발생합니다.
            </p>
          </ContentAction>
          <ContentAction
            label="확인 후 생성 진행"
            command={{ kind: 'proceed', batchId }}
          >
            <p>
              확인한 Day {data.batch.dayCount}개 각각에 질문 9개·표현 12개·별점
              문구 5개를 생성합니다. AI 호출 비용이 발생합니다.
            </p>
          </ContentAction>
        </div>
      </div>
    );
  if (data.batch.status === 'REVIEW_READY')
    return (
      <div className="flex flex-wrap items-center gap-3 border-t pt-4">
        <ContentAction
          label="배치 승인"
          command={{ kind: 'approve', batchId }}
          disabled={!canApprove(data)}
        >
          <p>
            Day {data.batch.startDay}~{data.batch.endDay}의 텍스트 콘텐츠{' '}
            {data.batch.dayCount}개를 승인하고 표현 ID를 예약합니다.
          </p>
          <p>이미지·음성 생성과 운영 발행은 포함하지 않습니다.</p>
        </ContentAction>
        <p className="text-sm text-subtle">
          모든 Day를 검수 OK로 저장해야 승인할 수 있어요.
        </p>
      </div>
    );
  return null;
}
