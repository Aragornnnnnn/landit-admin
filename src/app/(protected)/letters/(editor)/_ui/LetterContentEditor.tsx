'use client';

// 게시 언어와 작성 탭을 구분하고 한 언어의 폼·미리보기만 표시한다.
import { useState, type Dispatch, type SetStateAction } from 'react';

import type { LetterLocale } from '@/features/letter/api/letter-list';
import { LETTER_LOCALE_LABEL } from '@/features/letter/model/letter-label';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/shadcn/tabs';

import {
  withLanguageMode,
  type LetterContentDraft,
  type LetterDraft,
} from '../_model/letter-draft';
import { LetterBasicFields } from './LetterBasicFields';
import { LetterBodyCard } from './LetterBodyCard';
import { LetterPreview } from './LetterPreview';
import { LetterTemplateRow } from './LetterTemplateRow';

interface LetterContentEditorProps {
  draft: LetterDraft;
  onChange: Dispatch<SetStateAction<LetterDraft>>;
  date: string;
}

const LOCALES: LetterLocale[] = ['ko', 'ja'];

export function LetterContentEditor({
  draft,
  onChange,
  date,
}: LetterContentEditorProps) {
  const [editingLocale, setEditingLocale] = useState(draft.locale);
  const activeLocale = draft.includeTranslation ? editingLocale : draft.locale;
  const preview = localizedDraft(draft, activeLocale);
  const mode = draft.includeTranslation ? 'both' : draft.locale;

  return (
    <>
      <section
        className="flex flex-col gap-3 rounded-[20px] bg-card p-5 sm:p-6"
        aria-label="공지 언어"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13px] text-subtle">게시할 언어</span>
          <div className="flex flex-wrap gap-2">
            {(['ko', 'ja', 'both'] as const).map((value) => (
              <Button
                key={value}
                variant={mode === value ? 'default' : 'secondary'}
                aria-pressed={mode === value}
                onClick={() => {
                  onChange((current) => withLanguageMode(current, value));
                  setEditingLocale(value === 'both' ? draft.locale : value);
                }}
              >
                {value === 'both'
                  ? '한국어 · 일본어'
                  : LETTER_LOCALE_LABEL[value]}
              </Button>
            ))}
          </div>
        </div>
        <p className="text-sm text-subtle">
          선택한 언어를 사용하는 사용자에게만 보여요. 두 언어는 함께 발행돼요.
        </p>
      </section>

      <Tabs
        value={activeLocale}
        onValueChange={(value) => setEditingLocale(value as LetterLocale)}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {draft.includeTranslation && (
              <TabsList
                aria-label="작성 언어"
                className="h-10 w-full sm:w-auto sm:self-start"
              >
                {LOCALES.map((locale) => (
                  <TabsTrigger key={locale} value={locale} className="px-6">
                    {LETTER_LOCALE_LABEL[locale]}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
            {LOCALES.map((locale) => (
              <TabsContent
                key={locale}
                value={locale}
                forceMount
                hidden={activeLocale !== locale}
                className={
                  activeLocale === locale ? 'flex flex-col gap-4' : 'hidden'
                }
              >
                <LocaleFields
                  locale={locale}
                  draft={draft}
                  onChange={onChange}
                />
              </TabsContent>
            ))}
          </div>
          <section
            aria-label={`${LETTER_LOCALE_LABEL[activeLocale]} 미리보기`}
            className="flex justify-center xl:sticky xl:top-4"
          >
            <LetterPreview draft={preview} date={date} />
          </section>
        </div>
      </Tabs>
    </>
  );
}

function LocaleFields({
  locale,
  draft,
  onChange,
}: Omit<LetterContentEditorProps, 'date'> & { locale: LetterLocale }) {
  const content = localizedDraft(draft, locale);
  const update = (
    patch: Partial<LetterContentDraft>,
    settings?: Pick<LetterDraft, 'type' | 'pinned'>,
  ) =>
    onChange((current) => {
      const next = { ...current, ...settings };
      // 업로드가 끝날 때의 최신 초안에 해당 언어만 반영한다. 탭·게시 언어 전환 중에도 다른 입력을 보존한다.
      return current.locale === locale
        ? { ...next, ...patch }
        : { ...next, translation: { ...current.translation, ...patch } };
    });

  return (
    <>
      {locale === 'ko' && (
        <LetterTemplateRow
          draft={content}
          onChange={(value) =>
            update(
              { title: value.title, preview: value.preview, body: value.body },
              { type: value.type, pinned: value.pinned },
            )
          }
        />
      )}
      <LetterBasicFields
        draft={content}
        languageLabel={LETTER_LOCALE_LABEL[locale]}
        onChange={(value) =>
          update(
            { title: value.title, preview: value.preview },
            { type: value.type, pinned: value.pinned },
          )
        }
      />
      <LetterBodyCard
        label={`${LETTER_LOCALE_LABEL[locale]} 본문`}
        body={content.body}
        onChange={(body) => update({ body })}
      />
    </>
  );
}

function localizedDraft(draft: LetterDraft, locale: LetterLocale): LetterDraft {
  return locale === draft.locale ? draft : { ...draft, ...draft.translation };
}
