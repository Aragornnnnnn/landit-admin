'use client';

// 발송 본문·읽음 통계·수신자별 최초 읽음 시각을 보여준다.
import Link from 'next/link';

import { summarizeReads } from '@/features/direct-letter/model/read-summary';
import { useDirectLetterQuery } from '@/features/direct-letter/model/useDirectLetterQuery';
import { DirectLetterPreview } from '@/features/direct-letter/ui/DirectLetterPreview';
import { MarkdownPreview } from '@/features/markdown-editor/ui/MarkdownPreview';
import { ApiError } from '@/shared/api/api-error';
import { formatDateTime } from '@/shared/lib/format-time';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Button } from '@/shared/ui/shadcn/button';

export function DirectLetterDetailPage({ id }: { id: number }) {
  const query = useDirectLetterQuery(id);
  const letter = query.data;
  if (query.isPending) return <ListSkeleton rows={6} />;
  if (query.isError || !letter)
    return (
      <InlineError
        message={
          query.error instanceof ApiError && query.error.status === 404
            ? '편지를 찾을 수 없어요'
            : '편지를 불러오지 못했어요'
        }
        onRetry={() => query.refetch()}
      />
    );
  const summary = summarizeReads(letter.recipients);
  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <div className="flex flex-wrap items-center gap-3 text-xs text-subtle">
        <Link href="/direct-letters">← 목록</Link>
        <time>{formatDateTime(letter.sentAt)}</time>
        <Button asChild variant="outline" className="ml-auto">
          <Link href={`/direct-letters/new?from=${id}`}>
            같은 사람에게 또 쓰기
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <section className="rounded-[20px] bg-card p-6">
            <h2 className="mb-4 font-bold">읽음</h2>
            <dl className="grid grid-cols-3 gap-3">
              {[
                ['받는 사람', summary.total],
                ['읽음', summary.read],
                ['안 읽음', summary.unread],
              ].map(([label, count]) => (
                <div key={label} className="rounded-xl bg-muted p-4">
                  <dt className="text-xs text-subtle">{label}</dt>
                  <dd className="mt-1 text-2xl font-bold">{count}</dd>
                </div>
              ))}
            </dl>
            <div
              role="meter"
              aria-label="읽음 비율"
              aria-valuenow={summary.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-4 h-2 overflow-hidden rounded-full bg-border"
            >
              <div
                className="h-full bg-success"
                style={{ width: `${summary.percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-subtle">
              읽음 {summary.percent.toFixed(1)}% · 안 읽음 {summary.unread}명
            </p>
          </section>
          <section className="rounded-[20px] bg-card p-6">
            <h2 className="mb-4 font-bold">내용</h2>
            <h3 className="mb-3 text-sm font-medium break-words">
              {letter.title}
            </h3>
            <MarkdownPreview text={letter.bodyText} />
          </section>
          <section className="rounded-[20px] bg-card p-6">
            <h2 className="mb-3 font-bold">
              받는 사람{' '}
              <span className="text-xs font-normal text-subtle">
                {letter.recipientCount}명
              </span>
            </h2>
            <ul>
              {letter.recipients.map((recipient) => (
                <li
                  key={recipient.userProfileId}
                  className="flex flex-wrap justify-between gap-2 rounded-xl px-3 py-3 text-xs odd:bg-muted"
                >
                  <span>#{recipient.userProfileId}</span>
                  <span
                    className={
                      recipient.readAt ? 'text-success' : 'text-subtle'
                    }
                  >
                    {recipient.readAt
                      ? `${formatDateTime(recipient.readAt)} 읽음`
                      : '안 읽음'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <DirectLetterPreview
          title={letter.title}
          body={letter.bodyText}
          sentAt={letter.sentAt}
          className="hidden w-[340px] shrink-0 xl:flex"
        />
      </div>
    </div>
  );
}
