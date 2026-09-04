import { describe, expect, it } from 'vitest';

import { MAX_IMAGE_BYTES } from '@/features/content-image/api/upload-content-image';

import {
  imageMarkdown,
  insertPlaceholders,
  pickImageFiles,
  replacePlaceholder,
  shiftSlots,
  UPLOAD_PLACEHOLDER,
} from './markdown-image-paste';

const fileOf = (name: string, type: string, size = 1000) => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('pickImageFiles', () => {
  it('이미지가 아닌 파일은 조용히 거르고 이미지만 받는다', () => {
    const { accepted, oversized } = pickImageFiles([
      fileOf('a.png', 'image/png'),
      fileOf('b.pdf', 'application/pdf'),
      fileOf('c.webp', 'image/webp'),
    ]);

    expect(accepted.map((file) => file.name)).toEqual(['a.png', 'c.webp']);
    expect(oversized).toEqual([]);
  });

  it('10MB를 넘는 이미지는 받지 않고 따로 돌려준다 — 알려야 하는 쪽이다', () => {
    const { accepted, oversized } = pickImageFiles([
      fileOf('big.png', 'image/png', MAX_IMAGE_BYTES + 1),
      fileOf('ok.png', 'image/png', MAX_IMAGE_BYTES),
    ]);

    expect(accepted.map((file) => file.name)).toEqual(['ok.png']);
    expect(oversized.map((file) => file.name)).toEqual(['big.png']);
  });
});

describe('insertPlaceholders', () => {
  it('커서 자리에 자리표시를 끼우고 커서를 그 뒤로 옮긴다', () => {
    const result = insertPlaceholders('앞뒤', 1, 1);

    expect(result.text).toBe(`앞${UPLOAD_PLACEHOLDER}뒤`);
    expect(result.cursor).toBe(1 + UPLOAD_PLACEHOLDER.length);
    expect(result.slots).toEqual([
      { start: 1, end: 1 + UPLOAD_PLACEHOLDER.length },
    ]);
  });

  it('여러 장이면 한 장씩 줄을 바꿔 끼운다', () => {
    const result = insertPlaceholders('', 0, 2);

    expect(result.text).toBe(`${UPLOAD_PLACEHOLDER}\n${UPLOAD_PLACEHOLDER}`);
    expect(result.slots[1].start).toBe(UPLOAD_PLACEHOLDER.length + 1);
  });
});

describe('imageMarkdown', () => {
  it('파일명과 주소로 이미지 마크다운을 만든다', () => {
    expect(imageMarkdown('shot.png', 'https://img/a.png')).toBe(
      '![shot.png](https://img/a.png)',
    );
  });

  it('파일명의 대괄호·소괄호는 뺀다 — 마크다운 문법을 깨뜨린다', () => {
    expect(imageMarkdown('a](b).png', 'https://img/a.png')).toBe(
      '![ab.png](https://img/a.png)',
    );
  });
});

describe('replacePlaceholder', () => {
  const inserted = insertPlaceholders('앞\n', 2, 2);
  const [first, second] = inserted.slots;

  it('기억한 자리에 자리표시가 그대로면 거기를 결과로 바꾸고 길이 차이를 돌려준다', () => {
    const result = replacePlaceholder(inserted.text, first, '![a](u)');

    expect(result?.text).toBe(`앞\n![a](u)\n${UPLOAD_PLACEHOLDER}`);
    expect(result?.at).toBe(2);
    expect(result?.delta).toBe('![a](u)'.length - UPLOAD_PLACEHOLDER.length);
  });

  it('사용자가 앞쪽을 고쳐 자리가 밀렸으면 가장 가까운 자리표시를 찾아 바꾼다', () => {
    const edited = `앞에 글\n${inserted.text.slice(2)}`;

    const result = replacePlaceholder(edited, second, '![b](u)');

    expect(result?.text).toBe(`앞에 글\n${UPLOAD_PLACEHOLDER}\n![b](u)`);
  });

  it('자리표시를 사용자가 지웠으면 본문을 건드리지 않는다', () => {
    expect(replacePlaceholder('자리표시 없음', first, '![a](u)')).toBeNull();
  });

  it('빈 문자열로 바꾸면 자리표시가 사라진다 — 업로드 실패', () => {
    const result = replacePlaceholder(inserted.text, first, '');

    expect(result?.text).toBe(`앞\n\n${UPLOAD_PLACEHOLDER}`);
  });
});

describe('shiftSlots', () => {
  it('바뀐 자리 뒤의 슬롯만 길이 차이만큼 민다', () => {
    const slots = [
      { start: 0, end: 5 },
      { start: 6, end: 11 },
      { start: 12, end: 17 },
    ];

    expect(shiftSlots(slots, 6, 3)).toEqual([
      { start: 0, end: 5 },
      { start: 6, end: 11 },
      { start: 15, end: 20 },
    ]);
  });
});
