// 선택한 시나리오의 설명과 API가 제공한 시작 화면 정보를 표시한다.
import { useEffect, useRef } from 'react';
import Image from 'next/image';

import { DIFFICULTIES, type ScenarioRow } from '../_model/scenario-catalog';

export function ScenarioDetail({
  row,
  onClose,
}: {
  row: ScenarioRow;
  onClose: () => void;
}) {
  const opening = row.openingPreview;
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [row.scenarioId]);
  const fields = [
    ['카테고리', row.categoryName],
    ['난이도', DIFFICULTIES[row.difficulty ?? ''] ?? row.difficulty],
    [
      '첫 발화자',
      row.firstSpeaker === 'AI'
        ? 'AI'
        : row.firstSpeaker === 'USER'
          ? '사용자'
          : row.firstSpeaker,
    ],
    ['캐릭터 ID', opening?.character?.characterId],
    ['상황 설명', row.briefing],
    ['대화 목표', row.conversationGoal],
    ['AI 시작 대사', opening?.aiOpeningMessage],
    ['시작 대사 번역', opening?.aiOpeningMessageTranslation],
    ['사용자 시작 안내', opening?.userOpeningInstruction],
    ['답변 가이드', opening?.answerGuide?.content],
    ['답변 가이드 번역', opening?.answerGuide?.translatedContent],
    ['속마음', opening?.innerThought],
    ['속마음 유형', opening?.innerThoughtType],
  ];
  return (
    <section
      aria-label="시나리오 상세"
      className="min-w-0 space-y-4 rounded-xl bg-card p-5"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-subtle">
            Day {row.displayOrder ?? '—'} · ID {row.scenarioId}
          </p>
          <h2
            ref={heading}
            tabIndex={-1}
            className="mt-1 text-xl font-bold break-words"
          >
            {row.scenarioTitle ?? '제목 미등록'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-sm underline"
        >
          닫기
        </button>
      </header>
      {row.thumbnailUrl && (
        <Image
          src={row.thumbnailUrl}
          alt="시나리오 썸네일"
          width={480}
          height={270}
          unoptimized
          className="max-h-48 w-full rounded-lg object-contain"
        />
      )}
      <p className="text-xs leading-relaxed text-subtle">
        시작 대사는 관리자 프로필의 언어·학습 수준 기준이에요. 전체 질문·학습
        표현은 이 조회 API에서 제공하지 않아요.
      </p>
      <dl className="space-y-4">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-medium text-subtle">{label}</dt>
            <dd className="mt-1 text-sm leading-relaxed break-words whitespace-pre-wrap">
              {value || '미등록'}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
