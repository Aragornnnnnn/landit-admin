'use client';

// 편지 쓰기·고치기 (Figma 1050:10361 · 11122) — 왼쪽에서 쓰고 오른쪽에서 사용자 화면으로 확인한다.
// 저장은 내용만 바꾸고, 상태(발행·숨김)는 상단 오른쪽 버튼이 따로 바꾼다
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/button';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { StatusChip } from '@/shared/ui/StatusChip';

import { statusAfter } from '../_model/letter-actions';
import {
  canPublishDraft,
  EMPTY_LETTER_DRAFT,
  isSameDraft,
  toLetterDraft,
  type LetterDraft,
} from '../_model/letter-draft';
import {
  editorButtons,
  editorNotice,
  type EditorStatus,
} from '../_model/letter-editor-buttons';
import { LETTER_STATUS_DOT, LETTER_STATUS_LABEL } from '../_model/letter-label';
import { useLetterActions } from '../_model/useLetterActions';
import type { LetterItem } from '../_model/useLetterGroupQuery';
import { useLetterQuery } from '../_model/useLetterQuery';
import { useSaveLetterMutation } from '../_model/useSaveLetterMutation';
import { LeaveEditorDialog } from './LeaveEditorDialog';
import { LetterActionDialog } from './LetterActionDialog';
import { LetterBasicFields } from './LetterBasicFields';
import { LetterBodyCard } from './LetterBodyCard';
import { LetterPreview } from './LetterPreview';
import { LetterTemplateRow } from './LetterTemplateRow';

/** 편집이면 편지 번호, 새 편지면 없음 */
export function LetterEditor({ letterId }: { letterId?: number }) {
  const letter = useLetterQuery(letterId);

  if (letterId === undefined) return <Editor letterId={undefined} />;
  if (letter.isPending) return <ListSkeleton rows={4} className="pt-6" />;
  if (letter.isError)
    return (
      <InlineError
        message="편지를 불러오지 못했어요"
        onRetry={() => letter.refetch()}
      />
    );
  if (!letter.data)
    return (
      <InlineError message="편지를 찾을 수 없어요. 목록에서 다시 열어 주세요" />
    );

  // 서버 값이 도착한 뒤에 마운트한다 — 초안의 초기값이 곧 서버 값이 되게
  return <Editor key={letterId} letterId={letterId} letter={letter.data} />;
}

function Editor({
  letterId,
  letter,
}: {
  letterId: number | undefined;
  letter?: LetterItem;
}) {
  const router = useRouter();
  const save = useSaveLetterMutation();

  const initial = letter ? toLetterDraft(letter) : EMPTY_LETTER_DRAFT;
  const [draft, setDraft] = useState<LetterDraft>(initial);
  const [saved, setSaved] = useState<LetterDraft>(initial);
  const [savedAt, setSavedAt] = useState<string>();
  const [leaving, setLeaving] = useState(false);
  // 새 편지는 첫 저장으로 번호를 받는다 — 그 뒤 저장은 PATCH다
  const [id, setId] = useState(letterId);

  // 상태는 여기서 들고 있는다 — 발행하면 버튼 조합이 [저장 · 숨기기]로 바로 바뀌어야 한다
  const [status, setStatus] = useState<EditorStatus>(
    letter?.publicationStatus ?? 'NEW',
  );
  const actions = useLetterActions((action) =>
    setStatus((current) =>
      statusAfter(action, current === 'NEW' ? 'DRAFT' : current),
    ),
  );
  const buttons = editorButtons(status);
  const dirty = !isSameDraft(draft, saved);

  const runSave = (onDone?: (letterId: number) => void) =>
    save.mutate(
      { letterId: id, draft },
      {
        onSuccess: (result) => {
          setId(result?.letterId ?? id);
          if (status === 'NEW') setStatus('DRAFT');
          setSaved(draft);
          setSavedAt(nowLabel());
          toast.success('저장했어요');
          if (result?.letterId) onDone?.(result.letterId);
        },
      },
    );

  const leave = () => router.push('/letters');

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => (dirty ? setLeaving(true) : leave())}
          className="flex items-center gap-1.5 text-[13px] text-body hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          목록
        </button>
        {letter?.publicationStatus && (
          <StatusChip dot={LETTER_STATUS_DOT[letter.publicationStatus]}>
            {LETTER_STATUS_LABEL[letter.publicationStatus]}
          </StatusChip>
        )}
        <span className="text-[13px] text-subtle">
          {editorNotice(status, publishedLabel(letter), savedAt)}
        </span>

        <span className="ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            disabled={!dirty || save.isPending}
            onClick={() => runSave()}
            className="h-10 px-4 text-[14px]"
          >
            {buttons.save}
          </Button>
          <Button
            variant={buttons.state.destructive ? 'destructive' : 'default'}
            // 아직 저장 안 된 새 편지는 발행할 수 없다. 내용이 비어도 마찬가지다
            disabled={
              !id ||
              !canPublishDraft(draft) ||
              save.isPending ||
              actions.pending
            }
            onClick={() => id && actions.request(id, buttons.state.action)}
            className="h-10 px-4 text-[14px]"
          >
            {buttons.state.label}
          </Button>
        </span>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <div className="flex flex-1 flex-col gap-4">
          <LetterTemplateRow draft={draft} onChange={setDraft} />
          <LetterBasicFields draft={draft} onChange={setDraft} />
          <LetterBodyCard
            body={draft.body}
            onChange={(body) => setDraft({ ...draft, body })}
          />
        </div>
        <div className="hidden xl:block">
          <LetterPreview draft={draft} date={todayLabel()} />
        </div>
      </div>

      <LetterActionDialog
        action={actions.asked}
        pending={actions.pending}
        onCancel={actions.cancel}
        onConfirm={actions.confirm}
      />
      <LeaveEditorDialog
        open={leaving}
        pending={save.isPending}
        onCancel={() => setLeaving(false)}
        onLeave={leave}
        onSave={() => runSave(() => leave())}
      />

      {/* 새 편지는 저장해야 발행할 수 있다 — 버튼만 흐리게 두면 이유를 모른다 */}
      {!id && (
        <p className="text-[13px] text-subtle">
          먼저 임시저장하면 발행할 수 있어요.
        </p>
      )}
    </div>
  );
}

const two = (value: number) => String(value).padStart(2, '0');
const nowLabel = () => {
  const now = new Date();
  return `${two(now.getHours())}:${two(now.getMinutes())}`;
};
const todayLabel = () => {
  const now = new Date();
  return `${now.getMonth() + 1}월 ${now.getDate()}일`;
};
const publishedLabel = (letter: LetterItem | undefined) => {
  if (!letter?.publishedAt) return undefined;
  const at = new Date(letter.publishedAt);
  return `${at.getMonth() + 1}.${two(at.getDate())} ${two(at.getHours())}:${two(at.getMinutes())}`;
};
