// 사이드바 내비 정의 — 그룹·순서·라벨·아이콘은 docs/admin-spec.md "셸". 상단바 제목도 여기서 찾는다
// 기존 아이콘은 Figma 셸의 벡터다. 전용 시안이 없는 팝업은 lucide 창 아이콘을 쓴다.
import { PanelsTopLeft } from 'lucide-react';

import {
  AppVersionsIcon,
  ContentProductionIcon,
  DashboardIcon,
  DirectLetterIcon,
  FeedbackIcon,
  LettersIcon,
  NotificationMailIcon,
  PronunciationAssetsIcon,
  PushIcon,
  ReferralIcon,
  ScenarioTestIcon,
  UsersIcon,
} from '../_ui/NavIcons';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** develop 서버에서만 보인다 (시나리오 테스트) */
  developOnly?: boolean;
  /** 배지 — 피드백 처리중 건수 */
  badge?: 'pendingFeedbacks';
  /** 하위 한 단계(상세) 화면의 제목 — 번호를 제목에 넣지 않는 화면만 적는다 */
  detailTitle?: string;
  /** href 밖에 있지만 이 메뉴에 속하는 경로 — 제작 규칙(/content-rules)처럼 메뉴 없이 제목만 "콘텐츠 제작 / …"으로 읽히는 화면 */
  alsoActive?: string[];
  /** 하위 경로의 제목을 경로에서 직접 만든다 — detailTitle로 부족한 다단 화면(배치 #8 / Day 초안) */
  subtitle?: (pathname: string) => string | undefined;
}

export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [{ href: '/', label: '대시보드', icon: DashboardIcon }],
  },
  {
    label: '편지함',
    items: [
      {
        href: '/feedbacks',
        label: '피드백',
        icon: FeedbackIcon,
        badge: 'pendingFeedbacks',
      },
      { href: '/letters', label: '공지·업데이트', icon: LettersIcon },
      // 특정 사용자에게만 가는 편지 — 편지함에 도착하고 푸시는 보내지 않아 알림이 아니라 편지함 그룹이다
      {
        href: '/direct-letters',
        label: '개인 편지',
        icon: DirectLetterIcon,
        detailTitle: '상세',
      },
    ],
  },
  {
    // 편지함은 사용자가 보내고 운영이 답하는 자리, 알림은 운영이 밀어 보내는 자리 — 성격이 달라 그룹을 가른다
    label: '알림',
    items: [
      { href: '/popups', label: '팝업', icon: PanelsTopLeft },
      {
        href: '/notifications',
        label: '이메일·체험 알림',
        icon: NotificationMailIcon,
      },
      {
        href: '/push-campaigns',
        label: '푸시 알림',
        icon: PushIcon,
        // 캠페인 ID는 UUID라 제목에 넣지 않는다
        detailTitle: '상세',
      },
    ],
  },
  {
    label: '사용자',
    items: [
      { href: '/users', label: '사용자', icon: UsersIcon },
      { href: '/referrals', label: '레퍼럴', icon: ReferralIcon },
    ],
  },
  {
    label: '시나리오',
    items: [
      {
        href: '/content-batches',
        label: '콘텐츠 제작',
        icon: ContentProductionIcon,
        alsoActive: ['/content-rules'],
        subtitle: contentSubtitle,
      },
      {
        href: '/scenarios',
        label: '시나리오 목록',
        icon: ScenarioTestIcon,
        developOnly: true,
      },
      {
        href: '/scenario-test',
        label: '시나리오 테스트',
        icon: ScenarioTestIcon,
        developOnly: true,
      },
    ],
  },
  {
    label: '설정',
    items: [
      {
        href: '/pronunciation-assets',
        label: '발음 에셋',
        icon: PronunciationAssetsIcon,
      },
      { href: '/app-versions', label: '앱 버전', icon: AppVersionsIcon },
    ],
  },
];

/** 현재 경로가 이 항목에 속하는가 — `/`는 정확히, 나머지는 하위 경로 포함 */
export function isActiveNav(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** 메뉴 항목이 활성인가 — href와 alsoActive 둘 다 본다 */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  return [item.href, ...(item.alsoActive ?? [])].some((href) =>
    isActiveNav(href, pathname),
  );
}

/** 상단바 제목 — 활성 메뉴의 라벨. 모르는 경로는 빈 문자열 (메뉴 href끼리 중첩되지 않으므로 첫 일치가 답이다) */
export function pageTitleFor(pathname: string): string {
  const match = NAV_GROUPS.flatMap((g) => g.items).find((item) =>
    isNavItemActive(item, pathname),
  );
  if (!match) return '';
  // 하위 화면은 "어디의 무엇"인지로 읽힌다 (Figma "공지·업데이트 / 새 편지")
  const sub =
    SUB_TITLES[pathname] ??
    match.subtitle?.(pathname) ??
    detailTitleFor(match, pathname);
  return sub ? `${match.label} / ${sub}` : match.label;
}

const SUB_TITLES: Record<string, string> = {
  '/letters/new': '새 편지',
  '/direct-letters/new': '새 편지',
  '/push-campaigns/new': '새 푸시',
};

// 메뉴 바로 아래 한 단계(`/push-campaigns/{id}`)만 상세로 본다
function detailTitleFor(item: NavItem, pathname: string): string | undefined {
  if (!item.detailTitle) return undefined;
  const rest = pathname.slice(item.href.length);
  return /^\/[^/]+$/.test(rest) ? item.detailTitle : undefined;
}

/** 현재 BE 호스트가 develop인지 — 시나리오 테스트 메뉴 노출 기준 */
export function isDevelopServer(apiHost: string | undefined): boolean {
  return apiHost?.includes('develop') ?? false;
}

// 콘텐츠 제작 — 배치 번호는 짧은 정수라 제목에 넣는다. Day 번호는 URL의 draftId와 달라 "Day 초안"까지만 (Figma "콘텐츠 제작 › 배치 #8 › Day 301")
function contentSubtitle(pathname: string): string | undefined {
  if (pathname === '/content-rules') return '제작 규칙';
  const match = /^\/content-batches\/(\d+)(\/drafts\/\d+)?$/.exec(pathname);
  if (!match) return undefined;
  return match[2] ? `배치 #${match[1]} / Day 초안` : `배치 #${match[1]}`;
}
