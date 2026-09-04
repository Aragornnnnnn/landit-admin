// 답장 본문 미리보기 — 앱 편지함(landit-fe MarkdownBody)과 같은 렌더 조합. 플러그인·skipHtml·클래스 셋 중 하나라도 다르면 앱과 어긋난다.
// 운영자가 쓴 글이지만 react-markdown 기본 안전장치(javascript: 주소 제거)는 그대로 두고, HTML 태그는 앱처럼 그리지도 보여주지도 않는다(skipHtml)
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import { cn } from '@/shared/lib/cn';

const plugins = [remarkGfm, remarkBreaks];

export function ReplyMarkdownPreview({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  if (text.trim() === '')
    return (
      <div className={cn('text-[14px] text-subtle', className)}>
        미리볼 내용이 없어요
      </div>
    );

  return (
    <div className={cn('letter-markdown', className)}>
      <Markdown remarkPlugins={plugins} skipHtml>
        {text}
      </Markdown>
    </div>
  );
}
