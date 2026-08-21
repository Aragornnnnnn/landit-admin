import { describe, expect, it } from 'vitest';

import {
  compareVersions,
  EMPTY_APP_VERSION_DRAFT,
  saveImpactSentence,
  toAppVersionDraft,
  toAppVersionRequest,
  validateAppVersionDraft,
  type AppVersionDraft,
} from './app-version-draft';

const draft = (patch: Partial<AppVersionDraft> = {}): AppVersionDraft => ({
  minimumSupportedVersionName: '1.3.0',
  forceUpdateReason: '업데이트해 주세요',
  versionName: '1.4.2',
  buildNumber: '58',
  softUpdateReason: '새 기능이 추가됐어요',
  releaseNote: '· 편지함이 생겼어요',
  releasedAt: '2026-08-12T10:00',
  ...patch,
});

describe('compareVersions', () => {
  it('숫자로 잰다 — 문자열 비교면 1.10.0이 1.9.0보다 작아진다', () => {
    expect(compareVersions('1.10.0', '1.9.0')).toBe(1);
    expect(compareVersions('1.4', '1.4.0')).toBe(0);
    expect(compareVersions('1.3.0', '1.4.2')).toBe(-1);
  });
});

describe('validateAppVersionDraft', () => {
  it('제대로 된 초안은 통과', () => {
    expect(validateAppVersionDraft(draft())).toBeNull();
  });

  it('버전 형태가 아니면 막는다 — 앱이 이 값을 숫자로 비교한다', () => {
    expect(validateAppVersionDraft(draft({ versionName: 'v1.4' }))).toContain(
      '최신 버전',
    );
    expect(
      validateAppVersionDraft(draft({ minimumSupportedVersionName: '' })),
    ).toContain('최소 지원 버전');
  });

  it('빌드 번호는 숫자만', () => {
    expect(validateAppVersionDraft(draft({ buildNumber: '58b' }))).toContain(
      '빌드 번호',
    );
  });

  it('빌드 번호는 비워도 된다 — 선택 값이다', () => {
    expect(validateAppVersionDraft(draft({ buildNumber: '' }))).toBeNull();
  });

  it('최소 지원 버전이 최신보다 높으면 막는다 — 모두가 강제 업데이트를 보게 된다', () => {
    expect(
      validateAppVersionDraft(
        draft({ minimumSupportedVersionName: '1.5.0', versionName: '1.4.2' }),
      ),
    ).toContain('최소 지원 버전이');
  });

  it('배포일이 없으면 막는다 — BE 필수 값이다', () => {
    expect(validateAppVersionDraft(draft({ releasedAt: '' }))).toContain(
      '배포일',
    );
  });
});

describe('saveImpactSentence', () => {
  it('저장이 앱에서 무슨 일을 일으키는지 말한다', () => {
    expect(saveImpactSentence(draft())).toBe(
      '1.3.0 미만은 강제 업데이트를, 1.4.2 미만은 업데이트 권유를 보게 돼요.',
    );
  });
});

describe('toAppVersionDraft · toAppVersionRequest', () => {
  it('없는 값은 빈 문자열로 받아 입력이 제어 컴포넌트로 남게 한다', () => {
    expect(toAppVersionDraft({ platform: 'IOS' })).toEqual(
      EMPTY_APP_VERSION_DRAFT,
    );
  });

  it('빌드 번호가 비면 보내지 않는다', () => {
    expect(
      toAppVersionRequest(draft({ buildNumber: '' })).buildNumber,
    ).toBeUndefined();
    expect(toAppVersionRequest(draft()).buildNumber).toBe(58);
  });
});
