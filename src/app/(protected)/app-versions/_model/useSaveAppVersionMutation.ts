'use client';

// 앱 버전 정책 저장 — 플랫폼별로 따로 저장한다(PATCH admin/app-versions/{platform}). 읽기는 features/app-version
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  APP_VERSIONS_PATH,
  type AppVersion,
  type Platform,
} from '@/features/app-version/api/app-version';
import { APP_VERSIONS_KEY } from '@/features/app-version/model/useAppVersionsQuery';
import { api } from '@/shared/api/client';
import { reportError } from '@/shared/monitoring/report';

import { toAppVersionRequest, type AppVersionDraft } from './app-version-draft';

export function useSaveAppVersionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      platform,
      draft,
    }: {
      platform: Platform;
      draft: AppVersionDraft;
    }) =>
      api.patch<AppVersion>(
        `${APP_VERSIONS_PATH}/${platform}`,
        toAppVersionRequest(draft),
      ),
    onSuccess: () => {
      toast.success('저장했어요. 앱에 바로 반영돼요');
      queryClient.invalidateQueries({ queryKey: APP_VERSIONS_KEY });
    },
    onError: (error) => {
      reportError(error);
      toast.error('저장 안 됨 · 다시 시도해 주세요');
    },
  });
}
