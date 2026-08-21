'use client';

// 본문 이미지 블록 — 파일을 고르면 바로 올리고, 실패해도 블록은 남긴다(다시 시도) (docs/screens/letters.md "에디터 인터랙션")
import { useRef, useState } from 'react';

import { reportError } from '@/shared/monitoring/report';

import { checkImageFile, uploadContentImage } from '../_model/content-image';
import type { LetterBlock } from '../_model/letter-draft';

type ImageBlock = Extract<LetterBlock, { type: 'IMAGE' }>;

interface LetterImageBlockProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
}

export function LetterImageBlock({ block, onChange }: LetterImageBlockProps) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const [fileLabel, setFileLabel] = useState<string>();

  const pick = async (file: File | undefined) => {
    if (!file) return;
    const invalid = checkImageFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(undefined);
    setFileLabel(`${file.name} · ${Math.round(file.size / 1024)}KB`);
    setUploading(true);
    try {
      onChange({ ...block, url: await uploadContentImage(file) });
    } catch (cause) {
      reportError(cause);
      setError(cause instanceof Error ? cause.message : '업로드에 실패했어요');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={uploading}
          className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-card text-[12px] text-subtle"
        >
          {block.url ? (
            // 스토리지에서 내려오는 외부 이미지라 next/image 최적화를 쓰지 않는다
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{uploading ? '올리는 중' : '이미지 고르기'}</span>
          )}
        </button>

        <div className="flex flex-1 flex-col gap-1.5">
          <span className="text-[13px] text-body">
            {fileLabel ?? (block.url ? '올린 이미지' : '파일을 골라 주세요')}
          </span>
          <input
            value={block.caption ?? ''}
            placeholder="캡션"
            aria-label="이미지 캡션"
            onChange={(event) =>
              onChange({ ...block, caption: event.target.value })
            }
            className="rounded-lg bg-card px-3 py-2 text-[13px] text-body outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-2 text-[12px] text-destructive">
          {error}
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="underline"
          >
            다시 시도
          </button>
        </p>
      )}

      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        onChange={(event) => {
          void pick(event.target.files?.[0]);
          // 같은 파일을 다시 골라도 change가 나게 비운다
          event.target.value = '';
        }}
      />
    </div>
  );
}
