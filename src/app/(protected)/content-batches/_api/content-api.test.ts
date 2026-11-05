// 관리자 프록시 경계에서 실제 제작 요청 계약과 오류 보존을 검증한다.
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  canApprove,
  canReview,
  creationError,
  shouldPoll,
} from '../_model/content-state';
import { runContentCommand, type ContentCommand } from './content-api';

afterEach(() => vi.unstubAllGlobals());
describe('콘텐츠 제작 계약', () => {
  it('생성을 요청하면 자동 진행을 끄고 캐릭터 구성을 프록시로 보낸다', async () => {
    const fetch = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        data: { batch: { batchId: 7 }, days: [] },
      }),
    );
    vi.stubGlobal('fetch', fetch);
    const request = {
      dayCount: 1,
      characterRatio: { chloe: 0, marco: 0, teddy: 1 },
      note: '일상',
    };

    await runContentCommand({ kind: 'create', request });

    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('/api/proxy/api/v1/admin/content-batches');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ ...request, autoProceed: false });
  });
  it.each([
    [{ kind: 'proceed', batchId: 7 }, 'POST', '/7/proceed', undefined],
    [{ kind: 'approve', batchId: 7 }, 'POST', '/7/approve', undefined],
    [
      { kind: 'lineup', batchId: 7, comment: '다양한 소재' },
      'POST',
      '/7/lineup/regenerate',
      { comment: '다양한 소재' },
    ],
    [
      {
        kind: 'review',
        batchId: 7,
        draftId: 9,
        request: { verdict: 'FIX', comments: [{ comment: '뜻 확인' }] },
      },
      'PUT',
      '/7/drafts/9/review',
      { verdict: 'FIX', comments: [{ comment: '뜻 확인' }] },
    ],
    [
      {
        kind: 'regenerate',
        batchId: 7,
        draftId: 9,
        scope: 'EXPRESSIONS:LEVEL_2_TO_3',
      },
      'POST',
      '/7/drafts/9/regenerate',
      { scope: 'EXPRESSIONS:LEVEL_2_TO_3' },
    ],
  ] satisfies [ContentCommand, string, string, unknown][])(
    '변경 요청 %j의 경로와 본문을 유지한다',
    async (command, method, path, body) => {
      const fetch = vi
        .fn()
        .mockResolvedValue(Response.json({ success: true, data: {} }));
      vi.stubGlobal('fetch', fetch);

      await runContentCommand(command);

      const [url, init] = fetch.mock.calls[0];
      expect(url).toBe(`/api/proxy/api/v1/admin/content-batches${path}`);
      expect(init.method).toBe(method);
      expect(
        init.body === undefined ? undefined : JSON.parse(init.body),
      ).toEqual(body);
    },
  );
  it('서버가 상태 충돌을 반환하면 성공으로 바꾸지 않고 오류를 유지한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json(
            { success: false, error: { message: 'OK가 아닌 Day가 있습니다.' } },
            { status: 409 },
          ),
        ),
    );

    await expect(
      runContentCommand({ kind: 'approve', batchId: 7 }),
    ).rejects.toThrow('OK가 아닌 Day가 있습니다.');
  });
});

describe('제작 상태 경계', () => {
  it.each([
    [0, 0, 0, 0],
    [31, 0, 0, 31],
    [2, 0, 0, 1],
    [1, -1, 0, 2],
    [1.5, 0, 0, 1.5],
  ])(
    '제작 수나 배분이 잘못되면 요청하지 않는다',
    (dayCount, chloe, marco, teddy) => {
      expect(
        creationError({ dayCount, characterRatio: { chloe, marco, teddy } }),
      ).not.toBeNull();
    },
  );
  it('정수 합이 일치하면 생성할 수 있다', () => {
    expect(
      creationError({
        dayCount: 3,
        characterRatio: { chloe: 1, marco: 1, teddy: 1 },
      }),
    ).toBeNull();
  });
  it('검수 배치에서 한 Day만 재생성 중이어도 상태를 계속 조회한다', () => {
    expect(
      shouldPoll({
        batch: { status: 'REVIEW_READY' },
        days: [{ status: 'GENERATING' }],
      }),
    ).toBe(true);
  });
  it('모든 Day가 끝난 검수 배치는 주기 조회를 멈춘다', () => {
    expect(
      shouldPoll({
        batch: { status: 'REVIEW_READY' },
        days: [{ status: 'OK' }],
      }),
    ).toBe(false);
  });
  it('전체 배치가 생성 중이면 완료된 Day를 검수할 수 있다', () => {
    expect(canReview('GENERATING', 'REVIEW_READY')).toBe(true);
    expect(canReview('APPROVED', 'OK')).toBe(false);
  });
  it('누락·미완료 Day가 있으면 배치 승인을 막는다', () => {
    expect(
      canApprove({
        batch: { status: 'REVIEW_READY', dayCount: 2 },
        days: [{ status: 'OK' }],
      }),
    ).toBe(false);
    expect(
      canApprove({
        batch: { status: 'REVIEW_READY', dayCount: 2 },
        days: [{ status: 'OK' }, { status: 'NEEDS_FIX' }],
      }),
    ).toBe(false);
    expect(
      canApprove({
        batch: { status: 'REVIEW_READY', dayCount: 1 },
        days: [{ status: 'OK' }],
      }),
    ).toBe(true);
  });
});
