'use client';

// 앱 버전 정책 읽기·저장 — 플랫폼별로 따로 저장한다(PATCH admin/app-versions/{platform})
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api } from '@/shared/api/client';
import { reportError } from '@/shared/monitoring/report';

import {
  toAppVersionRequest,
  type AppVersion,
  type AppVersionDraft,
  type Platform,
} from './app-version-draft';

const PATH = '/api/v1/admin/app-versions';

export function useAppVersionsQuery() {
  return useQuery({
    queryKey: ['app-versions'] as const,
    queryFn: () => api.get<AppVersion[]>(PATH),
  });
}

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
      api.patch<AppVersion>(`${PATH}/${platform}`, toAppVersionRequest(draft)),
    onSuccess: () => {
      toast.success('저장했어요. 앱에 바로 반영돼요');
      queryClient.invalidateQueries({ queryKey: ['app-versions'] });
    },
    onError: (error) => {
      reportError(error);
      toast.error('저장 안 됨 · 다시 시도해 주세요');
    },
  });
}
