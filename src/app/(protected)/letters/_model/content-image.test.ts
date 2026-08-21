import { describe, expect, it } from 'vitest';

import { checkImageFile, MAX_IMAGE_BYTES } from './content-image';

const fileOf = (type: string, size: number) => {
  const file = new File(['x'], 'shot.png', { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('checkImageFile', () => {
  it('사용자 앱이 그릴 수 있는 형식만 통과한다', () => {
    expect(checkImageFile(fileOf('image/png', 1000))).toBeNull();
    expect(checkImageFile(fileOf('image/svg+xml', 1000))).toBe(
      'PNG · JPG · WEBP · GIF만 올릴 수 있어요',
    );
    expect(checkImageFile(fileOf('application/pdf', 1000))).not.toBeNull();
  });

  it('큰 파일은 올리기 전에 막는다 — 올리고 나서 거절당하면 원인을 알기 어렵다', () => {
    expect(checkImageFile(fileOf('image/png', MAX_IMAGE_BYTES + 1))).toBe(
      '5MB 이하만 올릴 수 있어요',
    );
    expect(checkImageFile(fileOf('image/png', MAX_IMAGE_BYTES))).toBeNull();
  });
});
