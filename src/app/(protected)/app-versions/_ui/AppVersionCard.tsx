'use client';

// 플랫폼 한 장 — 앱에서 일어나는 결과별로 묶는다 (Figma 1050:11871).
// 헤더 점이 "지금 앱에 반영 중"과 "저장하지 않은 변경 있음"을 가른다
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

import {
  PLATFORM_LABEL,
  type AppVersionDraft,
  type Platform,
} from '../_model/app-version-draft';
import type { UpdateKind } from '../_model/update-preview';
import { AndroidIcon, AppleIcon } from './PlatformIcons';

interface AppVersionCardProps {
  platform: Platform;
  draft: AppVersionDraft;
  dirty: boolean;
  saving: boolean;
  /** 저장을 막는 이유. 있으면 저장 버튼이 꺼지고 문구가 뜬다 */
  invalidReason: string | null;
  lastEditedLabel: string;
  onChange: (draft: AppVersionDraft) => void;
  onReset: () => void;
  onSave: () => void;
  /** 이 문구가 앱에서 어떻게 보이는지 열어 본다 */
  onPreview: (kind: UpdateKind) => void;
}

const FIELD =
  'h-auto rounded-[10px] border-transparent bg-card px-3.5 py-2.5 text-[14px] shadow-none';

export function AppVersionCard({
  platform,
  draft,
  dirty,
  saving,
  invalidReason,
  lastEditedLabel,
  onChange,
  onReset,
  onSave,
  onPreview,
}: AppVersionCardProps) {
  const set = (patch: Partial<AppVersionDraft>) =>
    onChange({ ...draft, ...patch });

  return (
    <section className="flex w-full flex-col gap-4 rounded-[20px] bg-card px-6 py-5">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[19px] font-bold text-foreground">
          {platform === 'IOS' ? (
            <AppleIcon className="size-5" />
          ) : (
            <AndroidIcon className="size-5" />
          )}
          {PLATFORM_LABEL[platform]}
        </h2>
        <span className="flex items-center gap-1.5 text-[12px] text-subtle">
          <span
            aria-hidden
            className={cn(
              'size-1.5 rounded-full',
              dirty ? 'bg-primary' : 'bg-success',
            )}
          />
          {dirty ? '저장하지 않은 변경 있음' : '앱에 반영 중'}
        </span>
      </header>

      <Group
        title="강제 업데이트"
        description="이 버전보다 낮은 앱은 스토어로만 갈 수 있어요"
        onPreview={() => onPreview('force')}
      >
        <Field label="최소 지원 버전">
          <Input
            value={draft.minimumSupportedVersionName}
            onChange={(event) =>
              set({ minimumSupportedVersionName: event.target.value })
            }
            aria-label={`${PLATFORM_LABEL[platform]} 최소 지원 버전`}
            className={FIELD}
          />
        </Field>
        <Field label="앱에 보여줄 문구">
          <Input
            value={draft.forceUpdateReason}
            onChange={(event) => set({ forceUpdateReason: event.target.value })}
            aria-label={`${PLATFORM_LABEL[platform]} 강제 업데이트 문구`}
            className={FIELD}
          />
        </Field>
      </Group>

      <Group
        title="업데이트 권유 (소프트)"
        description="최소 지원 이상, 최신 미만인 앱에 닫을 수 있는 안내가 떠요"
        onPreview={() => onPreview('soft')}
      >
        <div className="flex gap-3">
          <Field label="최신 버전" className="flex-1">
            <Input
              value={draft.versionName}
              onChange={(event) => set({ versionName: event.target.value })}
              aria-label={`${PLATFORM_LABEL[platform]} 최신 버전`}
              className={FIELD}
            />
          </Field>
          <Field label="빌드 번호" className="flex-1">
            <Input
              value={draft.buildNumber}
              inputMode="numeric"
              onChange={(event) => set({ buildNumber: event.target.value })}
              aria-label={`${PLATFORM_LABEL[platform]} 빌드 번호`}
              className={FIELD}
            />
          </Field>
        </div>
        <Field label="앱에 보여줄 문구">
          <Input
            value={draft.softUpdateReason}
            onChange={(event) => set({ softUpdateReason: event.target.value })}
            aria-label={`${PLATFORM_LABEL[platform]} 업데이트 권유 문구`}
            className={FIELD}
          />
        </Field>
      </Group>

      <Group title="기록" description="판정에는 쓰이지 않아요">
        <Field label="릴리즈 노트">
          <Textarea
            value={draft.releaseNote}
            onChange={(event) => set({ releaseNote: event.target.value })}
            aria-label={`${PLATFORM_LABEL[platform]} 릴리즈 노트`}
            className={cn(FIELD, 'min-h-[76px] resize-none')}
          />
        </Field>
        <Field label="배포일">
          <Input
            type="datetime-local"
            value={draft.releasedAt}
            onChange={(event) => set({ releasedAt: event.target.value })}
            aria-label={`${PLATFORM_LABEL[platform]} 배포일`}
            className={FIELD}
          />
        </Field>
      </Group>

      {invalidReason && dirty && (
        <p role="alert" className="text-[12px] text-destructive">
          {invalidReason}
        </p>
      )}

      <footer className="flex items-center gap-2">
        <span className="text-[12px] text-subtle">{lastEditedLabel}</span>
        <span className="ml-auto flex gap-2">
          {/* 되돌리기는 바꾼 게 있을 때만 — 누를 것이 없는 버튼을 두지 않는다 (프레임) */}
          {dirty && (
            <Button
              variant="secondary"
              onClick={onReset}
              className="h-10 px-4 text-[14px]"
            >
              되돌리기
            </Button>
          )}
          <Button
            disabled={!dirty || saving || Boolean(invalidReason)}
            onClick={onSave}
            className="h-10 px-4 text-[14px]"
          >
            저장
          </Button>
        </span>
      </footer>
    </section>
  );
}

function Group({
  title,
  description,
  onPreview,
  children,
}: {
  title: string;
  description: string;
  /** 없으면 미리보기 링크를 그리지 않는다 — 기록 묶음은 앱에 안 보인다 */
  onPreview?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[14px] bg-background px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-medium text-strong">{title}</span>
          <span className="text-[12px] text-subtle">{description}</span>
        </div>
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="text-[12px] text-body underline-offset-2 hover:underline"
          >
            앱 화면 미리보기
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[12px] text-subtle">{label}</span>
      {children}
    </label>
  );
}
