'use client';

// 앱 버전 정책 화면 — 데스크톱은 두 플랫폼을 나란히, 모바일은 탭으로 하나씩 (Figma 1050:11871 · 12047).
// 저장하면 앱에 바로 반영되므로 저장 전에 무슨 일이 일어나는지 한 문장으로 묻는다
import { useState } from 'react';

import type {
  AppVersion,
  Platform,
} from '@/features/app-version/api/app-version';
import {
  PLATFORM_LABEL,
  PLATFORMS,
} from '@/features/app-version/model/platform';
import { useAppVersionsQuery } from '@/features/app-version/model/useAppVersionsQuery';
import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format-time';
import { useIsMobile } from '@/shared/lib/use-mobile';
import { InlineError } from '@/shared/ui/InlineError';
import { ListSkeleton } from '@/shared/ui/ListSkeleton';

import {
  EMPTY_APP_VERSION_DRAFT,
  isSameVersionDraft,
  toAppVersionDraft,
  validateAppVersionDraft,
  type AppVersionDraft,
} from '../_model/app-version-draft';
import type { UpdateKind } from '../_model/update-preview';
import { useSaveAppVersionMutation } from '../_model/useSaveAppVersionMutation';
import { AppVersionCard } from './AppVersionCard';
import { AndroidIcon, AppleIcon } from './PlatformIcons';
import { SaveVersionDialog } from './SaveVersionDialog';
import { UpdatePreviewDialog } from './UpdatePreviewDialog';

export function AppVersionsPage() {
  const versions = useAppVersionsQuery();

  if (versions.isPending) return <ListSkeleton rows={6} className="pt-4" />;
  if (versions.isError)
    return (
      <InlineError
        message="앱 버전 정책을 불러오지 못했어요"
        onRetry={() => versions.refetch()}
      />
    );

  // 서버 값이 도착한 뒤 마운트한다 — 초안의 초기값이 곧 서버 값이 되게
  return <Editor versions={versions.data ?? []} />;
}

function Editor({ versions }: { versions: AppVersion[] }) {
  const isMobile = useIsMobile();
  const save = useSaveAppVersionMutation();
  const saved = Object.fromEntries(
    PLATFORMS.map((platform) => [platform, findDraft(versions, platform)]),
  ) as Record<Platform, AppVersionDraft>;

  const [drafts, setDrafts] = useState(saved);
  const [tab, setTab] = useState<Platform>('IOS');
  const [asking, setAsking] = useState<Platform | null>(null);
  // 미리보기는 좁은 화면에선 고른 한 종류만 본다 (프레임 1050:12325)
  const [previewing, setPreviewing] = useState<{
    platform: Platform;
    kind: UpdateKind;
  } | null>(null);

  const shown = isMobile ? [tab] : PLATFORMS;

  const runSave = (platform: Platform) =>
    save.mutate(
      { platform, draft: drafts[platform] },
      { onSuccess: () => setAsking(null) },
    );

  return (
    <div className="flex flex-col gap-4 pt-1 pb-12">
      <p className="text-[13px] text-subtle">
        저장하면 앱에 바로 반영돼요. 앱은 켜질 때 자기 버전을 아래 기준과
        비교해서 강제 업데이트 / 권유 / 없음 중 하나를 보여줘요.
      </p>

      {isMobile && (
        <div role="tablist" className="flex gap-1 rounded-xl bg-card p-1">
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              type="button"
              role="tab"
              aria-selected={tab === platform}
              onClick={() => setTab(platform)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-[14px] font-medium text-subtle transition-colors',
                tab === platform && 'bg-muted text-strong',
              )}
            >
              {platform === 'IOS' ? (
                <AppleIcon className="size-4" />
              ) : (
                <AndroidIcon className="size-4" />
              )}
              {PLATFORM_LABEL[platform]}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        {shown.map((platform) => {
          const draft = drafts[platform];
          return (
            <AppVersionCard
              key={platform}
              platform={platform}
              draft={draft}
              dirty={!isSameVersionDraft(draft, saved[platform])}
              saving={save.isPending}
              invalidReason={validateAppVersionDraft(draft)}
              lastEditedLabel={lastEditedLabel(versions, platform)}
              onChange={(next) =>
                setDrafts((current) => ({ ...current, [platform]: next }))
              }
              onReset={() =>
                setDrafts((current) => ({
                  ...current,
                  [platform]: saved[platform],
                }))
              }
              onSave={() => setAsking(platform)}
              onPreview={(kind) => setPreviewing({ platform, kind })}
            />
          );
        })}
      </div>

      <UpdatePreviewDialog
        platform={previewing?.platform ?? null}
        draft={previewing ? drafts[previewing.platform] : undefined}
        only={isMobile ? previewing?.kind : undefined}
        onClose={() => setPreviewing(null)}
      />

      <SaveVersionDialog
        platform={asking}
        draft={asking ? drafts[asking] : undefined}
        pending={save.isPending}
        onCancel={() => setAsking(null)}
        onConfirm={() => asking && runSave(asking)}
      />
    </div>
  );
}

const findDraft = (versions: AppVersion[], platform: Platform) => {
  const found = versions.find((version) => version.platform === platform);
  return found ? toAppVersionDraft(found) : EMPTY_APP_VERSION_DRAFT;
};

// 프레임의 "마지막 수정 08.12 10:31 · 김준서" — BE가 수정 시각·수정자 닉네임을 준다(LAN-337)
function lastEditedLabel(versions: AppVersion[], platform: Platform): string {
  const found = versions.find((version) => version.platform === platform);
  if (!found?.updatedAt) return '';
  const at = `마지막 수정 ${formatDateTime(found.updatedAt)}`;
  return found.updatedBy ? `${at} · ${found.updatedBy}` : at;
}
