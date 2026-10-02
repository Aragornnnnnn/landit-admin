'use client';

// 새 개인 편지 (Figma 2593:426) — 받는 사람을 고르고 내용을 쓴 뒤, 확인창을 거쳐 바로 보낸다.
// 보낸 편지 목록·상세가 아직 없어(BE 조회 API 대기) 보낸 뒤엔 토스트를 띄우고 폼을 비운다 (docs/screens/direct-letters.md "열린 질문")
import { useState } from 'react';

import { Button } from '@/shared/ui/shadcn/button';

import {
  addRecipients,
  canSendDirectLetter,
  EMPTY_DIRECT_LETTER_DRAFT,
  removeRecipient,
  toDirectLetterRequest,
  type DirectLetterDraft,
} from '../_model/direct-letter-draft';
import { toSendFailure } from '../_model/send-failure';
import { useSendDirectLetterMutation } from '../_model/useSendDirectLetterMutation';
import { DirectLetterPreview } from './DirectLetterPreview';
import { LetterContentCard } from './LetterContentCard';
import { RecipientCard } from './RecipientCard';
import { SendLetterDialog } from './SendLetterDialog';

export function NewDirectLetterPage() {
  const send = useSendDirectLetterMutation();
  const [draft, setDraft] = useState(EMPTY_DIRECT_LETTER_DRAFT);
  const [confirming, setConfirming] = useState(false);
  // 404 — 받는 사람 중 누군가 없거나 탈퇴해 BE가 전체를 취소했다. 받는 사람을 고치면 내린다
  const [recipientsRejected, setRecipientsRejected] = useState(false);
  const count = draft.recipients.length;

  const changeRecipients = (next: DirectLetterDraft) => {
    setDraft(next);
    setRecipientsRejected(false);
  };

  const confirmSend = () =>
    send.mutate(toDirectLetterRequest(draft), {
      onSuccess: () => {
        setConfirming(false);
        setDraft(EMPTY_DIRECT_LETTER_DRAFT);
      },
      onError: (error) => {
        setConfirming(false);
        if (toSendFailure(error).kind === 'recipients')
          setRecipientsRejected(true);
      },
    });

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] text-subtle">
          편지함에만 도착해요 · 푸시는 보내지 않아요
        </span>
        <Button
          disabled={send.isPending || !canSendDirectLetter(draft)}
          onClick={() => setConfirming(true)}
          className="ml-auto h-10 px-4 text-[14px]"
        >
          {count > 0 ? `${count}명에게 보내기` : '보내기'}
        </Button>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {recipientsRejected && <RecipientsRejectedBanner />}
          <RecipientCard
            recipients={draft.recipients}
            onAdd={(more) => changeRecipients(addRecipients(draft, more))}
            onRemove={(id) => changeRecipients(removeRecipient(draft, id))}
          />
          <LetterContentCard draft={draft} onChange={setDraft} />
        </div>
        <DirectLetterPreview
          title={draft.title}
          body={draft.body}
          className="hidden w-[340px] shrink-0 xl:flex"
        />
      </div>

      <SendLetterDialog
        open={confirming}
        draft={draft}
        pending={send.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmSend}
      />
    </div>
  );
}

// 발송 실패(404) — BE는 한 명이라도 틀리면 전체를 취소한다. "아무에게도 안 갔다"를 먼저 말한다 (Figma 2594:1245)
function RecipientsRejectedBanner() {
  return (
    <div
      role="alert"
      className="flex flex-col gap-1 rounded-xl bg-destructive/10 px-4 py-3.5 text-destructive"
    >
      <p className="text-[13px] font-medium">아무에게도 보내지 않았어요</p>
      <p className="text-[12px]">
        받는 사람 중 탈퇴했거나 없는 사용자가 있어요. 받는 사람을 다시 확인하고
        보내 주세요.
      </p>
    </div>
  );
}
