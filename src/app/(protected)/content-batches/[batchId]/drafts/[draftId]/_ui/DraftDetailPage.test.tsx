// Day 초안 상세 — 줄 클릭이 코멘트 참조·대상 경로가 되고, FIX 저장은 BE 계약대로 보내며, 검증기 path는 줄을 찾아가고, 재생성은 "다시 볼 것"을 남긴다
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import type {
  ContentBatchStatus,
  ContentDraftStatus,
} from '@/features/content/api/content-batch';
import { needsRevisit } from '@/features/content/model/review-visit';

import { DraftDetailPage } from './DraftDetailPage';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

const scrollIntoView = vi.fn();
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollIntoView = scrollIntoView;
});
afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

const question = (level: string, order: number, text: string) => ({
  questionLevelGroup: level,
  displayOrder: order,
  responseDemand: 'ANSWER',
  questionText: text,
  questionTranslation: '해석',
  requiredResponseElement: '요소',
  innerThought: order === 1 ? '속마음' : null,
  innerThoughtType: order === 1 ? 'GOOD' : null,
});
const expression = (level: string, text: string) => ({
  levelGroup: level,
  answerToQuestionDisplayOrder: 1,
  expressionType: 'BASIC',
  usageFrequencyLevel: 'HIGH',
  difficultyLevel: 1,
  targetExpressionText: text,
  baseExpressionMeaningText: '뜻',
  usageSummary: '',
  usageDescription: '',
  representativeQuestionText: '',
  representativeQuestionTranslation: '',
  representativeSentenceText: '',
  representativeSentenceTranslation: '',
  practiceExamples: [],
});

const draft = (status: ContentDraftStatus) => ({
  draftId: 601,
  batchId: 6,
  plannedDay: 301,
  status,
  errorMessage: null,
  lineupRow: null,
  scenarioPayload: {
    scenario: {
      categoryDisplayOrder: 6,
      aiRole: '친구',
      characterId: 'chloe',
      difficulty: 'EASY',
      firstSpeaker: 'AI',
      totalQuestionCount: 2,
    },
    languageVariant: {
      title: 'Chloe와 갖고 싶은 초능력 고르기',
      briefing: '영화를 보고 나온 길',
      userOpeningInstruction: null,
      conversationGoal: '초능력 하나를 고른다',
    },
    questions: [
      question('LEVEL_1', 1, 'Wow, that hero movie was so fun!'),
      question('LEVEL_1', 2, 'Okay, imagine you have that power now.'),
    ],
  },
  expressionPayload: [
    expression('LEVEL_1', 'I want to'),
    expression('LEVEL_2_TO_3', 'hands down'),
  ],
  starMessagePayload: [{ starRating: '5', message: '완벽해요' }],
  validationResult: {
    findings: [
      {
        ruleId: 'E-DEDUP-KEY',
        level: 'FAIL',
        path: 'expressions[1]',
        message: '표면 키 겹침',
      },
    ],
    surfaceDuplicates: [],
    semanticDuplicates: [],
    humanOnlyChecks: ['질문 독립성'],
  },
  reviewResult: [],
  reservedExpressionIds: null,
  comments: [],
});

const batch = (status: ContentBatchStatus) => ({
  batch: {
    batchId: 6,
    status,
    startDay: 301,
    endDay: 301,
    dayCount: 1,
    characterRatio: { chloe: 1, marco: 0, teddy: 0 },
    note: null,
    autoProceed: false,
    requestedBy: 12,
    errorMessage: null,
    createdAt: '2026-10-22T09:30:00',
    updatedAt: '2026-10-22T10:05:00',
  },
  days: [],
});

function renderPage(
  draftStatus: ContentDraftStatus = 'REVIEW_READY',
  batchStatus: ContentBatchStatus = 'REVIEW_READY',
) {
  const requests: { method: string; url: string; body: unknown }[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      requests.push({
        method,
        url,
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
      });
      if (url.endsWith('/regenerate'))
        return Response.json({ success: true, data: draft('GENERATING') });
      if (url.endsWith('/review'))
        return Response.json({ success: true, data: draft('NEEDS_FIX') });
      return Response.json({
        success: true,
        data: url.includes('/drafts/')
          ? draft(draftStatus)
          : batch(batchStatus),
      });
    }),
  );
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <DraftDetailPage batchId={6} draftId={601} />
    </QueryClientProvider>,
  );
  return requests;
}

