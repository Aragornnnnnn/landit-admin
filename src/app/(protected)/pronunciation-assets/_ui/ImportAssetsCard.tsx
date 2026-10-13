'use client';

// 임포트 단계를 확인하고 부분 실패를 포함한 실행 결과를 남긴다.
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/shared/api/api-error';
import { reportError } from '@/shared/monitoring/report';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';

import {
  COVERAGE_KEY,
  importAssets,
  type ImportStage,
} from '../_api/pronunciation-assets';

export function ImportAssetsCard() {
  const client = useQueryClient();
  const [keys, setKeys] = useState({ reference: '', tts: '' });
  const [stage, setStage] = useState<ImportStage | null>(null);
  const mutation = useMutation({
    mutationFn: ({ stage, key }: { stage: ImportStage; key: string }) =>
      importAssets(stage, key),
    retry: false,
    onError: () => reportError(new Error('발음 에셋 임포트 실패')),
    onSettled: () => {
      setStage(null);
      void client.invalidateQueries({ queryKey: COVERAGE_KEY });
    },
  });
  const result = mutation.data;
  return (
    <section className="space-y-5 rounded-[20px] bg-card p-6">
      <h2 className="text-lg font-bold">S3 매니페스트 임포트</h2>
      <p className="text-sm text-subtle">
        기준 데이터를 먼저 등록한 뒤 TTS 음성을 연결해 주세요.
      </p>
      {(['reference', 'tts'] as const).map((value, index) => (
        <form
          key={value}
          className="space-y-3 rounded-xl bg-muted p-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (keys[value].trim()) setStage(value);
          }}
        >
          <h3 className="font-medium">
            {index + 1}단계 ·{' '}
            {value === 'reference' ? '기준 데이터' : 'TTS 음성'}
          </h3>
          <label className="block text-sm">
            {value === 'reference'
              ? '기준 데이터 매니페스트 키'
              : 'TTS 매니페스트 키'}
            <Input
              required
              value={keys[value]}
              disabled={mutation.isPending}
              onChange={(event) =>
                setKeys({ ...keys, [value]: event.target.value })
              }
              placeholder="content/expression-pronunciation-audio/manifests/…json"
              className="mt-2 bg-card"
            />
          </label>
          <Button
            type="submit"
            disabled={mutation.isPending || !keys[value].trim()}
          >
            {value === 'reference' ? '기준 데이터 임포트' : 'TTS 임포트'}
          </Button>
        </form>
      ))}
      {mutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {mutation.error instanceof ApiError
            ? mutation.error.message
            : '임포트 결과를 확인하지 못했어요. 현황을 먼저 확인해 주세요.'}
        </p>
      )}
      {result && (
        <div role="status" className="space-y-3 rounded-xl bg-muted p-5">
          <h3 className="font-bold">임포트 결과</h3>
          <p className="text-sm">
            삽입 {result.inserted}개 · 갱신 {result.updated}개 · 실패{' '}
            {result.failures.length}개
          </p>
          {result.failures.length > 0 && (
            <>
              <p className="text-sm text-destructive">
                일부 에셋을 반영하지 못했어요. 실패 사유를 확인해 주세요.
              </p>
              <ul className="max-h-80 space-y-2 overflow-y-auto">
                {result.failures.map((failure, index) => (
                  <li key={index} className="text-sm break-words">
                    #{failure.expressionId ?? '알 수 없음'} ·{' '}
                    {failure.accentLocale ?? '억양 없음'} ·{' '}
                    {failure.reason ?? '사유 없음'}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      <ActionConfirmDialog
        open={stage !== null}
        title={
          stage === 'reference'
            ? '기준 데이터를 임포트할까요?'
            : 'TTS 음성을 임포트할까요?'
        }
        pending={mutation.isPending}
        onCancel={() => setStage(null)}
        onConfirm={() => {
          if (stage) mutation.mutate({ stage, key: keys[stage].trim() });
        }}
      >
        <p className="break-all">{stage ? keys[stage].trim() : ''}</p>
        <p>
          {stage === 'reference'
            ? '기존 기준 데이터를 덮어쓰고 단어별 음성 URL을 초기화해요. 이후 TTS를 다시 임포트해야 해요.'
            : '등록된 기준 데이터에 음성 URL을 연결해요. 기준 데이터가 없는 표현은 실패 목록에 남아요.'}
        </p>
      </ActionConfirmDialog>
    </section>
  );
}
