// 공지·업데이트 공식 템플릿 — 팀이 확정한 문구(2026-08-26)를 편지 초안 모양으로 둔다.
// OO·(괄호)·X 표시는 채워 넣는 자리다 — 적용한 뒤 에디터에서 직접 고친다
import type { LetterDraft } from './letter-draft';
import type { LetterType } from './letter-filter';

export interface LetterTemplate {
  id: string;
  /** 칩에 보이는 짧은 이름 */
  label: string;
  type: LetterType;
  title: string;
  preview: string;
  contentBlocks: LetterDraft['contentBlocks'];
}

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'notice',
    label: '일반 공지',
    type: 'NOTICE',
    title: '[공지] (제목)',
    preview: '(한 줄 요약)',
    contentBlocks: [
      { type: 'PARAGRAPH', text: '안녕하세요, 랜딧입니다.' },
      { type: 'PARAGRAPH', text: '(내용)' },
      {
        type: 'PARAGRAPH',
        text: '앞으로도 더 나은 서비스로 보답하겠습니다.\n감사합니다.\n랜딧 팀 드림',
      },
    ],
  },
  {
    id: 'update',
    label: '기능 업데이트',
    type: 'UPDATE',
    title: '[업데이트] OO 기능이 새로 추가되었어요! 🎉',
    preview: 'OO 기능이 새로 추가되었어요',
    contentBlocks: [
      {
        type: 'PARAGRAPH',
        text: '안녕하세요, 랜딧입니다.\n회원님들의 영어 스피킹에 도움이 될 새로운 기능을 소개합니다.',
      },
      { type: 'PARAGRAPH', text: '✨ 무엇이 달라졌나요?' },
      {
        type: 'ORDERED_LIST',
        items: [
          'OO 기능: (기능에 대한 한 줄 설명)',
          '(추가 변경 사항이 있다면 여기에)',
        ],
      },
      { type: 'PARAGRAPH', text: '📍 이렇게 사용해 보세요' },
      {
        type: 'ORDERED_LIST',
        items: [
          '(사용 방법 또는 진입 경로: 예) 홈 화면 > OO 탭에서 바로 만나보실 수 있어요)',
        ],
      },
      {
        type: 'PARAGRAPH',
        text: "이번 업데이트는 회원님들께서 보내주신 소중한 의견을 바탕으로 준비했습니다.\n사용해 보시고 느낀 점이 있다면 '피드백 보내기'로 언제든 알려주세요!\n랜딧 팀 드림",
      },
    ],
  },
  {
    id: 'maintenance',
    label: '점검 공지',
    type: 'NOTICE',
    title: '[공지] 서비스 점검 안내 (X월 X일)',
    preview: '서비스 점검 안내 — 일시와 영향을 확인해 주세요',
    contentBlocks: [
      {
        type: 'PARAGRAPH',
        text: '안녕하세요, 랜딧입니다.\n더 안정적인 서비스 제공을 위해 아래와 같이 시스템 점검을 진행합니다.',
      },
      { type: 'PARAGRAPH', text: '📍 점검 안내' },
      {
        type: 'ORDERED_LIST',
        items: [
          '일시: 202X년 X월 X일(X) 00:00 ~ 00:00 (약 X시간)',
          '내용: (점검 내용)',
          '영향: 점검 시간 동안 앱 접속 및 서비스 이용이 제한됩니다',
        ],
      },
      { type: 'PARAGRAPH', text: '🚨 참고해 주세요' },
      {
        type: 'ORDERED_LIST',
        items: [
          '작업 상황에 따라 점검 시간이 변경될 수 있으며, 변경 시 공지로 다시 안내드리겠습니다.',
          '점검 중에는 문의 답변이 평소보다 지연될 수 있습니다.',
        ],
      },
      {
        type: 'PARAGRAPH',
        text: '이용에 불편을 드려 죄송합니다.\n점검이 끝나고 더 쾌적한 환경에서 뵙겠습니다.☺️\n랜딧 팀 드림',
      },
    ],
  },
];

/**
 * 템플릿을 초안에 적용한다 — 유형·제목·미리보기·본문이 통째로 바뀌고 고정은 푼다.
 * 이전 편지의 고정 상태를 템플릿으로 새로 쓰는 편지가 물려받으면 안 된다
 */
export function applyLetterTemplate(
  draft: LetterDraft,
  template: LetterTemplate,
): LetterDraft {
  return {
    ...draft,
    type: template.type,
    title: template.title,
    preview: template.preview,
    pinned: false,
    // 편집 중 블록 배열을 공유하면 안 된다 — 깊은 복사로 넘긴다
    contentBlocks: structuredClone(template.contentBlocks),
  };
}
