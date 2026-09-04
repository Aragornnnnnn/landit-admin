'use client';

// 답장 본문 에디터 — 깃허브 코멘트처럼 쓰기/미리보기를 오가고, 이미지를 붙여넣거나 떨어뜨리면 올려서 커서 자리에 마크다운을 끼운다.
// 본문 값은 부모(useReplyDraft)가 들고, 여기는 textarea와 업로드 흐름만 맡는다
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { uploadContentImage } from '@/features/content-image/api/upload-content-image';
import { cn } from '@/shared/lib/cn';
import { reportError } from '@/shared/monitoring/report';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';

import {
  imageMarkdown,
  insertPlaceholders,
  pickImageFiles,
  replacePlaceholder,
  shiftSlots,
} from '../_model/markdown-image-paste';
import { ReplyMarkdownPreview } from './ReplyMarkdownPreview';

interface ReplyBodyEditorProps {
  value: string;
  onChange: (text: string) => void;
  maxLength: number;
  /** 시트는 흰 배경 위라 입력이 회색, 전체화면은 회색 배경 위라 입력이 흰색 (ReplyFields와 같은 규칙) */
  variant: 'sheet' | 'screen';
}

type Mode = 'write' | 'preview';

export function ReplyBodyEditor({
  value,
  onChange,
  maxLength,
  variant,
}: ReplyBodyEditorProps) {
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
    const { accepted, oversized } = pickImageFiles(files);
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
    variant === 'sheet'
      ? 'min-h-[220px] flex-1 bg-muted'
      : 'min-h-[180px] bg-card',
  );

  return (
    <div className={cn('flex flex-col gap-2', variant === 'sheet' && 'flex-1')}>
      {/* 라벨은 왼쪽, 전환은 오른쪽 — 위 "템플릿 · 관리" 줄과 같은 리듬. 세그먼트 토글이라 템플릿 칩(고르는 것)과 헷갈리지 않는다 */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-subtle">본문</span>
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
          placeholder="본문"
          aria-label="답장 본문"
          className={cn(
            'resize-none border-transparent shadow-none placeholder:text-subtle',
            boxClassName,
          )}
        />
      ) : (
        <ReplyMarkdownPreview
          text={value}
          className={cn('overflow-y-auto', boxClassName)}
        />
      )}

      <p className="text-[12px] text-subtle">
        마크다운 지원. 줄바꿈은 엔터, 링크는 [글자](주소), 이미지는 붙여넣기.
      </p>
    </div>
  );
}
