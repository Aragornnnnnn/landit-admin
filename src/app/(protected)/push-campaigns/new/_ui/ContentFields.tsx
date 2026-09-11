'use client';

// 내용 카드 — 제목 · 본문 · 딥 링크 · UTM 자동 붙이기 (Figma 2177:285)
import { toast } from 'sonner';

import {
  UTM_MEDIUM,
  UTM_SOURCE,
} from '@/features/push-campaign/model/deep-link';
import { cn } from '@/shared/lib/cn';
import { Input } from '@/shared/ui/shadcn/input';
import { Switch } from '@/shared/ui/shadcn/switch';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import {
  BODY_MAX,
  finalDeepLink,
  TITLE_MAX,
  withTitle,
  type CampaignDraft,
  type DraftErrors,
} from '../_model/campaign-draft';

interface ContentFieldsProps {
  draft: CampaignDraft;
  /** 저장을 눌러 본 뒤에만 오류를 보여 준다 — 쓰기 시작하자마자 빨개지지 않게 */
  errors: DraftErrors;
  onChange: (draft: CampaignDraft) => void;
}

const FIELD =
  'h-auto rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] shadow-none placeholder:text-subtle';

export function ContentFields({ draft, errors, onChange }: ContentFieldsProps) {
  const link = finalDeepLink(draft);

  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card p-6">
      <h2 className="text-[16px] font-bold text-strong">내용</h2>

      <Field
        label="제목"
        error={errors.title}
        counter={`${draft.title.length} / ${TITLE_MAX}`}
        over={draft.title.length > TITLE_MAX}
      >
        <Input
          value={draft.title}
          onChange={(event) => onChange(withTitle(draft, event.target.value))}
          aria-label="제목"
          aria-invalid={Boolean(errors.title)}
          className={FIELD}
        />
      </Field>

      <Field
        label="본문"
        error={errors.body}
        counter={`${draft.body.length} / ${BODY_MAX}`}
        over={draft.body.length > BODY_MAX}
      >
        <Textarea
          value={draft.body}
          onChange={(event) => onChange({ ...draft, body: event.target.value })}
          aria-label="본문"
          aria-invalid={Boolean(errors.body)}
          rows={2}
          className={cn(FIELD, 'min-h-0 resize-none')}
        />
      </Field>

      <Field label="딥 링크" error={errors.deepLink}>
        <Input
          value={draft.deepLink}
          onChange={(event) =>
            onChange({ ...draft, deepLink: event.target.value })
          }
          placeholder="/home 또는 https://…"
          aria-label="딥 링크"
          aria-invalid={Boolean(errors.deepLink)}
          className={cn(FIELD, 'font-mono text-[13px]')}
        />
      </Field>

      <div className="flex flex-col gap-2.5 rounded-xl border border-hairline bg-background px-3.5 py-3">
        <label className="flex items-center gap-2.5">
          <Switch
            checked={draft.utmEnabled}
            onCheckedChange={(utmEnabled) => onChange({ ...draft, utmEnabled })}
            aria-label="UTM 자동 붙이기"
          />
          <span className="text-[13px] font-medium text-strong">
            UTM 자동 붙이기
          </span>
        </label>
        {draft.utmEnabled && (
          <>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[12px]">
              <UtmChip name="source" value={UTM_SOURCE} />
              <UtmChip name="medium" value={UTM_MEDIUM} />
              <label className="flex items-center gap-1.5 rounded-lg border border-primary bg-card px-2.5 py-1">
                <span className="text-[11px] text-subtle">campaign</span>
                <input
                  value={draft.utmCampaign}
                  onChange={(event) =>
                    onChange({
                      ...draft,
                      utmCampaign: event.target.value,
                      utmEdited: true,
                    })
                  }
                  aria-label="utm_campaign"
                  className="w-[180px] bg-transparent font-medium text-strong outline-none"
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="min-w-px flex-1 truncate font-mono text-[12px] text-body">
                {link}
              </span>
              <button
                type="button"
                onClick={() => copyLink(link)}
                className="shrink-0 text-[12px] font-medium text-primary"
              >
                복사
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function UtmChip({ name, value }: { name: string; value: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg border border-hairline bg-card px-2.5 py-1">
      <span className="text-[11px] text-subtle">{name}</span>
      <span className="font-medium text-strong">{value}</span>
    </span>
  );
}

async function copyLink(link: string) {
  try {
    await navigator.clipboard.writeText(link);
    toast.success('복사했어요');
  } catch {
    toast.error('복사하지 못했어요');
  }
}

function Field({
  label,
  error,
  counter,
  over,
  children,
}: {
  label: string;
  error?: string;
  counter?: string;
  over?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center text-[13px] text-subtle">
        {label}
        {counter && (
          <span
            className={cn('ml-auto text-[12px]', over && 'text-destructive')}
          >
            {counter}
          </span>
        )}
      </span>
      {children}
      {error && <span className="text-[12px] text-destructive">{error}</span>}
    </label>
  );
}
