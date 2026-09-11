'use client';

// 오른쪽 열 두 장 — 앱 버전과 지금 편지함 맨 위 (Figma 1050:7662).
// 둘 다 "지금 사용자에게 나가 있는 것"을 보여 준다. 고치러 가는 링크가 카드마다 붙는다
import Link from 'next/link';

import type { AppVersion } from '@/features/app-version/api/app-version';
import {
  PLATFORM_LABEL,
  PLATFORMS,
} from '@/features/app-version/model/platform';
import type { LetterItem } from '@/features/letter/api/letter-list';
import { LETTER_TYPE_LABEL } from '@/features/letter/model/letter-label';

export function AppVersionSummaryCard({
  versions,
  error = false,
}: {
  versions: AppVersion[];
  /** 조회 실패 — 조용히 "—"로 두면 값이 없는 것과 구분이 안 돼 실패라고 밝힌다 */
  error?: boolean;
}) {
  if (error)
    return (
      <Card title="앱 버전" href="/app-versions" linkLabel="앱 버전">
        <FetchFailed />
      </Card>
    );
  return (
    <Card title="앱 버전" href="/app-versions" linkLabel="앱 버전">
      {PLATFORMS.map((platform) => {
        const found = versions.find((version) => version.platform === platform);
        return (
          <div key={platform} className="flex items-baseline gap-2">
            <span className="w-[64px] shrink-0 text-[13px] text-subtle">
              {PLATFORM_LABEL[platform]}
            </span>
            <span className="text-[15px] font-medium text-strong">
              {found?.versionName ?? '—'}
              {found?.buildNumber ? ` (${found.buildNumber})` : ''}
            </span>
            <span className="ml-auto text-[12px] text-subtle">
              최소 {found?.minimumSupportedVersionName ?? '—'}
            </span>
          </div>
        );
      })}
    </Card>
  );
}

export function MailboxSummaryCard({
  letters,
  draftCount,
  error = false,
}: {
  letters: LetterItem[];
  draftCount: number;
  error?: boolean;
}) {
  if (error)
    return (
      <Card title="지금 편지함 맨 위" href="/letters" linkLabel="공지·업데이트">
        <FetchFailed />
      </Card>
    );
  // 사용자 편지함과 같은 순서 — 고정이 맨 위, 그다음 최신
  const top = [...letters]
    .sort((left, right) => {
      if (Boolean(left.pinned) !== Boolean(right.pinned))
        return left.pinned ? -1 : 1;
      return timeOf(right.publishedAt) - timeOf(left.publishedAt);
    })
    .slice(0, 3);

  return (
    <Card title="지금 편지함 맨 위" href="/letters" linkLabel="공지·업데이트">
      {top.length === 0 ? (
        <p className="py-2 text-[13px] text-subtle">발행된 편지가 없어요</p>
      ) : (
        top.map((letter) => (
          <div key={letter.letterId} className="flex items-center gap-2">
            <span className="shrink-0 text-[12px] text-subtle">
              {letter.type ? LETTER_TYPE_LABEL[letter.type] : ''}
            </span>
            {letter.pinned && (
              <span className="shrink-0 text-[12px] font-medium text-body">
                고정
              </span>
            )}
            <span className="truncate text-[13px] text-strong">
              {letter.title}
            </span>
          </div>
        ))
      )}
      {draftCount > 0 && (
        <span className="flex items-center gap-1.5 pt-1 text-[12px] text-subtle">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          임시저장 {draftCount}통 · 발행 대기
        </span>
      )}
    </Card>
  );
}

function FetchFailed() {
  return <p className="py-2 text-[13px] text-subtle">불러오지 못했어요</p>;
}

function Card({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-[20px] bg-card px-5 py-4.5">
      <header className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-bold text-foreground">{title}</h2>
        <Link href={href} className="text-[12px] text-subtle hover:text-body">
          {linkLabel} ›
        </Link>
      </header>
      {children}
    </section>
  );
}

const timeOf = (iso: string | undefined) => {
  const at = iso ? new Date(iso).getTime() : Number.NaN;
  return Number.isNaN(at) ? 0 : at;
};
