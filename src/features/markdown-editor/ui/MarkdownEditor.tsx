'use client';

// 마크다운 본문 에디터 — 깃허브 코멘트처럼 쓰기/미리보기를 오가고, 이미지를 붙여넣거나 떨어뜨리면 올려서 커서 자리에 마크다운을 끼운다.
// 본문 값은 부모(답장 초안·편지 초안)가 들고, 여기는 textarea와 업로드 흐름만 맡는다
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { uploadContentImage } from '@/features/content-image/api/upload-content-image';
import { cn } from '@/shared/lib/cn';
import { reportError } from '@/shared/monitoring/report';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/shadcn/tabs';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import {
  imageMarkdown,
  insertPlaceholders,
  pickImageFiles,
  replacePlaceholder,
  shiftSlots,
} from '../model/markdown-image-paste';
import { MarkdownHelpPopover } from './MarkdownHelpPopover';
import { MarkdownPreview } from './MarkdownPreview';

interface MarkdownEditorProps {
  value: string;
  onChange: (text: string) => void;
  maxLength?: number;
  /** 무엇 위에 놓이나 — 흰 카드 위면 입력이 회색, 회색 페이지 위면 입력이 흰색 */
  background: 'card' | 'page';
  /** 스크린리더용 이름 — "답장 본문", "편지 본문" */
  label: string;
  placeholder?: string;
}

type Mode = 'write' | 'preview';

export function MarkdownEditor({
  value,
  onChange,
  maxLength,
  background,
  label,
  placeholder = '본문',
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<Mode>('write');
  const textarea = useRef<HTMLTextAreaElement>(null);
  // 업로드가 끝나는 시점의 최신 본문 — state 스냅샷을 보면 그 사이 타이핑한 글자가 사라진다
  const latest = useRef(value);
  const pendingCursor = useRef<number | null>(null);

  useEffect(() => {
    latest.current = value;
  }, [value]);

  // 자리표시를 끼운 뒤 커서를 그 뒤로 — 제어 컴포넌트라 값이 반영된 다음에야 옮길 수 있다
  useEffect(() => {
    if (pendingCursor.current === null || !textarea.current) return;
    textarea.current.setSelectionRange(
      pendingCursor.current,
      pendingCursor.current,
    );
    pendingCursor.current = null;
  }, [value]);

  const commit = (text: string) => {
    latest.current = text;
    onChange(text);
  };

  /** 이미지를 한 장씩 차례로 올린다 — 동시에 올리면 자리표시 위치 보정이 서로 꼬인다 */
  const insertImages = async (files: Iterable<File>) => {
    const { accepted, unsupported, oversized } = pickImageFiles(files);
    if (unsupported.length > 0)
      toast.error('PNG · JPG · WEBP · GIF만 올릴 수 있어요');
    if (oversized.length > 0) toast.error('10MB 이하 이미지만 올릴 수 있어요');
    if (accepted.length === 0) return;

    const cursor = textarea.current?.selectionStart ?? latest.current.length;
    const inserted = insertPlaceholders(
      latest.current,
      cursor,
      accepted.length,
    );
    pendingCursor.current = inserted.cursor;
    commit(inserted.text);

    let slots = inserted.slots;
    for (const [index, file] of accepted.entries()) {
      let replacement = '';
      try {
        replacement = imageMarkdown(file.name, await uploadContentImage(file));
      } catch (cause) {
        reportError(cause);
        toast.error(`${file.name}을(를) 올리지 못했어요`);
      }
      const replaced = replacePlaceholder(
        latest.current,
        slots[index],
        replacement,
      );
      if (!replaced) continue;
      commit(replaced.text);
      slots = shiftSlots(slots, replaced.at, replaced.delta);
    }
  };

  const boxClassName = cn(
    'rounded-xl px-4 py-3 text-[14px]',
    background === 'card'
      ? 'min-h-[220px] flex-1 bg-muted'
      : 'min-h-[180px] bg-card',
  );

  return (
    <div
      className={cn('flex flex-col gap-2', background === 'card' && 'flex-1')}
    >
      {/* 라벨은 왼쪽, 전환은 오른쪽 — 위 "템플릿 · 관리" 줄과 같은 리듬. 세그먼트 토글이라 템플릿 칩(고르는 것)과 헷갈리지 않는다 */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[12px] text-subtle">
          본문
          <MarkdownHelpPopover />
        </span>
        <Tabs value={mode} onValueChange={(next) => setMode(next as Mode)}>
          <TabsList className="h-7 bg-chip">
            <TabsTrigger value="write" className="px-3 text-[12px]">
              쓰기
            </TabsTrigger>
            <TabsTrigger value="preview" className="px-3 text-[12px]">
              미리보기
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {mode === 'write' ? (
        <Textarea
          ref={textarea}
          value={value}
          maxLength={maxLength}
          onChange={(event) => commit(event.target.value)}
          onPaste={(event) => {
            if (event.clipboardData.files.length === 0) return;
            event.preventDefault();
            void insertImages(event.clipboardData.files);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            if (event.dataTransfer.files.length === 0) return;
            event.preventDefault();
            void insertImages(event.dataTransfer.files);
          }}
          placeholder={placeholder}
          aria-label={label}
          className={cn(
            'resize-none border-transparent shadow-none placeholder:text-subtle',
            boxClassName,
          )}
        />
      ) : (
        <MarkdownPreview
          text={value}
          className={cn('overflow-y-auto', boxClassName)}
        />
      )}
    </div>
  );
}
