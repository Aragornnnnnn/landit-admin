// 언어 탭 전환과 단일 언어 선택, 작성 중 이미지 업로드의 콘텐츠 보존을 검증한다.
import { useState } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { EMPTY_LETTER_DRAFT, type LetterDraft } from '../_model/letter-draft';
import { LetterContentEditor } from './LetterContentEditor';

const bilingual: LetterDraft = {
  ...EMPTY_LETTER_DRAFT,
  includeTranslation: true,
  title: '한국어 공지',
  preview: '한국어 요약',
  body: '한국어 본문입니다.',
  translation: {
    title: '日本語のお知らせ',
    preview: '概要',
    body: '日本語の本文です。',
  },
};

function Editor({ initial = bilingual }: { initial?: LetterDraft }) {
  const [draft, setDraft] = useState(initial);
  return (
    <LetterContentEditor draft={draft} onChange={setDraft} date="10월 29일" />
  );
}

it('일본어 탭으로 전환하면 일본어 폼과 미리보기만 표시하고 한국어 입력을 유지한다', async () => {
  const user = userEvent.setup();
  render(<Editor />);
  await user.type(
    screen.getByRole('textbox', { name: '한국어 제목' }),
    ' 수정',
  );

  await user.click(screen.getByRole('tab', { name: '일본어' }));

  expect(
    screen.queryByRole('textbox', { name: '한국어 제목' }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: '일본어 제목' })).toHaveValue(
    '日本語のお知らせ',
  );
  expect(
    within(screen.getByRole('region', { name: '일본어 미리보기' })).getByRole(
      'heading',
    ),
  ).toHaveTextContent('日本語のお知らせ');
  await user.click(screen.getByRole('tab', { name: '한국어' }));
  expect(screen.getByRole('textbox', { name: '한국어 제목' })).toHaveValue(
    '한국어 공지 수정',
  );
});

it('일본어만 게시하도록 바꿨다가 두 언어로 돌아오면 각각의 입력을 유지한다', async () => {
  const user = userEvent.setup();
  render(<Editor />);

  await user.click(screen.getByRole('button', { name: '일본어' }));

  expect(
    screen.queryByRole('tablist', { name: '작성 언어' }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: '일본어 제목' })).toHaveValue(
    '日本語のお知らせ',
  );
  await user.click(screen.getByRole('button', { name: '한국어 · 일본어' }));
  await user.click(screen.getByRole('tab', { name: '한국어' }));
  expect(screen.getByRole('textbox', { name: '한국어 제목' })).toHaveValue(
    '한국어 공지',
  );
});

it('기본 언어가 일본어인 공지에서 한국어 템플릿을 적용하면 일본어 본문을 유지한다', async () => {
  const user = userEvent.setup();
  render(
    <Editor
      initial={{
        ...bilingual,
        ...bilingual.translation,
        locale: 'ja',
        translation: bilingual,
      }}
    />,
  );
  await user.click(screen.getByRole('tab', { name: '한국어' }));

  await user.click(screen.getByRole('button', { name: '기능 업데이트' }));
  await user.click(screen.getByRole('button', { name: '적용' }));

  expect(screen.getByRole('textbox', { name: '한국어 제목' })).toHaveValue(
    '[업데이트] OO 기능이 새로 추가되었어요! 🎉',
  );
  await user.click(screen.getByRole('tab', { name: '일본어' }));
  expect(screen.getByRole('textbox', { name: '일본어 본문' })).toHaveValue(
    '日本語の本文です。',
  );
  expect(screen.getByRole('button', { name: '업데이트' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

it('한국어 이미지 업로드 중 일본어를 편집하면 업로드 결과와 두 언어의 최신 입력을 모두 보존한다', async () => {
  let finish!: (value: Response) => void;
  vi.stubGlobal(
    'fetch',
    vi.fn((url) =>
      String(url).includes('presigned-url')
        ? new Promise<Response>((resolve) => {
            finish = resolve;
          })
        : Promise.resolve(new Response(null, { status: 200 })),
    ),
  );
  const user = userEvent.setup();
  render(<Editor />);
  fireEvent.paste(screen.getByRole('textbox', { name: '한국어 본문' }), {
    clipboardData: {
      files: [new File(['x'], 'notice.png', { type: 'image/png' })],
    },
  });
  await user.click(screen.getByRole('tab', { name: '일본어' }));
  await user.type(screen.getByRole('textbox', { name: '일본어 본문' }), '追加');

  await act(async () =>
    finish(
      Response.json({
        success: true,
        data: {
          uploadUrl: 'https://storage.example/upload',
          imageUrl: 'https://images.example/notice.png',
        },
      }),
    ),
  );

  expect(screen.getByRole('textbox', { name: '일본어 본문' })).toHaveValue(
    '日本語の本文です。追加',
  );
  await user.click(screen.getByRole('tab', { name: '한국어' }));
  expect(screen.getByRole('textbox', { name: '한국어 본문' })).toHaveValue(
    '![notice.png](https://images.example/notice.png)한국어 본문입니다.',
  );
});
