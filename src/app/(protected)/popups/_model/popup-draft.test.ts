// 팝업 입력의 기간·링크 제거·부분 수정과 이미지 업로드 제한을 검증한다.
import { describe, expect, it } from 'vitest';

import {
  toPopupDraft,
  toPopupRequest,
  validatePopupDraft,
  validatePopupImage,
} from './popup-draft';

const popup = {
  popupId: 1,
  title: '안내',
  imageUrl: 'https://cdn.example.com/a.png',
  linkUrl: '/learn',
  enabled: true,
  startsAt: '2026-10-22T00:00:00.123456Z',
  endsAt: '2026-10-29T00:00:00Z',
  priority: 0,
  updatedAt: '2026-10-22T00:00:00Z',
};
describe('팝업 입력', () => {
  it('같은 분 안의 기간을 수정하지 않으면 원래 정밀도로 검증한다', () => {
    const short = { ...popup, endsAt: '2026-10-22T00:00:00.123457Z' };
    expect(
      validatePopupDraft({ ...toPopupDraft(short), title: '수정' }, short),
    ).toBeNull();
  });
  it('서버 시각을 읽으면 한국 시간으로 표시한다', () => {
    expect(toPopupDraft(popup).startsAt).toBe('2026-10-22T09:00');
  });
  it('제목만 수정하면 기존 기간과 다른 필드는 보내지 않는다', () => {
    expect(
      toPopupRequest({ ...toPopupDraft(popup), title: '수정' }, popup),
    ).toEqual({ title: '수정' });
  });
  it('링크를 비우고 끄면 null과 false를 보낸다', () => {
    expect(
      toPopupRequest(
        { ...toPopupDraft(popup), linkUrl: '', enabled: false },
        popup,
      ),
    ).toEqual({ linkUrl: null, enabled: false });
  });
  it('등록하면 한국 시간의 절대 시각과 필수 값을 보낸다', () => {
    expect(toPopupRequest(toPopupDraft(popup))).toMatchObject({
      startsAt: '2026-10-22T00:00:00.000Z',
      enabled: true,
      priority: 0,
    });
  });
  it.each([
    { endsAt: '2026-10-22T09:00' },
    { startsAt: '' },
    { title: ' ' },
    { priority: '-1' },
    { priority: '1.5' },
    { priority: '2147483648' },
    { imageUrl: 'http://cdn.example.com/a.png' },
    { linkUrl: '//example.com' },
    { linkUrl: '/\\evil.test' },
    { linkUrl: 'javascript:alert(1)' },
  ])('잘못된 입력 %j이면 저장을 막는다', (invalid) => {
    expect(
      validatePopupDraft({ ...toPopupDraft(popup), ...invalid }),
    ).toBeTruthy();
  });
  it('링크를 비워도 저장할 수 있다', () => {
    expect(
      validatePopupDraft({ ...toPopupDraft(popup), linkUrl: '' }),
    ).toBeNull();
  });
  it.each([
    ['x.svg', 'image/svg+xml', 10],
    ['x.gif', 'image/gif', 10],
    ['x.png', 'image/jpeg', 10],
    ['x.png', 'image/png', 0],
    ['x.png', 'image/png', 10485761],
  ])('허용하지 않는 파일 %s %s %s이면 거부한다', (name, type, size) => {
    expect(validatePopupImage({ name, type, size })).toBeTruthy();
  });
  it('허용하는 이미지이면 업로드할 수 있다', () => {
    expect(
      validatePopupImage({ name: 'x.JPG', type: 'image/jpeg', size: 10485760 }),
    ).toBeNull();
  });
});
