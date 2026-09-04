// 답장 본문 에디터 — 붙여넣기·드롭한 이미지가 올라가 커서 자리에 마크다운으로 들어가는지, 실패·거절이 알려지는지
import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MAX_IMAGE_BYTES } from '@/features/content-image/api/upload-content-image';
import { api } from '@/shared/api/client';

import { UPLOAD_PLACEHOLDER } from '../_model/markdown-image-paste';
import { ReplyBodyEditor } from './ReplyBodyEditor';

vi.mock('@/shared/api/client', () => ({ api: { post: vi.fn() } }));
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

const fileOf = (name: string, type: string, size = 1000) => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

/** 부모(useReplyDraft)처럼 값을 들고 있는 껍데기 */
function Harness({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <ReplyBodyEditor
      value={value}
      onChange={setValue}
      variant="sheet"
      maxLength={1000}
    />
  );
}

const textarea = () =>
  screen.getByRole('textbox', { name: '답장 본문' }) as HTMLTextAreaElement;

/** presign 응답을 손에 쥐고 있다가 원할 때 풀어 준다 — 업로드 중 상태를 보려고 */
function deferredPresign() {
  let resolve!: (url: string) => void;
  let reject!: (cause: Error) => void;
  vi.mocked(api.post).mockImplementation(
    () =>
      new Promise((res, rej) => {
        resolve = (imageUrl) =>
          res({ uploadUrl: 'https://s3/put', method: 'PUT', imageUrl });
        reject = rej;
      }),
  );
  return {
    resolve: (url: string) => resolve(url),
    reject: (e: Error) => reject(e),
  };
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true } as Response));
});

describe('ReplyBodyEditor', () => {
  it('이미지를 붙여넣으면 커서 자리에 자리표시가 들어가고, 올라가면 그 자리가 마크다운으로 바뀐다', async () => {
    const presign = deferredPresign();
    render(<Harness initial="앞뒤" />);
    textarea().setSelectionRange(1, 1);

    fireEvent.paste(textarea(), {
      clipboardData: { files: [fileOf('shot.png', 'image/png')] },
    });

    expect(textarea().value).toBe(`앞${UPLOAD_PLACEHOLDER}뒤`);

    await act(async () => presign.resolve('https://img/shot.png'));

    expect(textarea().value).toBe('앞![shot.png](https://img/shot.png)뒤');
  });

  it('끌어다 놓아도 같은 흐름으로 올라간다', async () => {
    const presign = deferredPresign();
    render(<Harness />);

    fireEvent.drop(textarea(), {
      dataTransfer: { files: [fileOf('drop.png', 'image/png')] },
    });
    await act(async () => presign.resolve('https://img/drop.png'));

    expect(textarea().value).toBe('![drop.png](https://img/drop.png)');
  });

  it('업로드에 실패하면 자리표시를 지우고 알린다', async () => {
    const presign = deferredPresign();
    render(<Harness initial="앞뒤" />);
    textarea().setSelectionRange(1, 1);

    fireEvent.paste(textarea(), {
      clipboardData: { files: [fileOf('shot.png', 'image/png')] },
    });
    await act(async () => presign.reject(new Error('boom')));

    expect(textarea().value).toBe('앞뒤');
    expect(toast.error).toHaveBeenCalled();
  });

  it('10MB를 넘는 이미지는 올리지 않고 알린다', () => {
    render(<Harness />);

    fireEvent.paste(textarea(), {
      clipboardData: {
        files: [fileOf('big.png', 'image/png', MAX_IMAGE_BYTES + 1)],
      },
    });

    expect(api.post).not.toHaveBeenCalled();
    expect(textarea().value).toBe('');
    expect(toast.error).toHaveBeenCalled();
  });

  it('이미지가 아닌 파일은 조용히 무시한다', () => {
    render(<Harness />);

    fireEvent.paste(textarea(), {
      clipboardData: { files: [fileOf('doc.pdf', 'application/pdf')] },
    });

    expect(api.post).not.toHaveBeenCalled();
    expect(textarea().value).toBe('');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('미리보기 탭을 누르면 쓴 글이 마크다운으로 보인다', () => {
    render(<Harness initial="**굵게**" />);

    fireEvent.click(screen.getByRole('tab', { name: '미리보기' }));

    expect(screen.getByText('굵게').tagName).toBe('STRONG');
  });
});
