// 사이드바 내비 정의 — 그룹·순서·라벨·아이콘은 docs/admin-spec.md "셸". 상단바 제목도 여기서 찾는다
// 아이콘은 Figma 셸의 채움형 벡터를 그대로 옮긴 것 (NavIcons.tsx) — lucide가 아니다
import {
  AppVersionsIcon,
  DashboardIcon,
  FeedbackIcon,
  LettersIcon,
  ScenarioTestIcon,
  UsersIcon,
} from '../_ui/NavIcons';

export interface NavItem {
  href: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  /** develop 서버에서만 보인다 (시나리오 테스트) */
  developOnly?: boolean;
  /** 배지 — 피드백 처리중 건수 */
  badge?: 'pendingFeedbacks';
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
    ],
  },
  {
    label: '사용자',
    items: [{ href: '/users', label: '사용자', icon: UsersIcon }],
  },
  {
    label: '설정',
    items: [
      { href: '/app-versions', label: '앱 버전', icon: AppVersionsIcon },
      {
        href: '/scenario-test',
        label: '시나리오 테스트',
        icon: ScenarioTestIcon,
        developOnly: true,
      },
    ],
  },
];

/** 현재 경로가 이 항목에 속하는가 — `/`는 정확히, 나머지는 하위 경로 포함 */
export function isActiveNav(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** 상단바 제목 — 활성 메뉴의 라벨. 모르는 경로는 빈 문자열 (메뉴 href끼리 중첩되지 않으므로 첫 일치가 답이다) */
export function pageTitleFor(pathname: string): string {
  const match = NAV_GROUPS.flatMap((g) => g.items).find((item) =>
    isActiveNav(item.href, pathname),
  );
  if (!match) return '';
  // 하위 화면은 "어디의 무엇"인지로 읽힌다 (Figma "공지·업데이트 / 새 편지")
  const sub = SUB_TITLES[pathname];
  return sub ? `${match.label} / ${sub}` : match.label;
}

const SUB_TITLES: Record<string, string> = {
  '/letters/new': '새 편지',
};

/** 현재 BE 호스트가 develop인지 — 시나리오 테스트 메뉴 노출 기준 */
export function isDevelopServer(apiHost: string | undefined): boolean {
  return apiHost?.includes('develop') ?? false;
}
