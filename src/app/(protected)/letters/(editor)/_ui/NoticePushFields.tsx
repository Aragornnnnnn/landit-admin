// 공지 발행 전 푸시 옵션과 발행 후 발송 버튼을 표시한다.
import { AudienceSection } from '@/features/push-campaign/ui/AudienceSection';
import { SubscriptionAudienceFields } from '@/features/subscription/ui/SubscriptionAudienceFields';
import { Button } from '@/shared/ui/shadcn/button';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';

import {
  canRequestNoticePush,
  type NoticePushSelection,
} from '../../_model/notice-push-audience';

export function NoticePushFields({
  disabled,
  published,
  requested,
  retryable = false,
  sendOnPublish,
  selection,
  onSelectionChange,
  onSendOnPublishChange,
  onRequest,
}: {
  disabled: boolean;
  published: boolean;
  requested: boolean;
  retryable?: boolean;
  sendOnPublish: boolean;
  selection: NoticePushSelection;
  onSelectionChange: (selection: NoticePushSelection) => void;
  onSendOnPublishChange: (checked: boolean) => void;
  onRequest: () => void;
}) {
  const valid = canRequestNoticePush(selection);
  return (
    <section
      aria-label="공지 푸시 알림"
      className="flex flex-col gap-3 rounded-[20px] bg-card p-6"
    >
      <h2 className="text-[15px] font-semibold text-strong">푸시 알림</h2>
      <p className="text-sm text-subtle">
        선택한 대상 중 공지를 볼 수 있는 사용자에게 편지함 링크를 보내요.
      </p>
      {published ? (
        <Button
          variant="secondary"
          className="self-start"
          disabled={(!valid && !retryable) || disabled || requested}
          onClick={onRequest}
        >
          {requested
            ? '푸시 발송 요청됨'
            : retryable
              ? '이전 대상에 다시 요청'
              : '푸시 보내기'}
        </Button>
      ) : (
        <label className="flex items-center gap-2 text-sm text-strong">
          <Checkbox
            checked={sendOnPublish}
            disabled={disabled}
            onCheckedChange={(checked) =>
              onSendOnPublishChange(checked === true)
            }
          />
          발행할 때 푸시 보내기
        </label>
      )}
      {(published || sendOnPublish) && !requested && !retryable && (
        <fieldset disabled={disabled} className="min-w-0">
          <AudienceSection
            audience={selection.audience}
            onChange={(audience) =>
              onSelectionChange({ ...selection, audience })
            }
            estimateAtSend
            error={
              valid
                ? undefined
                : '사용자, SQL 또는 구독 유형을 하나 이상 선택해 주세요.'
            }
            selectedContent={
              <SubscriptionAudienceFields
                legend="푸시를 받을 구독 유형"
                selected={selection.groups}
                onChange={(groups) =>
                  onSelectionChange({ ...selection, groups })
                }
              />
            }
          />
        </fieldset>
      )}
    </section>
  );
}
