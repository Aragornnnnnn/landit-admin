// 사용자 검색 URL과 서버 페이지 요청을 구성한다.
import type { UserListItem } from '@/features/user/api/user-list';

export type UserRole = NonNullable<UserListItem['role']>;
export type UserStatus = NonNullable<UserListItem['status']>;

export interface UserFilter {
  keyword: string;
  /** 없으면 전체 */
  role?: UserRole;
  status?: UserStatus;
  /** 0부터 시작하는 서버 페이지 */
  page: number;
}

export const USERS_PAGE_SIZE = 20;

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

/** 서버에서 검색·필터를 적용한 뒤 요청한 페이지를 반환하도록 조건을 만든다. */
export function userSearchParams(filter: UserFilter): URLSearchParams {
  const params = new URLSearchParams(
    writeUserFilter({ ...filter, keyword: filter.keyword.trim() }),
  );
  params.set('page', String(filter.page));
  params.set('size', String(USERS_PAGE_SIZE));
  return params;
}

export const hasActiveUserFilter = (filter: UserFilter) =>
  Boolean(filter.keyword.trim() || filter.role || filter.status);

interface ReadonlyURLSearchParamsLike {
  get(key: string): string | null;
}
