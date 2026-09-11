'use client';

// 새 푸시 편집기 (Figma 2177:285) — 왼쪽에서 쓰고 오른쪽 기기 미리보기로 확인한 뒤 초안으로 저장한다.
// 저장하면 상세로 간다. 저장 뒤엔 내용·대상을 바꿀 수 없어 편집 화면이 따로 없다
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { newIdempotencyKey } from '@/features/push-campaign/api/push-campaign';
import { useCreatePushCampaignMutation } from '@/features/push-campaign/model/usePushCampaignMutation';
import { LeaveEditorDialog } from '@/shared/ui/LeaveEditorDialog';
import { Button } from '@/shared/ui/shadcn/button';
import { StatusChip } from '@/shared/ui/StatusChip';

import {
  canSaveCampaignDraft,
  draftErrors,
  EMPTY_CAMPAIGN_DRAFT,
  isEmptyCampaignDraft,
  toCampaignRequest,
  type CampaignDraft,
  type DraftErrors,
} from '../_model/campaign-draft';
import { PushPreview } from '../../_ui/PushPreview';
import { AudienceSection } from './AudienceSection';
import { ContentFields } from './ContentFields';

export function CampaignEditor({
  initial = EMPTY_CAMPAIGN_DRAFT,
}: {
  initial?: CampaignDraft;
}) {
  const router = useRouter();
  const create = useCreatePushCampaignMutation();
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [leaving, setLeaving] = useState(false);
  // 같은 클릭의 재시도는 같은 키 — 내용을 고치면 새 키(같은 키에 다른 내용이면 BE가 409를 준다)
  const [saveKey, setSaveKey] = useState<string | null>(null);

  const change = (next: CampaignDraft) => {
    setDraft(next);
    setSaveKey(null);
    if (Object.keys(errors).length > 0) setErrors(draftErrors(next));
  };

  const save = () => {
    const found = draftErrors(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const key = saveKey ?? newIdempotencyKey();
    setSaveKey(key);
    create.mutate(
      { body: toCampaignRequest(draft), key },
      { onSuccess: (created) => router.push(`/push-campaigns/${created.id}`) },
    );
  };

  const leave = () => router.push('/push-campaigns');

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            isEmptyCampaignDraft(draft) ? leave() : setLeaving(true)
          }
          className="flex items-center gap-1.5 text-[13px] text-body hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          목록
        </button>
        <StatusChip>초안</StatusChip>
        <Button
          disabled={create.isPending || !canSaveCampaignDraft(draft)}
          onClick={save}
          className="ml-auto h-10 px-4 text-[14px]"
        >
          초안 저장
        </Button>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <div className="flex flex-1 flex-col gap-4">
          <ContentFields draft={draft} errors={errors} onChange={change} />
          <AudienceSection
            audience={draft.audience}
            error={errors.audience}
            onChange={(audience) => change({ ...draft, audience })}
          />
        </div>
        <PushPreview
          title={draft.title}
          body={draft.body}
          className="hidden w-[340px] shrink-0 xl:flex"
        />
      </div>

      <LeaveEditorDialog
        open={leaving}
        pending={create.isPending}
        onCancel={() => setLeaving(false)}
        onLeave={leave}
        onSave={save}
      />
    </div>
  );
}
