'use client';

// 사용자 편지함 미리보기 — 쓰는 대로 사용자가 볼 화면을 그린다 (Figma 1050:10361 우측).
// 발행하면 되돌릴 수 없으니, 보내기 전에 사용자 눈으로 한 번 보는 자리다
import { StatusChip } from '@/shared/ui/StatusChip';

import type { LetterDraft } from '../_model/letter-draft';
import { LETTER_TYPE_LABEL } from '../_model/letter-label';

export function LetterPreview({
  draft,
  date,
}: {
  draft: LetterDraft;
  /** 사용자 화면에 찍힐 날짜 — "8월 18일" */
  date: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-center text-[13px] text-subtle">
        사용자 편지함 미리보기
      </p>
      <div className="flex h-[560px] w-[300px] flex-col gap-3 overflow-y-auto rounded-[28px] bg-card p-5">
        <span className="text-[13px] text-subtle">‹ 편지함</span>
        <span className="flex items-center gap-2">
          <StatusChip>{LETTER_TYPE_LABEL[draft.type]}</StatusChip>
          <span className="text-[12px] text-subtle">{date}</span>
        </span>
        <h3 className="text-[17px] leading-snug font-bold text-foreground">
          {draft.title}
        </h3>

        {draft.contentBlocks.map((block, index) => {
          if (block.type === 'PARAGRAPH')
            return (
              <p
                key={index}
                className="text-[14px] leading-relaxed whitespace-pre-wrap text-body"
              >
                {block.text}
              </p>
            );
          if (block.type === 'ORDERED_LIST')
            return (
              <ol key={index} className="flex flex-col gap-1">
                {block.items
                  .filter((item) => item.trim())
                  .map((item, at) => (
                    <li key={at} className="text-[14px] text-body">
                      {at + 1}. {item}
                    </li>
                  ))}
              </ol>
            );
          return (
            <figure key={index} className="flex flex-col gap-1">
              {/* 외부 이미지라 next/image 최적화를 쓰지 않는다 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.url}
                alt=""
                className="w-full rounded-xl bg-muted object-cover"
              />
              {block.caption && (
                <figcaption className="text-[12px] text-subtle">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </div>
  );
}
