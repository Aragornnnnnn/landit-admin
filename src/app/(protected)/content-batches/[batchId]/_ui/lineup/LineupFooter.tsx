'use client';

// 라인업 표 아래 2단 — 왼쪽 수정 안내 + 저장, 오른쪽 재생성 코멘트 + 코멘트로 재생성 (Figma 4129:939)
import { Button } from '@/shared/ui/shadcn/button';
import { Textarea } from '@/shared/ui/shadcn/textarea';

const COMMENT_MAX = 2000;

interface LineupFooterProps {
  dirty: boolean;
  tableError: string | null;
  /** 저장 요청이 서버에서 거절된 이유 — 다음 요청까지 남긴다 */
  serverError: string | null;
  saveDisabled: boolean;
  comment: string;
  regenerateDisabled: boolean;
  onSave: () => void;
  onChangeComment: (value: string) => void;
  onRegenerate: () => void;
}

export function LineupFooter({
  dirty,
  tableError,
  serverError,
  saveDisabled,
  comment,
  regenerateDisabled,
  onSave,
  onChangeComment,
  onRegenerate,
}: LineupFooterProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <section className="flex flex-col gap-3 rounded-[20px] bg-card px-6 py-5">
        <h3 className="text-[15px] font-bold text-strong">라인업 수정</h3>
        <p className="text-[13px] leading-[1.5] text-body">
          행을 클릭해 제목·카테고리·난이도·캐릭터·선발화·줄거리를 고쳐요. 저장은
          예약 Day 전부를 한 번에 보내요. 캐릭터별 수가 접수 비중과 다르거나
          카테고리가 없으면 저장되지 않아요. 새 카테고리는 이름으로 적어요.
        </p>
        {tableError && (
          <p role="alert" className="text-[12px] text-destructive">
            {tableError}
          </p>
        )}
        {serverError && (
          <p role="alert" className="text-[12px] text-destructive">
            {serverError}
          </p>
        )}
        <div className="mt-auto flex items-center gap-3">
          <Button
            disabled={saveDisabled}
            onClick={onSave}
            className="h-10 px-4 text-[14px]"
          >
            저장
          </Button>
          <span className="text-[12px] text-subtle">
            {dirty ? '저장하지 않은 수정이 있어요' : '바뀐 행이 없어요'}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-[20px] bg-card px-6 py-5">
        <label
          htmlFor="lineup-comment"
          className="text-[15px] font-bold text-strong"
        >
          라인업 재생성 코멘트 (누적되어 다음 프롬프트에 들어가요)
        </label>
        <Textarea
          id="lineup-comment"
          value={comment}
          maxLength={COMMENT_MAX}
          rows={3}
          placeholder="예: 상상 계열은 억지로 기존 카테고리에 넣지 말고 신규 카테고리를 1개까지 제안. 유저 선발화 3개 유지."
          onChange={(event) => onChangeComment(event.target.value)}
          className="min-h-0 rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] shadow-none"
        />
        <div className="mt-auto flex items-center justify-end gap-3">
          <span className="text-[12px] text-subtle">
            재생성 중 실패하면 이 라인업이 그대로 남고 사유가 보여요
          </span>
          <Button
            variant="outline"
            disabled={regenerateDisabled}
            onClick={onRegenerate}
            className="h-10 px-4 text-[14px]"
          >
            코멘트로 재생성
          </Button>
        </div>
      </section>
    </div>
  );
}
