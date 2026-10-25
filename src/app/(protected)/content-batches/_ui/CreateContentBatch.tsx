'use client';

// 실제 다음 Day와 캐릭터별 분량을 확인한 뒤 제작 요청을 제출한다.
import { useState } from 'react';

import { creationError } from '../_model/content-state';
import { useNextContentDayQuery } from '../_model/useContentQuery';
import { ContentAction } from './ContentAction';

export function CreateContentBatch({
  onCreated,
}: {
  onCreated: (id: number) => void;
}) {
  const next = useNextContentDayQuery();
  const [count, setCount] = useState(1);
  const [ratio, setRatio] = useState({ chloe: 1, marco: 0, teddy: 0 });
  const [note, setNote] = useState('');
  const request = { dayCount: count, characterRatio: ratio, note };
  const error = creationError(request);
  return (
    <details
      className="rounded-xl border bg-card p-5"
      open={!next.data?.reservedDayCount}
    >
      <summary className="cursor-pointer text-lg font-bold">
        새 콘텐츠 생성
      </summary>
      <div className="mt-4 space-y-4">
        <p className="text-sm text-body">
          {next.data
            ? `다음 시작 Day ${next.data.nextDay} · 운영 ${next.data.publishedScenarioCount}개 · 미발행 예약 ${next.data.reservedDayCount}개`
            : next.isError
              ? '다음 Day를 확인하지 못했어요. 생성 시 서버가 번호를 확정합니다.'
              : '다음 Day 확인 중…'}
        </p>
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="text-sm">
            제작할 Day 수
            <input
              aria-label="제작할 Day 수"
              type="number"
              min={1}
              max={30}
              value={Number.isNaN(count) ? '' : count}
              onChange={(e) => setCount(e.target.valueAsNumber)}
              className="mt-2 w-full rounded-lg border p-2"
            />
          </label>
          {(['chloe', 'marco', 'teddy'] as const).map((key, i) => (
            <label key={key} className="text-sm">
              {['클로이', '마르코', '테디'][i]}
              <input
                aria-label={`${key} Day 수`}
                type="number"
                min={0}
                max={30}
                value={Number.isNaN(ratio[key]) ? '' : ratio[key]}
                onChange={(e) =>
                  setRatio({ ...ratio, [key]: e.target.valueAsNumber })
                }
                className="mt-2 w-full rounded-lg border p-2"
              />
            </label>
          ))}
        </div>
        <label className="block text-sm">
          제작 요청 사항
          <textarea
            aria-label="제작 요청 사항"
            maxLength={2000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="mt-2 w-full rounded-lg border p-3"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <ContentAction
          label="콘텐츠 생성 시작"
          command={{ kind: 'create', request }}
          disabled={!!error}
          onComplete={(result) => {
            if ('batch' in result) onCreated(result.batch.batchId);
          }}
        >
          <p>
            Day {count}개를 제작합니다. 클로이 {ratio.chloe}개, 마르코{' '}
            {ratio.marco}개, 테디 {ratio.teddy}개입니다.
          </p>
          <p>
            AI 호출 비용이 발생합니다. 생성된 시나리오 목록을 확인한 뒤
            질문·표현 생성을 진행합니다.
          </p>
        </ContentAction>
      </div>
    </details>
  );
}
