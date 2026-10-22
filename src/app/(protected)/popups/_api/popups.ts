// 팝업 관리 API의 생성된 계약과 관리자 프록시 호출을 연결한다.
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export type Popup = Schema<'AdminPopupResponse'>;
export type PopupCreate = Schema<'AdminPopupCreateRequest'>;
export type PopupPatch = Schema<'AdminPopupPatchRequest'>;
export const POPUPS_KEY = ['admin-popups'] as const;
const PATH = '/api/v1/admin/popups';
export const fetchPopups = () => api.get<Popup[]>(PATH);
export const createPopup = (body: PopupCreate) => api.post<Popup>(PATH, body);
export const patchPopup = (id: number, body: PopupPatch) =>
  api.patch<Popup>(`${PATH}/${id}`, body);
