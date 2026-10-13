// 메일 접수 상태와 멱등 재시도 규칙을 검증한다.
import { describe, expect, it } from 'vitest';

import {
  chooseEmailAttempt,
  jobLabel,
  shouldPollJob,
  validJobId,
} from './notification-job';

describe('이메일 작업', () => {
  it.each(['ACCEPTED', 'UNKNOWN', 'FAILED', 'REJECTED', 'EXCLUDED', undefined])(
    '%s 상태면 자동 조회를 멈춘다',
    (status) => expect(shouldPollJob(status)).toBe(false),
  );
  it.each(['PENDING', 'PROCESSING'])('%s 상태면 계속 조회한다', (status) =>
    expect(shouldPollJob(status)).toBe(true),
  );
  it('ACCEPTED를 메일 도착으로 표시하지 않는다', () =>
    expect(jobLabel('ACCEPTED')).toBe('제공자 접수'));
  it('같은 주소의 실패 재시도면 동일한 멱등성 키를 쓴다', () => {
    const previous = { recipient: 'a@example.com', key: 'original' };
    expect(
      chooseEmailAttempt(previous, ' a@example.com ', () => 'new'),
    ).toEqual(previous);
  });
  it('주소가 달라지면 새 키로 구분한다', () =>
    expect(
      chooseEmailAttempt(
        { recipient: 'a@example.com', key: 'old' },
        'b@example.com',
        () => 'new',
      ).key,
    ).toBe('new'));
  it('유효한 UUID만 작업 조회를 허용한다', () => {
    expect(validJobId('cc1cb013-78d0-461e-9bb7-c880992cab5f')).toBe(true);
    expect(validJobId('../users')).toBe(false);
  });
});
