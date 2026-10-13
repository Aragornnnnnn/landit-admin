'use client';

// 발송 내역을 서버 페이지로 조회하고 편지 상세로 연결한다.
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  DIRECT_LETTER_KEY,
  fetchDirectLetters,
} from '@/features/direct-letter/api/direct-letter-query';
import { formatDateTime } from '@/shared/lib/format-time';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';
import { Pagination } from '@/shared/ui/Pagination';
import { Button } from '@/shared/ui/shadcn/button';

export function DirectLetterListPage({ page }: { page: number }) {
  const router = useRouter();
  const query = useQuery({
    queryKey: [...DIRECT_LETTER_KEY, 'list', page],
    queryFn: () => fetchDirectLetters(page),
  });
  const data = query.data;
  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/direct-letters/new">새 개인 편지</Link>
        </Button>
      </div>
      <section className="rounded-[20px] bg-card p-2">
        <h2 className="px-3 py-2.5 text-base font-bold text-strong">
          보낸 편지{' '}
          <span className="ml-2 text-[13px] font-normal text-subtle">
            {data?.totalElements ?? ''}
          </span>
        </h2>
        {query.isPending ? (
          <ListSkeleton rows={5} />
        ) : query.isError ? (
          <InlineError onRetry={() => query.refetch()} />
        ) : !data?.items.length ? (
          <EmptyState title="보낸 개인 편지가 없어요" />
        ) : (
          <>
            <div className="hidden grid-cols-[minmax(0,1fr)_120px_150px] gap-4 px-5 py-3 text-xs text-subtle md:grid">
              <span>제목</span>
              <span>받는 사람</span>
              <span>발송</span>
            </div>
            <ul>
              {data.items.map((letter) => (
                <li key={letter.letterId} className="rounded-xl odd:bg-muted">
                  <Link
                    href={`/direct-letters/${letter.letterId}`}
                    className="grid gap-2 rounded-xl px-5 py-4 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring md:grid-cols-[minmax(0,1fr)_120px_150px] md:gap-4"
                  >
                    <span className="truncate text-sm font-medium text-strong">
                      {letter.title}
                    </span>
                    <span className="text-[13px] text-body">
                      {letter.recipientCount}명
                    </span>
                    <time className="text-[13px] text-subtle">
                      {formatDateTime(letter.sentAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      {data && (
        <Pagination
          {...data}
          onChangePage={(next) => router.push(`/direct-letters?page=${next}`)}
        />
      )}
    </div>
  );
}
