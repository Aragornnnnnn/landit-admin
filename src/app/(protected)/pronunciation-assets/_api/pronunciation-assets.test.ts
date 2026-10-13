// 임포트 계약의 쿼리 인코딩과 부분 실패 보존을 검증한다.
import { afterEach, expect, it, vi } from 'vitest';

import { importAssets } from './pronunciation-assets';

afterEach(() => vi.unstubAllGlobals());
it('키의 특수문자를 인코딩하고 부분 실패를 그대로 반환한다', async () => {
  const data = {
    inserted: 1,
    updated: 2,
    failures: [
      {
        expressionId: 3,
        accentLocale: 'EN_US',
        reason: '기준 데이터가 없습니다.',
      },
    ],
  };
  const fetchMock = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify({ success: true, data })));
  vi.stubGlobal('fetch', fetchMock);
  expect(await importAssets('tts', 'folder/한 글&?.json')).toEqual(data);
  const [url, options] = fetchMock.mock.calls[0];
  expect(
    new URL(url, 'https://admin.test').searchParams.get('manifestKey'),
  ).toBe('folder/한 글&?.json');
  expect(url).toContain('/import-tts-from-s3?');
  expect(options.method).toBe('POST');
  expect(options.body).toBeUndefined();
});
