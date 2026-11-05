// 공지 발행 전 푸시 옵션과 발행 후 발송 버튼을 표시한다.
import { Button } from '@/shared/ui/shadcn/button';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';

export function NoticePushFields({
  blocked,
  disabled,
  published,
  requested,
  sendOnPublish,
  onSendOnPublishChange,
  onRequest,
}: {
  blocked: boolean;
  disabled: boolean;
  published: boolean;
  requested: boolean;
  sendOnPublish: boolean;
  onSendOnPublishChange: (checked: boolean) => void;
  onRequest: () => void;
}) {
  return (
    <section
      aria-label="공지 푸시 알림"
      className="flex flex-col gap-3 rounded-[20px] bg-card p-6"
    >
      <h2 className="text-[15px] font-semibold text-strong">푸시 알림</h2>
      <p className="text-sm text-subtle">
        {blocked
          ? '구독 유형을 숨긴 공지에는 푸시를 보낼 수 없어요.'
          : '공지를 볼 수 있는 사용자에게 공지 제목과 편지함 링크를 보내요.'}
      </p>
      {published ? (
        <Button
          variant="secondary"
          className="self-start"
          disabled={blocked || disabled || requested}
          onClick={onRequest}
        >
          {requested ? '푸시 발송 요청됨' : '푸시 보내기'}
        </Button>
      ) : (
        <label className="flex items-center gap-2 text-sm text-strong">
          <Checkbox
            checked={!blocked && sendOnPublish}
            disabled={blocked || disabled}
            onCheckedChange={(checked) =>
              onSendOnPublishChange(checked === true)
            }
          />
          발행할 때 푸시 보내기
        </label>
      )}
    </section>
  );
}
