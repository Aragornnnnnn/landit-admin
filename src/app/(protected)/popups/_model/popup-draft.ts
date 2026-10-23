// 팝업 폼을 한국 시간으로 변환하고 변경한 필드만 서버에 보낸다.
import { MAX_IMAGE_BYTES } from '@/features/content-image/api/upload-content-image';

import type { Popup, PopupCreate, PopupPatch } from '../_api/popups';

export type PopupDraft = Omit<
  PopupCreate,
  'priority' | 'linkUrl' | 'excludedUserIds' | 'excludedAudiences'
> & {
  excludedUserIds: number[];
  excludedAudiences: NonNullable<PopupCreate['excludedAudiences']>;
  priority: string;
  linkUrl: string;
};
export const EMPTY_POPUP: PopupDraft = {
  title: '',
  imageUrl: '',
  linkUrl: '',
  enabled: false,
  startsAt: '',
  endsAt: '',
  priority: '0',
  excludedUserIds: [],
  excludedAudiences: [],
};
export const toKstInput = (iso: string) =>
  new Date(Date.parse(iso) + 9 * 3600000).toISOString().slice(0, 16);
export function toPopupDraft(popup: Popup): PopupDraft {
  return {
    excludedUserIds: popup.excludedUserIds ?? [],
    excludedAudiences: popup.excludedAudiences ?? [],
    title: popup.title,
    imageUrl: popup.imageUrl,
    linkUrl: popup.linkUrl ?? '',
    enabled: popup.enabled,
    startsAt: toKstInput(popup.startsAt),
    endsAt: toKstInput(popup.endsAt),
    priority: String(popup.priority),
  };
}
export function toPopupRequest(draft: PopupDraft): PopupCreate;
export function toPopupRequest(draft: PopupDraft, original: Popup): PopupPatch;
export function toPopupRequest(
  draft: PopupDraft,
  original?: Popup,
): PopupCreate | PopupPatch {
  const initial = original && toPopupDraft(original);
  const body: PopupCreate = {
    ...draft,
    title: draft.title.trim(),
    imageUrl: draft.imageUrl.trim(),
    linkUrl: draft.linkUrl.trim() || null,
    priority: Number(draft.priority),
    startsAt:
      original && draft.startsAt === initial?.startsAt
        ? original.startsAt
        : new Date(`${draft.startsAt}+09:00`).toISOString(),
    endsAt:
      original && draft.endsAt === initial?.endsAt
        ? original.endsAt
        : new Date(`${draft.endsAt}+09:00`).toISOString(),
  };
  return initial
    ? Object.fromEntries(
        Object.entries(body).filter(([key]) =>
          key === 'excludedUserIds'
            ? draft.excludedUserIds.length !== initial.excludedUserIds.length ||
              draft.excludedUserIds.some(
                (id) => !initial.excludedUserIds.includes(id),
              )
            : key === 'excludedAudiences'
              ? draft.excludedAudiences.length !==
                  initial.excludedAudiences.length ||
                draft.excludedAudiences.some(
                  (audience) => !initial.excludedAudiences.includes(audience),
                )
              : draft[key as keyof PopupDraft] !==
                initial[key as keyof PopupDraft],
        ),
      )
    : body;
}
export function validatePopupDraft(
  draft: PopupDraft,
  original?: Popup,
): string | null {
  if (!draft.title.trim() || draft.title.trim().length > 200)
    return '제목을 1~200자로 입력해 주세요.';
  if (!isPopupUrl(draft.imageUrl.trim(), false))
    return '이미지는 HTTPS 주소를 입력해 주세요.';
  if (draft.linkUrl.trim() && !isPopupUrl(draft.linkUrl.trim(), true))
    return '링크는 HTTPS 주소 또는 /로 시작하는 앱 경로를 입력해 주세요.';
  const initial = original && toPopupDraft(original);
  const start = Date.parse(
    original && draft.startsAt === initial?.startsAt
      ? original.startsAt
      : `${draft.startsAt}+09:00`,
  );
  const end = Date.parse(
    original && draft.endsAt === initial?.endsAt
      ? original.endsAt
      : `${draft.endsAt}+09:00`,
  );
  if (
    (!original ||
      draft.startsAt !== initial?.startsAt ||
      draft.endsAt !== initial?.endsAt) &&
    (!Number.isFinite(start) || !Number.isFinite(end) || start >= end)
  )
    return '종료 시각은 시작 시각보다 늦어야 해요.';
  if (!/^\d+$/.test(draft.priority) || Number(draft.priority) > 2147483647)
    return '우선순위는 0~2147483647 사이 정수예요.';
  return null;
}
function isPopupUrl(value: string, appPath: boolean): boolean {
  if (!value || value.length > 2048 || /[\s\\]/.test(value)) return false;
  try {
    const url = new URL(value, 'https://landit.im');
    if (appPath && value.startsWith('/') && !value.startsWith('//'))
      return true;
    return (
      value.startsWith('https://') &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
export function validatePopupImage(
  file: Pick<File, 'name' | 'type' | 'size'>,
): string | null {
  const extensions: Record<string, RegExp> = {
    'image/png': /\.png$/i,
    'image/jpeg': /\.jpe?g$/i,
    'image/webp': /\.webp$/i,
  };
  return file.size > 0 &&
    file.size <= MAX_IMAGE_BYTES &&
    extensions[file.type]?.test(file.name)
    ? null
    : 'PNG·JPEG·WebP 이미지(0바이트 초과, 10 MiB 이하)를 선택해 주세요.';
}

/** 사용자 숨김 배열의 선택 순서와 관계없이 실제 변경 여부를 판단한다. */
export function hasPopupChanges(
  draft: PopupDraft,
  initial: PopupDraft,
): boolean {
  const normalize = (value: PopupDraft) => ({
    ...value,
    excludedUserIds: [...value.excludedUserIds].sort((a, b) => a - b),
    excludedAudiences: [...value.excludedAudiences].sort(),
  });
  return (
    JSON.stringify(normalize(draft)) !== JSON.stringify(normalize(initial))
  );
}
