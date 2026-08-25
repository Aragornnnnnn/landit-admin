// 조회 실패를 그 자리에서 알리고 다시 시도하게 한다 — 화면을 통째로 날리지 않는다 (docs/admin-spec.md "공통 상태").
// 저장·발송 실패는 이게 아니라 토스트를 쓴다(입력을 유지해야 하므로)
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

interface InlineErrorProps {
  /** 사용자에게 보일 문구 — 서버가 준 메시지가 있으면 그대로, 없으면 화면이 기본 문구를 정한다 */
  message?: string;
  /** 다시 시도. 없으면 버튼을 그리지 않는다 */
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_MESSAGE = '불러오지 못했어요';

export function InlineError({
  message = DEFAULT_MESSAGE,
  onRetry,
  className,
}: InlineErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      <p className="text-[15px] font-medium text-body">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
