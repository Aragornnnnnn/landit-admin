// 편지 본문 이미지 규칙 — 사용자 앱이 그릴 수 있는 형식과 BE가 받는 크기만 고르게 한다 (docs/screens/letters.md "데이터")
import { MAX_IMAGE_BYTES } from '@/features/content-image/api/upload-content-image';

/** 사용자 앱이 그릴 수 있는 형식만. BE 허용 목록은 미확정이라 좁게 잡는다 (docs "BE 확인 사항") */
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

/** 고르자마자 막는다 — 올리고 나서 거절당하면 무엇이 문제인지 알기 어렵다 */
export function checkImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return 'PNG · JPG · WEBP · GIF만 올릴 수 있어요';
  if (file.size > MAX_IMAGE_BYTES) return '10MB 이하만 올릴 수 있어요';
  return null;
}
