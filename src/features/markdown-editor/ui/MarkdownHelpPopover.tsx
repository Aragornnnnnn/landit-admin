'use client';

// 마크다운 본문 도움말 — 물음표를 누르면 앱에서 실제로 그려지는 문법만 표로 보여준다.
// 항상 보이는 안내 문장 대신 두는 이유는 알고 나면 소음이고, 한 줄로는 문법을 다 못 알려줘서다 (docs/screens/feedbacks.md "답장 본문 마크다운")
import { CircleHelp } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

/** 앱(remark-gfm + remark-breaks)이 그리는 것만. 여기 없는 문법은 앱에서도 안 된다 */
const SYNTAX_ROWS: [syntax: string, result: string][] = [
  ['엔터 한 번', '줄바꿈'],
  ['빈 줄', '문단 나눔'],
  ['**굵게** *기울임* ~~취소선~~', '굵게 · 기울임 · 취소선'],
  ['`코드`', '인라인 코드'],
  ['[글자](주소)', '링크. 주소만 붙여도 링크가 돼요'],
  ['이미지 붙여넣기 · 끌어다 놓기', '![파일명](주소)로 들어가요'],
  ['# 제목', '제목 (##, ###도)'],
  ['- 항목 / 1. 항목', '목록 / 번호 목록'],
  ['- [ ] 할 일', '체크박스'],
  ['> 인용', '인용'],
  ['| 열 | 열 |', '표'],
  ['---', '구분선'],
];

export function MarkdownHelpPopover() {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="마크다운 도움말"
        className="rounded-full text-subtle hover:text-foreground"
      >
        <CircleHelp className="size-3.5" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-4">
        <p className="text-[13px] font-semibold text-foreground">
          마크다운으로 써요
        </p>
        <table className="mt-2 w-full text-[12px]">
          <tbody>
            {SYNTAX_ROWS.map(([syntax, result]) => (
              <tr key={syntax} className="align-top">
                <td className="w-[150px] py-1 pr-3 font-mono text-body">
                  {syntax}
                </td>
                <td className="py-1 text-subtle">{result}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[12px] text-subtle">
          HTML 태그는 지워져요. 미리보기로 확인하세요.
        </p>
      </PopoverContent>
    </Popover>
  );
}
