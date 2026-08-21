// 편지 본문 이미지 업로드 — 발급받은 URL로 브라우저가 스토리지에 직접 올린다 (docs/screens/letters.md "데이터").
// 파일이 우리 서버를 거치지 않으므로 프록시에 업로드 부하가 없고, 대신 CSP에 그 오리진을 열어 줘야 한다
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

type PresignResponse = Schema<'AdminContentImagePresignResponse'>;

const PRESIGN_PATH = '/api/v1/admin/content-images/presigned-url';

/** 사용자 앱이 그릴 수 있는 형식만. BE 허용 목록은 미확정이라 좁게 잡는다 (docs "BE 확인 사항") */
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** 고르자마자 막는다 — 올리고 나서 거절당하면 무엇이 문제인지 알기 어렵다 */
export function checkImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return 'PNG · JPG · WEBP · GIF만 올릴 수 있어요';
  if (file.size > MAX_IMAGE_BYTES) return '5MB 이하만 올릴 수 있어요';
  return null;
}

/**
 * 이미지를 올리고 사용자에게 보여 줄 주소를 돌려준다.
 *
 * 1. 우리 서버(프록시)에 URL 발급 요청 — 여기까지만 관리자 세션이 필요하다
 * 2. 받은 URL로 파일을 직접 PUT — 다른 오리진이라 쿠키는 실리지 않는다(브라우저 기본값)
 */
export async function uploadContentImage(file: File): Promise<string> {
  const presign = await api.post<PresignResponse>(PRESIGN_PATH, {
    fileName: file.name,
    contentType: file.type,
    fileSize: file.size,
  });
  if (!presign?.uploadUrl || !presign.imageUrl)
    throw new Error('업로드 주소를 받지 못했어요');

  const response = await fetch(presign.uploadUrl, {
    method: presign.method ?? 'PUT',
    headers: presign.headers,
    body: file,
  });
  if (!response.ok) throw new Error(`업로드에 실패했어요 (${response.status})`);

  return presign.imageUrl;
}
