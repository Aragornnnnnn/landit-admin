'use client';

// 이미지 파일을 검증하고 업로드 중 편집창의 저장·닫기를 잠근다.
import { useState } from 'react';
import { toast } from 'sonner';

import { uploadContentImage } from '@/features/content-image/api/upload-content-image';
import { reportError } from '@/shared/monitoring/report';

import { validatePopupImage } from './popup-draft';

export function useUploadPopupImage(onUploaded: (imageUrl: string) => void) {
  const [uploading, setUploading] = useState(false);
  async function uploadImage(file: File) {
    const error = validatePopupImage(file);
    if (error) {
      toast.error(error);
      return;
    }
    setUploading(true);
    try {
      onUploaded(await uploadContentImage(file));
    } catch (error) {
      reportError(error);
      toast.error('이미지를 올리지 못했어요. 다시 시도해 주세요.');
    } finally {
      setUploading(false);
    }
  }
  return { uploading, uploadImage };
}
