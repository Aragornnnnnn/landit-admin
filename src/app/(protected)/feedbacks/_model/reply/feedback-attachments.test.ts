// 피드백 첨부 → 화면에 걸 이미지 주소 변환 검증 — 프록시로만, 모양이 맞는 경로만
import { describe, expect, it } from 'vitest';

import { toAttachmentImages } from './feedback-attachments';

const attachment = (patch: Record<string, unknown> = {}) => ({
  attachmentId: 34,
  contentType: 'image/png',
  fileSize: 1024,
  downloadUrl: '/api/v1/mailbox/feedbacks/12/attachments/34',
  ...patch,
});

describe('toAttachmentImages', () => {
  it('BE 상대 경로를 프록시 경로로 바꿔 순서대로 돌려준다', () => {
    const images = toAttachmentImages([
      attachment(),
      attachment({
        attachmentId: 35,
        downloadUrl: '/api/v1/mailbox/feedbacks/12/attachments/35',
      }),
    ]);

    expect(images).toEqual([
      { id: 34, src: '/api/proxy/api/v1/mailbox/feedbacks/12/attachments/34' },
      { id: 35, src: '/api/proxy/api/v1/mailbox/feedbacks/12/attachments/35' },
    ]);
  });

  it('첨부가 없거나 null이면 빈 배열이다', () => {
    expect(toAttachmentImages(undefined)).toEqual([]);
    expect(toAttachmentImages(null)).toEqual([]);
    expect(toAttachmentImages([])).toEqual([]);
  });

  it.each([
    ['downloadUrl이 없으면', { downloadUrl: undefined }],
    ['attachmentId가 없으면', { attachmentId: undefined }],
    [
      '절대 주소면',
      {
        downloadUrl:
          'https://evil.test/api/v1/mailbox/feedbacks/12/attachments/34',
      },
    ],
    [
      '프로토콜 상대 주소면',
      { downloadUrl: '//evil.test/api/v1/mailbox/feedbacks/12/attachments/34' },
    ],
    ['첨부 경로 모양이 아니면', { downloadUrl: '/api/v1/admin/users' }],
    [
      '뒤에 다른 게 붙으면',
      { downloadUrl: '/api/v1/mailbox/feedbacks/12/attachments/34?x=1' },
    ],
  ])(
    '%s 그 항목은 뺀다 — 프록시가 열어 둔 경로 밖 주소를 img에 걸지 않는다',
    (_, patch) => {
      expect(toAttachmentImages([attachment(patch)])).toEqual([]);
    },
  );
});
