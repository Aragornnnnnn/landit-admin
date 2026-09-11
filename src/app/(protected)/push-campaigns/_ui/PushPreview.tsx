'use client';

// 사용자 기기에서 보일 알림 — iOS 잠금화면(제목 1줄·본문 4줄)과 Android 접힘(제목·본문 1줄) 두 가지.
// 글자 크기·줄 수는 docs/screens/push-campaigns.md "미리보기 기준"을 따른다. 편집기와 상세가 같이 쓴다 (Figma 2194:453)
import { useState, useSyncExternalStore } from 'react';
import { ChevronDown } from 'lucide-react';

import { kstNow } from '@/features/push-campaign/model/schedule-time';
import { cn } from '@/shared/lib/cn';
import { LanditAppIcon } from '@/shared/ui/LanditAppIcon';

export type PreviewPlatform = 'ios' | 'android';

interface PushPreviewProps {
  title: string;
  body: string;
  className?: string;
}

export function PushPreview({ title, body, className }: PushPreviewProps) {
  const [platform, setPlatform] = useState<PreviewPlatform>('ios');
  const clock = useKstClock();

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        role="tablist"
        aria-label="미리보기 플랫폼"
        className="flex gap-0.5 rounded-[9px] bg-hairline p-[3px]"
      >
        {(['ios', 'android'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={platform === value}
            onClick={() => setPlatform(value)}
            className={cn(
              'rounded-[7px] px-3 py-1 text-[12px] font-medium text-subtle transition-colors',
              platform === value && 'bg-card text-strong shadow-sm',
            )}
          >
            {value === 'ios' ? 'iOS' : 'Android'}
          </button>
        ))}
      </div>

      <div className="flex h-[560px] w-[300px] flex-col items-center overflow-hidden rounded-[36px] border-[6px] border-strong bg-linear-to-b from-muted to-hairline px-3 pt-[60px] pb-3.5">
        <span
          className={cn(
            'text-[14px] font-medium text-strong',
            platform === 'android' && 'text-body',
          )}
        >
          {clock.date}
        </span>
        <span
          className={cn(
            'text-[64px] leading-[1.1] text-strong',
            platform === 'ios' ? 'font-bold' : 'font-normal',
          )}
        >
          {clock.time}
        </span>

        {platform === 'ios' ? (
          <IosBanner title={title} body={body} />
        ) : (
          <AndroidCard title={title} body={body} />
        )}

        <span
          aria-hidden
          className="mt-auto h-[5px] w-[110px] rounded-full bg-strong"
        />
      </div>
    </div>
  );
}

const PLACEHOLDER = { title: '제목', body: '본문' };

// iOS 16+ 잠금화면 배너 — 앱 이름은 보이지 않고 아이콘·제목(1줄)·본문(최대 4줄)·"지금"
function IosBanner({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-6 flex w-full gap-2.5 rounded-[22px] bg-card/85 p-3 pr-3.5 shadow-sm">
      <LanditAppIcon size={38} className="size-[38px] shrink-0 rounded-[9px]" />
      <div className="flex min-w-px flex-1 flex-col gap-px">
        <div className="flex items-center gap-2">
          <span className="flex-1 truncate text-[15px] leading-[1.3] font-semibold text-foreground">
            {title || PLACEHOLDER.title}
          </span>
          <span className="shrink-0 text-[13px] text-body">지금</span>
        </div>
        <span className="line-clamp-4 text-[15px] leading-[1.3] break-all text-foreground">
          {body || PLACEHOLDER.body}
        </span>
      </div>
    </div>
  );
}

// Android 접힌 알림 — 스몰 아이콘·앱 이름·시각 헤더, 제목 1줄, 본문 1줄(펼치기 전)
function AndroidCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-6 flex w-full flex-col gap-1.5 rounded-[28px] bg-card px-4 py-3.5 shadow-sm">
      <div className="flex items-center gap-2 text-[12px] text-body">
        <span
          aria-hidden
          className="flex size-[18px] items-center justify-center rounded-full bg-primary"
        >
          <svg viewBox="0 0 24 24" className="size-[11px]" fill="#ffffff">
            <path d="M12 22c1.2 0 2.2-1 2.2-2.2H9.8C9.8 21 10.8 22 12 22Zm6.5-6.2v-5.3c0-3.3-1.8-6.1-4.9-6.8v-.6a1.6 1.6 0 0 0-3.2 0v.6C7.3 4.4 5.5 7.2 5.5 10.5v5.3l-1.7 1.7c-.5.5-.1 1.3.6 1.3h15.2c.7 0 1.1-.8.6-1.3l-1.7-1.7Z" />
          </svg>
        </span>
        <span className="font-medium">Landit</span>
        <span>• 지금</span>
        <ChevronDown className="ml-auto size-3.5" aria-hidden />
      </div>
      <span className="truncate text-[14px] leading-[1.4] font-medium text-foreground">
        {title || PLACEHOLDER.title}
      </span>
      <span className="truncate text-[14px] leading-[1.4] text-body">
        {body || PLACEHOLDER.body}
      </span>
    </div>
  );
}

// 잠금화면 시계 — 서버 렌더에선 비워 두고 브라우저에서 채운다. 서버 시각과 브라우저 시각이 달라 hydration이 어긋나는 걸 피한다
const DATE_FORMAT = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});
const noop = () => () => {};
const readClock = () => {
  const now = new Date();
  return `${DATE_FORMAT.format(now)}|${kstNow(now).time}`;
};

function useKstClock() {
  const snapshot = useSyncExternalStore(noop, readClock, () => '|--:--');
  const [date, time] = snapshot.split('|');
  return { date, time };
}
