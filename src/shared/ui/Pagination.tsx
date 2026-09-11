'use client';

// 목록 페이지 이동 — 좌측 "1–20 / 128", 우측 페이지 번호 + ‹ › (Figma 피드백 1050:8193). 피드백·사용자 목록이 같이 쓴다
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

interface PaginationProps {
  /** 0부터 */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  /** 왼쪽 요약 문구 — 없으면 "{from}–{to} / {total}" */
  summary?: string;
  onChangePage: (page: number) => void;
}

// 현재 페이지 주변으로 이만큼만 보여주고 나머지는 …로 접는다 (Figma: 7페이지에서 "1 2 3 … 7")
const WINDOW = 3;

export function Pagination({
  page,
  size,
  totalElements,
  totalPages,
  summary,
  onChangePage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const first = page * size + 1;
  const last = Math.min((page + 1) * size, totalElements);
  const pages = visiblePages(page, totalPages);

  return (
    <div className="flex w-full items-center gap-1.5">
      <span className="text-xs text-subtle">
        {summary ?? `${first}–${last} / ${totalElements}`}
      </span>
      <div className="ml-auto flex items-center gap-1.5">
        {pages.map((target, index) =>
          target === null ? (
            <span key={`gap-${index}`} className="px-1 text-xs text-subtle">
              …
            </span>
          ) : (
            <PageButton
              key={target}
              active={target === page}
              onClick={() => onChangePage(target)}
              label={`${target + 1}페이지`}
            >
              {target + 1}
            </PageButton>
          ),
        )}
        {/* Figma는 화살표를 숫자 뒤에 둔다 — 번호로 먼저 뛰고, 한 칸 이동은 그다음 */}
        <PageButton
          disabled={page === 0}
          onClick={() => onChangePage(page - 1)}
          label="이전 페이지"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </PageButton>
        <PageButton
          disabled={page >= totalPages - 1}
          onClick={() => onChangePage(page + 1)}
          label="다음 페이지"
        >
          <ChevronRight className="size-4" aria-hidden />
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({
  children,
  active,
  disabled,
  label,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex size-[30px] items-center justify-center rounded-lg border text-xs font-medium transition-colors',
        active
          ? 'border-transparent bg-strong text-white'
          : 'border-field-border bg-card text-strong hover:bg-muted',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      {children}
    </button>
  );
}

/** 현재 페이지 주변만 보여주고 첫·끝 페이지는 항상 남긴다. null은 … 자리 */
export function visiblePages(
  page: number,
  totalPages: number,
): (number | null)[] {
  if (totalPages <= WINDOW + 1) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }
  const start = Math.max(0, Math.min(page - 1, totalPages - WINDOW));
  const window = Array.from({ length: WINDOW }, (_, index) => start + index);
  const head = start > 0 ? [0, null] : [];
  const tail = window.at(-1)! < totalPages - 1 ? [null, totalPages - 1] : [];
  return [...head, ...window, ...tail];
}
