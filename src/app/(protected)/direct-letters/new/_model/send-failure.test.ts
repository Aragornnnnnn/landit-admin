import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api/api-error';

import { toSendFailure } from './send-failure';

const ENDPOINT = '/api/v1/admin/mailbox/direct-letters';

describe('toSendFailure', () => {
  it('404면 받는 사람 문제로 본다 — BE는 한 명이라도 없거나 탈퇴했으면 전체를 취소한다', () => {
    const error = new ApiError(
      '활성 수신자를 찾을 수 없습니다.',
      404,
      ENDPOINT,
      'RESOURCE_NOT_FOUND',
    );

    expect(toSendFailure(error)).toEqual({ kind: 'recipients' });
  });

  it('그 밖의 API 실패는 BE가 준 메시지를 그대로 쓴다', () => {
    const error = new ApiError(
      '수신자 ID가 중복됐습니다.',
      400,
      ENDPOINT,
      'INVALID_REQUEST',
    );

    expect(toSendFailure(error)).toEqual({
      kind: 'other',
      message: '수신자 ID가 중복됐습니다.',
    });
  });

  it('API 실패가 아니면(네트워크 끊김 등) 기본 문구로 다시 시도를 권한다', () => {
    expect(toSendFailure(new TypeError('Failed to fetch'))).toEqual({
      kind: 'other',
      message: '보내지 못했어요. 다시 시도해 주세요',
    });
  });
});
