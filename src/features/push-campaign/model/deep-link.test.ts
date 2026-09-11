import { describe, expect, it } from 'vitest';

import { campaignSlug, deepLinkError, withUtm } from './deep-link';

describe('deepLinkError', () => {
  it.each([
    ['/survey/premium', null],
    ['https://landit.im/event?x=1', null],
    ['', '딥 링크를 입력해 주세요'],
    ['survey', '/로 시작하거나 https://로 시작해야 해요'],
    ['http://landit.im', '/로 시작하거나 https://로 시작해야 해요'],
    ['//evil.com/x', '/로 시작하거나 https://로 시작해야 해요'],
    ['javascript:alert(1)', '/로 시작하거나 https://로 시작해야 해요'],
    ['https://user:pw@landit.im', '주소에 사용자 정보를 넣을 수 없어요'],
    ['https://', '주소가 올바르지 않아요'],
  ])('%s → %s', (link, error) => {
    expect(deepLinkError(link)).toBe(error);
  });

  it('BE 최대 길이(1000자)를 넘으면 막는다 — UTM을 붙인 뒤 길이로 검사한다', () => {
    expect(deepLinkError('/' + 'a'.repeat(999))).toBeNull();
    expect(deepLinkError('/' + 'a'.repeat(1000))).toBe(
      '딥 링크는 1000자까지예요',
    );
  });
});

describe('campaignSlug', () => {
  const date = new Date('2026-09-12T10:00:00+09:00');

  it('admin_ 접두사 + 제목의 글자·숫자만 남기고 띄어쓰기는 _로, 끝에 MMDD', () => {
    expect(campaignSlug('설문에 답하고  프리미엄 미리 써보기!', date)).toBe(
      'admin_설문에_답하고_프리미엄_미리_써보기_0912',
    );
    expect(campaignSlug('1.4.3 Update — Mic Fix', date)).toBe(
      'admin_143_update_mic_fix_0912',
    );
  });

  it('제목이 비었거나 기호뿐이면 push로 대신한다 — 접두사는 그대로', () => {
    expect(campaignSlug('', date)).toBe('admin_push_0912');
    expect(campaignSlug('!!!', date)).toBe('admin_push_0912');
  });

  it('길면 40자에서 자른다 — utm 값이 끝없이 길어지지 않게', () => {
    expect(campaignSlug('가'.repeat(60), date)).toBe(
      'admin_' + '가'.repeat(40) + '_0912',
    );
  });
});

describe('withUtm', () => {
  it('쿼리가 없으면 ?로, 이미 있으면 &로 잇는다', () => {
    expect(withUtm('/survey', 'survey_0912')).toBe(
      '/survey?utm_source=push&utm_medium=notification&utm_campaign=survey_0912',
    );
    expect(withUtm('https://landit.im/e?x=1', 'e')).toBe(
      'https://landit.im/e?x=1&utm_source=push&utm_medium=notification&utm_campaign=e',
    );
  });

  it('한글 캠페인 값은 URL 인코딩한다', () => {
    expect(withUtm('/a', '설문_0912')).toBe(
      '/a?utm_source=push&utm_medium=notification&utm_campaign=%EC%84%A4%EB%AC%B8_0912',
    );
  });

  it('스위치가 꺼졌거나 캠페인 값이 비면 원본 그대로', () => {
    expect(withUtm('/a', '')).toBe('/a');
  });
});
