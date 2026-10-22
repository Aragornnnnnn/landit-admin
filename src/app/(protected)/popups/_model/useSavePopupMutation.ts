'use client';

// 팝업 저장 후 목록을 갱신하고 실패 시 입력을 유지한다.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { reportError } from '@/shared/monitoring/report';

import {
  createPopup,
  patchPopup,
  POPUPS_KEY,
  type Popup,
} from '../_api/popups';
import { toPopupRequest, type PopupDraft } from './popup-draft';

export function useSavePopupMutation(onSaved: () => void) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      draft,
      original,
    }: {
      draft: PopupDraft;
      original?: Popup;
    }) =>
      original
        ? patchPopup(original.popupId, toPopupRequest(draft, original))
        : createPopup(toPopupRequest(draft)),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: POPUPS_KEY });
      toast.success('팝업 설정을 저장했어요.');
      onSaved();
    },
    onError: (error) => {
      reportError(error);
      toast.error('저장하지 못했어요. 입력을 확인하고 다시 시도해 주세요.');
    },
  });
}