it('질문 줄을 누르면 코멘트에 참조와 대상 경로가 들어가고, 다시 누르면 빠진다', async () => {
  const user = userEvent.setup();
  renderPage();
  const row = await screen.findByRole('button', { name: 'L1 Q2 참조' });

  await user.click(row);

  expect(screen.getByLabelText('검수 코멘트')).toHaveValue('[L1 Q2] ');
  expect(screen.getByLabelText('대상 경로 (선택)')).toHaveValue(
    'questions[LEVEL_1][1]',
  );
  expect(row).toHaveAttribute('aria-pressed', 'true');

  await user.click(row);

  expect(screen.getByLabelText('검수 코멘트')).toHaveValue('');
  expect(screen.getByLabelText('대상 경로 (선택)')).toHaveValue('');
});

it('FIX는 코멘트가 있어야 하고, 저장하면 경로·코멘트를 보내고 입력을 비운다', async () => {
  const user = userEvent.setup();
  const requests = renderPage();
  await screen.findByRole('button', { name: 'L1 Q2 참조' });

  expect(screen.getByRole('button', { name: 'FIX 저장' })).toBeDisabled();

  await user.click(screen.getByRole('button', { name: 'L1 Q2 참조' }));
  await user.type(screen.getByLabelText('검수 코멘트'), '답이 Q1에 기댐');
  await user.click(screen.getByRole('button', { name: 'FIX 저장' }));

  await waitFor(() =>
    expect(requests.find((r) => r.method === 'PUT')).toMatchObject({
      url: '/api/proxy/api/v1/admin/content-batches/6/drafts/601/review',
      body: {
        verdict: 'FIX',
        comments: [
          {
            targetPath: 'questions[LEVEL_1][1]',
            comment: '[L1 Q2] 답이 Q1에 기댐',
          },
        ],
      },
    }),
  );
  await waitFor(() =>
    expect(screen.getByLabelText('검수 코멘트')).toHaveValue(''),
  );
  expect(window.sessionStorage.getItem('content-comment:601')).toBeNull();
});

it('검증기의 전체 순번 경로를 누르면 표현 탭으로 바꾸고 그 줄로 스크롤한다', async () => {
  const user = userEvent.setup();
  renderPage();
  await screen.findByRole('button', { name: 'L1 Q2 참조' });

  await user.click(screen.getByRole('button', { name: 'expressions[1]' }));

  expect(screen.getByRole('tab', { name: '표현 2' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('button', { name: 'E 2 참조' })).toBeInTheDocument();
  expect(scrollIntoView).toHaveBeenCalled();
});

it('재생성을 확인하면 범위를 보내고 그 Day를 "다시 볼 것"으로 기록한다', async () => {
  const user = userEvent.setup();
  const requests = renderPage();
  await screen.findByRole('button', { name: 'L1 Q2 참조' });

  await user.click(screen.getByRole('button', { name: '재생성' }));
  await user.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: '확인',
    }),
  );

  await waitFor(() =>
    expect(requests.find((r) => r.url.endsWith('/regenerate'))).toMatchObject({
      method: 'POST',
      body: { scope: 'ALL' },
    }),
  );
  expect(needsRevisit(601, 'REVIEW_READY')).toBe(true);
});

it('배치가 실패했으면 검수·재생성이 잠기고 이유를 보여 준다', async () => {
  renderPage('OK', 'FAILED');
  await screen.findByRole('button', { name: 'L1 Q2 참조' });

  expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '재생성' })).toBeDisabled();
  expect(
    screen.getByText('배치를 재시작한 뒤 검수할 수 있어요'),
  ).toBeInTheDocument();
});

it('아직 만드는 중인 초안을 열면 열람을 기록하지 않는다', async () => {
  window.localStorage.setItem(
    'content-review:601',
    JSON.stringify({ regeneratedAt: '2026-10-22T10:00:00.000Z' }),
  );
  renderPage('GENERATING');

  await screen.findByRole('status');

  expect(needsRevisit(601, 'REVIEW_READY')).toBe(true);
});
