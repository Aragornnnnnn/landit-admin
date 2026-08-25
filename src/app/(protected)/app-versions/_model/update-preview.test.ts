import { describe, expect, it } from 'vitest';

import type { AppVersionDraft } from './app-version-draft';
import {
  APP_DEFAULT_REASON,
  previewRangeLabel,
  previewReason,
} from './update-preview';

const draft = (patch: Partial<AppVersionDraft> = {}): AppVersionDraft => ({
  minimumSupportedVersionName: '1.3.0',
  forceUpdateReason: '업데이트해 주세요',
  versionName: '1.4.2',
  buildNumber: '58',
  softUpdateReason: '새 기능이 추가됐어요',
  releaseNote: '',
  releasedAt: '2026-08-12T10:00',
  ...patch,
});

describe('previewReason', () => {
  it('적은 문구가 그대로 앱에 들어간다', () => {
    expect(previewReason(draft(), 'force')).toBe('업데이트해 주세요');
  });

  it('비우면 앱 기본 문구가 나온다 — "빈칸 = 아무것도 안 뜸"이 아니다', () => {
    expect(previewReason(draft({ forceUpdateReason: '  ' }), 'force')).toBe(
      APP_DEFAULT_REASON.force,
    );
    expect(previewReason(draft({ softUpdateReason: '' }), 'soft')).toBe(
      APP_DEFAULT_REASON.soft,
    );
  });
});

describe('previewRangeLabel', () => {
  it('강제는 최소 지원 미만', () => {
    expect(previewRangeLabel(draft(), 'force')).toBe('1.3.0 미만');
  });

  it('권유는 최소 지원부터 최신 바로 아래까지 — 최신 버전은 아무것도 안 본다', () => {
    expect(previewRangeLabel(draft(), 'soft')).toBe('1.3.0 ~ 1.4.1');
  });

  it('최신이 x.y.0이면 한 칸 아래를 셀 수 없어 범위를 열어 둔다', () => {
    expect(previewRangeLabel(draft({ versionName: '1.5.0' }), 'soft')).toBe(
      '1.3.0 이상',
    );
  });
});
