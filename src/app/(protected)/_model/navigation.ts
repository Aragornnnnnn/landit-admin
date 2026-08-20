// 사이드바 내비 정의 — 그룹·순서·라벨·아이콘은 docs/admin-spec.md "셸". 상단바 제목도 여기서 찾는다
import {
  FlaskConical,
  Home,
  Mail,
  Megaphone,
  Smartphone,
  User,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
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
    items: [{ href: '/', label: '대시보드', icon: Home }],
  },
  {
    label: '편지함',
    items: [
      {
        href: '/feedbacks',
        label: '피드백',
        icon: Mail,
        badge: 'pendingFeedbacks',
      },
      { href: '/letters', label: '공지·업데이트', icon: Megaphone },
    ],
  },
  {
    label: '사용자',
    items: [{ href: '/users', label: '사용자', icon: User }],
  },
  {
    label: '설정',
    items: [
      { href: '/app-versions', label: '앱 버전', icon: Smartphone },
      {
        href: '/scenario-test',
        label: '시나리오 테스트',
        icon: FlaskConical,
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
  return match?.label ?? '';
}

/** 현재 BE 호스트가 develop인지 — 시나리오 테스트 메뉴 노출 기준 */
export function isDevelopServer(apiHost: string | undefined): boolean {
  return apiHost?.includes('develop') ?? false;
}
