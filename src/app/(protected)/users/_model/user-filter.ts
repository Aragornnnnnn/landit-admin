// 사용자 목록 필터 — BE에 검색·필터가 없어 불러온 목록에서 우리가 거른다 (docs/screens/users.md).
// 그래서 이 파일이 곧 "검색 기능"이다. BE 검색이 생기면 여기를 서버 쿼리로 바꾼다
import type { Schema } from '@/shared/api/schema-patch';

type AdminUserListItem = Schema<'AdminUserListItem'>;

export type UserRole = NonNullable<AdminUserListItem['role']>;
export type UserStatus = NonNullable<AdminUserListItem['status']>;

export interface UserFilter {
  keyword: string;
  /** 없으면 전체 */
  role?: UserRole;
  status?: UserStatus;
  /** 0부터 — 로컬 페이징 */
  page: number;
}

export const USERS_PAGE_SIZE = 20;
/** 한 번에 받아 오는 크기 — hasNext가 false일 때까지 이어서 받는다 */
export const USERS_FETCH_SIZE = 50;

export const DEFAULT_USER_FILTER: UserFilter = { keyword: '', page: 0 };

const ROLES: UserRole[] = ['USER', 'ADMIN'];
const STATUSES: UserStatus[] = ['ACTIVE', 'WITHDRAWN', 'BANNED'];

export function readUserFilter(
  params: ReadonlyURLSearchParamsLike,
): UserFilter {
  const role = params.get('role') ?? '';
  const status = params.get('status') ?? '';
  const page = Number(params.get('page'));
  return {
    keyword: params.get('keyword') ?? '',
    role: ROLES.includes(role as UserRole) ? (role as UserRole) : undefined,
    status: STATUSES.includes(status as UserStatus)
      ? (status as UserStatus)
      : undefined,
    page: Number.isInteger(page) && page > 0 ? page : 0,
  };
}

export function writeUserFilter(filter: UserFilter): string {
  const params = new URLSearchParams();
  if (filter.keyword) params.set('keyword', filter.keyword);
  if (filter.role) params.set('role', filter.role);
  if (filter.status) params.set('status', filter.status);
  if (filter.page > 0) params.set('page', String(filter.page));
  return params.toString();
}

/** 조건을 바꾸면 첫 페이지로 — 3페이지를 보다 조건을 바꾸면 결과가 3페이지보다 적을 수 있다 */
export function changeUserFilter(
  filter: UserFilter,
  patch: Partial<UserFilter>,
): UserFilter {
  const onlyPage = Object.keys(patch).length === 1 && patch.page !== undefined;
  return { ...filter, ...patch, page: onlyPage ? patch.page! : 0 };
}

/** 이메일·닉네임을 대소문자 없이 부분 일치로 찾는다 — 어드민이 아는 건 보통 이메일 앞부분이다 */
export function filterUsers(
  users: AdminUserListItem[],
  filter: UserFilter,
): AdminUserListItem[] {
  const keyword = filter.keyword.trim().toLowerCase();
  return users.filter((user) => {
    if (filter.role && user.role !== filter.role) return false;
    if (filter.status && user.status !== filter.status) return false;
    if (!keyword) return true;
    return (
      (user.email ?? '').toLowerCase().includes(keyword) ||
      (user.nickname ?? '').toLowerCase().includes(keyword)
    );
  });
}

/** 로컬 페이징 — 지금 페이지에 그릴 몫만 자른다 */
export function pageOfUsers(
  users: AdminUserListItem[],
  page: number,
): AdminUserListItem[] {
  const from = page * USERS_PAGE_SIZE;
  return users.slice(from, from + USERS_PAGE_SIZE);
}

export const hasActiveUserFilter = (filter: UserFilter) =>
  Boolean(filter.keyword || filter.role || filter.status);

interface ReadonlyURLSearchParamsLike {
  get(key: string): string | null;
}
