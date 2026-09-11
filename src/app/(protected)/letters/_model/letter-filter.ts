// 목록 필터 ↔ 쿼리스트링 — 편지는 탭(공개 상태)과 타입 둘뿐이다. 새로고침·공유에 살아남게 URL이 진실이다
// (docs/screens/letters.md, docs/admin-spec.md "공통 상태")
import type {
  LetterStatus,
  LetterType,
} from '@/features/letter/api/letter-list';

/** 목록 상단 탭 — 공개 상태 하나를 고르거나 전체 */
export type LetterTab = 'ALL' | LetterStatus;

export interface LetterFilter {
  tab: LetterTab;
  /** 없으면 전체(답장 제외) */
  type?: LetterType;
}

export const DEFAULT_LETTER_FILTER: LetterFilter = { tab: 'ALL' };

/**
 * 한 번에 받아 오는 최대 건수. 프레임에 페이지네이션이 없고 운영이 쓰는 편지는 몇십 건 규모라 한 번에 받는다.
 * 이 수를 넘으면 목록이 조용히 잘리므로, 그때는 페이지네이션을 붙여야 한다 (docs/screens/letters.md "열린 질문")
 */
export const LETTER_FETCH_SIZE = 100;

export const LETTER_TABS: { value: LetterTab; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'DRAFT', label: '임시저장' },
  { value: 'PUBLISHED', label: '발행됨' },
  { value: 'UNPUBLISHED', label: '숨김' },
];

/** 그룹 카드 — 프레임 순서 그대로. 탭이 전체면 셋 다, 아니면 고른 하나만 그린다 */
export const LETTER_GROUPS = [
  {
    status: 'PUBLISHED',
    title: '지금 편지함에 보이는 편지',
    empty: '아직 발행한 편지가 없어요',
  },
  { status: 'DRAFT', title: '임시저장', empty: '임시저장한 편지가 없어요' },
  { status: 'UNPUBLISHED', title: '숨김', empty: '숨긴 편지가 없어요' },
] as const satisfies readonly {
  status: LetterStatus;
  title: string;
  empty: string;
}[];

export type LetterGroup = (typeof LETTER_GROUPS)[number];

export function visibleLetterGroups(tab: LetterTab): readonly LetterGroup[] {
  return tab === 'ALL'
    ? LETTER_GROUPS
    : LETTER_GROUPS.filter((group) => group.status === tab);
}

const TABS = LETTER_TABS.map((tab) => tab.value);
const TYPES: LetterType[] = ['NOTICE', 'UPDATE', 'REPLY'];

/** URL을 필터로 읽는다. 모르는 값은 기본값으로 되돌린다 — 주소를 손으로 고쳐도 화면이 깨지지 않게 */
export function readLetterFilter(
  params: ReadonlyURLSearchParamsLike,
): LetterFilter {
  const tab = params.get('tab') ?? '';
  const type = params.get('type') ?? '';
  return {
    tab: TABS.includes(tab as LetterTab)
      ? (tab as LetterTab)
      : DEFAULT_LETTER_FILTER.tab,
    type: TYPES.includes(type as LetterType) ? (type as LetterType) : undefined,
  };
}

/** 필터를 쿼리스트링으로 — 기본값은 적지 않는다. 주소가 짧을수록 공유·비교가 쉽다 */
export function writeLetterFilter(filter: LetterFilter): string {
  const params = new URLSearchParams();
  if (filter.tab !== DEFAULT_LETTER_FILTER.tab) params.set('tab', filter.tab);
  if (filter.type) params.set('type', filter.type);
  return params.toString();
}

// next/navigation의 ReadonlyURLSearchParams를 그대로 받기 위한 최소 계약
interface ReadonlyURLSearchParamsLike {
  get(key: string): string | null;
}
