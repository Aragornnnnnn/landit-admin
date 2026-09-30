'use client';

// 피드백 원문에 붙은 사용자 첨부 사진 — 썸네일 줄, 누르면 다이얼로그로 크게 보고 ‹ ›·← →로 넘긴다 (프레임에 없음).
// 이미지는 같은 오리진 프록시 경로라 세션 쿠키가 자동으로 붙는다 — blob으로 바꾸지 않고 img에 바로 건다
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import type { MailboxFeedbackAttachment } from '@/shared/api/schema-patch';
import { cn } from '@/shared/lib/cn';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/shadcn/dialog';

import {
  toAttachmentImages,
  type AttachmentImage,
} from '../../_model/reply/feedback-attachments';

interface FeedbackAttachmentsProps {
  attachments: MailboxFeedbackAttachment[] | undefined;
}

export function FeedbackAttachments({ attachments }: FeedbackAttachmentsProps) {
  const images = toAttachmentImages(attachments);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const opened = openIndex === null ? undefined : images[openIndex];
  // 끝에서 처음으로 돌지 않는다 — 최대 3장이라 지금 몇 번째인지가 더 중요하다
  const hasPrev = openIndex !== null && openIndex > 0;
  const hasNext = openIndex !== null && openIndex < images.length - 1;
  const showPrev = () => hasPrev && setOpenIndex(openIndex - 1);
  const showNext = () => hasNext && setOpenIndex(openIndex + 1);

  return (
    <>
      <ul className="flex flex-wrap gap-2" aria-label="첨부 이미지">
        {images.map((image, index) => (
          <li key={image.id}>
            <Thumbnail
              image={image}
              label={`첨부 이미지 ${index + 1}`}
              onOpen={() => setOpenIndex(index)}
            />
          </li>
        ))}
      </ul>

      <Dialog
        open={opened !== undefined}
        onOpenChange={(next) => !next && setOpenIndex(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] gap-4 rounded-[20px] p-6 sm:max-w-[min(90vw,960px)]"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') showPrev();
            if (event.key === 'ArrowRight') showNext();
          }}
        >
          <header className="flex items-center gap-3">
            <DialogTitle className="flex-1 text-[17px] font-bold text-foreground">
              {openIndex === null
                ? ''
                : `첨부 이미지 ${openIndex + 1} / ${images.length}`}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="닫기"
              className="rounded-md p-1 text-subtle hover:text-foreground"
            >
              <X className="size-5" aria-hidden />
            </button>
          </header>

          {opened && (
            <div className="relative">
              {/* 이미지가 바뀌면 새로 마운트한다 — 앞 이미지의 실패 상태가 넘어오지 않게 */}
              <AttachmentImg
                key={opened.id}
                image={opened}
                alt={`첨부 이미지 ${(openIndex ?? 0) + 1}`}
                className="mx-auto max-h-[75vh] w-auto max-w-full rounded-xl object-contain"
                fallbackClassName="h-40 w-full rounded-xl"
              />
              {hasPrev && (
                <StepButton
                  side="left"
                  label="이전 이미지"
                  onClick={showPrev}
                />
              )}
              {hasNext && (
                <StepButton
                  side="right"
                  label="다음 이미지"
                  onClick={showNext}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function StepButton({
  side,
  label,
  onClick,
}: {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-card text-strong hover:bg-muted',
        side === 'left' ? 'left-2' : 'right-2',
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}

const THUMBNAIL_CLASS = 'size-20 rounded-[10px]';

// 못 불러온 썸네일은 누를 것이 없다 — 버튼 대신 자리 표시만 둔다
function Thumbnail({
  image,
  label,
  onOpen,
}: {
  image: AttachmentImage;
  label: string;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return <LoadFailed className={THUMBNAIL_CLASS} />;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${label} 크게 보기`}
      className={cn(
        THUMBNAIL_CLASS,
        'overflow-hidden border border-hairline bg-card hover:opacity-90',
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- 세션 쿠키로 받는 비공개 이미지라 next/image 최적화(서버 재요청)를 쓸 수 없다 */}
      <img
        src={image.src}
        alt={label}
        onError={() => setFailed(true)}
        className="size-full object-cover"
      />
    </button>
  );
}

function AttachmentImg({
  image,
  alt,
  className,
  fallbackClassName,
}: {
  image: AttachmentImage;
  alt: string;
  className: string;
  fallbackClassName: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return <LoadFailed className={fallbackClassName} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- 위 썸네일과 같은 이유
    <img
      src={image.src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function LoadFailed({ className }: { className: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-muted p-2 text-center text-[11px] leading-snug break-keep text-subtle',
        className,
      )}
    >
      이미지를 불러오지 못했어요
    </div>
  );
}
