'use client';

// 본문 블록 카드 — 블록마다 회색 카드 하나, 헤더에 타입과 ↑ ↓ 삭제 (Figma 1050:10361).
// 번호 목록은 한 줄이 한 항목이다 — 사용자 화면에 번호가 붙어 나가므로 여기선 줄만 나눈다
import { Textarea } from '@/shared/ui/textarea';

import {
  emptyBlock,
  moveBlock,
  removeBlock,
  type LetterBlock,
  type LetterBlockType,
} from '../_model/letter-draft';
import { LetterImageBlock } from './LetterImageBlock';

interface LetterBlocksEditorProps {
  blocks: LetterBlock[];
  onChange: (blocks: LetterBlock[]) => void;
}

const ADD_BUTTONS: { type: LetterBlockType; label: string }[] = [
  { type: 'PARAGRAPH', label: '+ 문단' },
  { type: 'IMAGE', label: '+ 이미지' },
  { type: 'ORDERED_LIST', label: '+ 번호 목록' },
];

const FIELD =
  'min-h-[80px] resize-none rounded-lg border-transparent bg-card px-3 py-2.5 text-[14px] shadow-none';

export function LetterBlocksEditor({
  blocks,
  onChange,
}: LetterBlocksEditorProps) {
  const replace = (index: number, block: LetterBlock) =>
    onChange(blocks.map((old, at) => (at === index ? block : old)));

  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-card p-6">
      <header className="flex items-baseline justify-between">
        <h2 className="text-[16px] font-bold text-strong">본문 블록</h2>
        <span className="text-[12px] text-subtle">
          contentBlocks 그대로 저장돼요
        </span>
      </header>

      {blocks.map((block, index) => (
        <article
          key={index}
          className="flex flex-col gap-2 rounded-[14px] bg-muted p-4"
        >
          <header className="flex items-center gap-3">
            <span className="text-[12px] font-bold tracking-wide text-subtle">
              {block.type}
            </span>
            <span className="ml-auto flex items-center gap-2 text-[13px] text-subtle">
              <button
                type="button"
                aria-label="위로"
                disabled={index === 0}
                onClick={() => onChange(moveBlock(blocks, index, -1))}
                className="disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="아래로"
                disabled={index === blocks.length - 1}
                onClick={() => onChange(moveBlock(blocks, index, 1))}
                className="disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(removeBlock(blocks, index))}
                className="hover:text-destructive"
              >
                삭제
              </button>
            </span>
          </header>

          {block.type === 'PARAGRAPH' && (
            <Textarea
              value={block.text}
              aria-label="문단"
              onChange={(event) =>
                replace(index, { ...block, text: event.target.value })
              }
              className={FIELD}
            />
          )}

          {block.type === 'ORDERED_LIST' && (
            <Textarea
              value={block.items.join('\n')}
              aria-label="번호 목록 (한 줄에 한 항목)"
              onChange={(event) =>
                replace(index, {
                  ...block,
                  items: event.target.value.split('\n'),
                })
              }
              className={FIELD}
            />
          )}

          {block.type === 'IMAGE' && (
            <LetterImageBlock
              block={block}
              onChange={(next) => replace(index, next)}
            />
          )}
        </article>
      ))}

      <div className="flex flex-wrap gap-2">
        {ADD_BUTTONS.map((button) => (
          <button
            key={button.type}
            type="button"
            onClick={() => onChange([...blocks, emptyBlock(button.type)])}
            className="rounded-lg bg-muted px-3.5 py-2 text-[13px] font-medium text-body hover:bg-secondary disabled:opacity-40"
          >
            {button.label}
          </button>
        ))}
      </div>
    </section>
  );
}
