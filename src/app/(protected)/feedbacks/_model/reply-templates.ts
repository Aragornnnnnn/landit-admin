// 답장 템플릿 — 팀이 확정한 공식 문구(2026-08-26). 문구를 고치려면 이 배열만 바꾸면 된다.
// OO·(괄호) 자리는 채워 넣는 자리 표시다 — 적용한 뒤 본문에서 직접 고친다
export interface ReplyTemplate {
  id: string;
  /** 칩에 보이는 짧은 이름 */
  label: string;
  /** {닉네임} 자리는 적용할 때 실제 닉네임으로 바뀐다 */
  title: string;
  body: string;
}

export const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    id: 'cheer',
    label: '응원 감사',
    title: '따뜻한 응원 감사합니다',
    body: '안녕하세요, 랜딧입니다 🐣\n따뜻한 응원의 말씀 진심으로 감사드립니다 🥰\n보내주신 한마디가 팀에게 정말 큰 힘이 됩니다.\n회원님께서 해외에 무사히 랜딩하시는 그날까지, 랜딧이 곁에서 함께하겠습니다.\n오늘도 즐거운 스피킹 연습 되세요!\n랜딧 팀 드림',
  },
  {
    id: 'feature-received',
    label: '기능 접수',
    title: '소중한 의견 감사합니다',
    body: '안녕하세요, 랜딧입니다.\n소중한 의견 보내주셔서 감사합니다.\n제안해 주신 OO 기능은 내부에서 꼼꼼히 검토한 뒤, 반영이 확정되면 다시 안내드리겠습니다.\n회원님의 목소리가 랜딧을 더 좋게 만듭니다.\n앞으로도 편하게 의견 들려주세요!\n랜딧 팀 드림',
  },
  {
    id: 'feature-shipped',
    label: '기능 반영',
    title: '제안하신 기능이 반영되었어요',
    body: '안녕하세요, 랜딧입니다.\n기다려 주셔서 감사합니다.\n회원님께서 제안해 주신 OO 기능이 이번 업데이트에 반영되었습니다! 🎉\n직접 사용해 보시고 아쉬운 점이 있다면 언제든 편하게 알려주세요.\n앞으로도 회원님의 의견에 귀 기울이는 랜딧이 되겠습니다.\n랜딧 팀 드림',
  },
  {
    id: 'feature-declined',
    label: '반영 어려움',
    title: '제안하신 기능에 대해 안내드립니다',
    body: '안녕하세요, 랜딧입니다.\n소중한 의견 보내주셔서 감사합니다.\n제안해 주신 OO 기능은 내부에서 검토해 보았으나, (현재 서비스 방향과의 차이 / 기술적인 제약)으로 인해 아쉽게도 당장 반영하기는 어려운 상황입니다.\n다만 주신 의견은 잘 기록해 두었으며, 이후 서비스를 개선하는 과정에서 꼭 다시 검토하겠습니다.\n애정 어린 제안에 다시 한번 감사드리며, 앞으로도 많은 관심 부탁드립니다.\n랜딧 팀 드림',
  },
  {
    id: 'bug-checking',
    label: '버그 확인 중',
    title: '제보하신 오류를 확인하고 있습니다',
    body: '안녕하세요, 랜딧입니다.\n이용에 불편을 드려 죄송합니다. 그리고 꼼꼼한 제보 감사드립니다.\n말씀해 주신 오류는 현재 원인을 확인하고 있으며, 수정이 완료되는 대로 다시 안내드리겠습니다.\n최대한 빠르게 해결할 수 있도록 최선을 다하겠습니다.\n랜딧 팀 드림',
  },
  {
    id: 'bug-fixed',
    label: '버그 수정 완료',
    title: '제보하신 오류를 수정했습니다',
    body: '안녕하세요, 랜딧입니다.\n불편을 드려 죄송합니다. 그리고 소중한 제보 진심으로 감사드립니다.🙇🏻\n제보해 주신 오류는 수정하여 서비스에 반영을 완료했습니다.\n혹시 같은 문제가 다시 발생한다면 언제든 알려주세요. 바로 확인하겠습니다.\n랜딧 팀 드림',
  },
  {
    id: 'question',
    label: '문의 답변',
    title: '문의하신 내용에 답변드립니다',
    body: '안녕하세요, 랜딧입니다.\n문의해 주셔서 감사합니다.\n문의하신 내용에 대해 안내드립니다.\n(설명)\n추가로 궁금한 점이 있으시면 언제든 편하게 문의해 주세요.\n감사합니다.\n랜딧 팀 드림',
  },
];

/**
 * 유형에 맞는 기본 템플릿 — 답장 화면을 열면 이 문구가 미리 채워진다.
 * 어드민은 필요한 부분만 고치면 되고, 다른 템플릿은 칩에서 고른다
 */
const TEMPLATE_ID_BY_TYPE: Record<string, string> = {
  QUESTION: 'question',
  CHEER: 'cheer',
  BUG_REPORT: 'bug-checking',
  FEATURE_REQUEST: 'feature-received',
};

export function defaultTemplateFor(
  type: string | undefined,
  templates: ReplyTemplate[],
): ReplyTemplate | null {
  if (!type) return null;
  const id = TEMPLATE_ID_BY_TYPE[type];
  // 커스텀 목록에서 그 템플릿을 지웠을 수 있다 — 그럼 빈 폼으로 시작한다
  return templates.find((one) => one.id === id) ?? null;
}

/** 빈 닉네임이면 "회원"으로 — 빈 칸으로 두면 "님, 안녕하세요"처럼 문장이 깨진다 */
const FALLBACK_NAME = '회원';

export function fillTemplate(
  template: ReplyTemplate,
  nickname: string | undefined,
): { title: string; bodyText: string } {
  const name = nickname || FALLBACK_NAME;
  return {
    title: template.title.replaceAll('{닉네임}', name),
    bodyText: template.body.replaceAll('{닉네임}', name),
  };
}
