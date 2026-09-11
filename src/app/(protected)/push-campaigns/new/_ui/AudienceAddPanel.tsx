'use client';

// 대상 추가 패널 — 사용자 목록 · ID 붙여넣기 · SQL · 제외 중 한 방법만 펼친다 (Figma 2177:285 "대상 추가").
// 각 탭은 "추가"를 눌러야 대상 목록에 들어간다 — 쓰는 중인 값이 예상 대상을 흔들지 않게
import { useState } from 'react';

import {
  parseIdList,
  unionIds,
  type AudienceDraft,
} from '@/features/push-campaign/model/audience';
import { usePushAudienceQueryMutation } from '@/features/push-campaign/model/usePushCampaignMutation';
import { cn } from '@/shared/lib/cn';
import { formatCount } from '@/shared/lib/format-count';
import { Button } from '@/shared/ui/shadcn/button';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import {
  USER_PICK_PAGE_SIZE,
  useUserPickQuery,
} from '../_model/useUserPickQuery';

export type AddTab = 'users' | 'paste' | 'sql' | 'exclude';

const TABS: { value: AddTab; label: string }[] = [
  { value: 'users', label: '사용자 목록' },
  { value: 'paste', label: 'ID 붙여넣기' },
  { value: 'sql', label: 'SQL' },
  { value: 'exclude', label: '제외' },
];

interface AudienceAddPanelProps {
  audience: AudienceDraft;
  tab: AddTab;
  onTabChange: (tab: AddTab) => void;
  onChange: (audience: AudienceDraft) => void;
}

const MONO_FIELD =
  'rounded-[10px] border-hairline bg-card px-3.5 py-2.5 font-mono text-[13px] shadow-none placeholder:font-sans placeholder:text-subtle';

export function AudienceAddPanel({
  audience,
  tab,
  onTabChange,
  onChange,
}: AudienceAddPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-background p-3.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[13px] font-medium text-strong">대상 추가</span>
        <div
          role="tablist"
          className="flex gap-1 rounded-[10px] bg-hairline p-1"
        >
          {TABS.map((entry) => (
            <button
              key={entry.value}
              type="button"
              role="tab"
              aria-selected={tab === entry.value}
              onClick={() => onTabChange(entry.value)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-[12px] font-medium text-subtle transition-colors',
                tab === entry.value && 'bg-card text-strong shadow-sm',
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'users' && (
        <UserPickTab
          selected={audience.selectedIds}
          onAdd={(ids) =>
            onChange({
              ...audience,
              selectedIds: unionIds(audience.selectedIds, ids),
            })
          }
        />
      )}
      {tab === 'paste' && (
        <IdPasteTab
          key="paste"
          initial={audience.pastedIds}
          onAdd={(ids) => onChange({ ...audience, pastedIds: ids })}
        />
      )}
      {tab === 'sql' && (
        <SqlTab
          initial={audience.sql}
          onAdd={(sql, sqlIds) => onChange({ ...audience, sql, sqlIds })}
        />
      )}
      {tab === 'exclude' && (
        <IdPasteTab
          key="exclude"
          initial={audience.excludedIds}
          exclude
          onAdd={(ids) => onChange({ ...audience, excludedIds: ids })}
        />
      )}
    </div>
  );
}

// 사용자 목록 — 서버 필터로 한 장씩. 검색은 불러온 장 안에서만(BE에 검색이 없다)
function UserPickTab({
  selected,
  onAdd,
}: {
  selected: number[];
  onAdd: (ids: number[]) => void;
}) {
  const [page, setPage] = useState(0);
  const [pushConsentOnly, setPushConsentOnly] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [pending, setPending] = useState<number[]>([]);
  const users = useUserPickQuery({ page, activeOnly: true, pushConsentOnly });

  const needle = keyword.trim().toLowerCase();
  const rows = (users.data?.items ?? []).filter(
    (user) =>
      !needle ||
      String(user.userProfileId).includes(needle) ||
      (user.email ?? '').toLowerCase().includes(needle) ||
      (user.nickname ?? '').toLowerCase().includes(needle),
  );
  const total = users.data?.totalCount;
  const from = page * USER_PICK_PAGE_SIZE + 1;
  const to = page * USER_PICK_PAGE_SIZE + (users.data?.items.length ?? 0);

  const selectedSet = new Set(selected);
  const pendingSet = new Set(pending);
  const toggle = (id: number, checked: boolean) =>
    setPending((ids) =>
      checked
        ? ids.includes(id)
          ? ids
          : [...ids, id]
        : ids.filter((v) => v !== id),
    );

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="이메일 · 닉네임 · ID"
          aria-label="사용자 검색"
          className="h-auto flex-1 rounded-[10px] border-hairline bg-card px-3.5 py-2 text-[13px] shadow-none placeholder:text-subtle"
        />
        <FilterChip on>활성</FilterChip>
        <FilterChip
          on={pushConsentOnly}
          onClick={() => setPushConsentOnly((v) => !v)}
        >
          알림 허용
        </FilterChip>
      </div>

      <ul className="flex flex-col rounded-[10px] border border-hairline bg-card p-1">
        {users.isPending ? (
          <li className="px-3 py-6 text-center text-[13px] text-subtle">
            불러오는 중
          </li>
        ) : users.isError ? (
          <li className="px-3 py-6 text-center text-[13px] text-subtle">
            사용자를 불러오지 못했어요
          </li>
        ) : rows.length === 0 ? (
          <li className="px-3 py-6 text-center text-[13px] text-subtle">
            조건에 맞는 사용자가 없어요
          </li>
        ) : (
          rows.map((user) => {
            const already = selectedSet.has(user.userProfileId);
            const checked = already || pendingSet.has(user.userProfileId);
            return (
              <li key={user.userProfileId}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-hairline">
                  <Checkbox
                    checked={checked}
                    disabled={already}
                    onCheckedChange={(value) =>
                      toggle(user.userProfileId, value === true)
                    }
                  />
                  <span className="text-[12px] text-subtle">
                    #{user.userProfileId}
                  </span>
                  <span className="text-[13px] font-medium text-strong">
                    {user.nickname || '—'}
                  </span>
                  <span className="truncate text-[12px] text-subtle">
                    {user.email}
                  </span>
                </label>
              </li>
            );
          })
        )}
      </ul>

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-subtle">
          {users.data
            ? `${from}–${to}${total !== undefined ? ` / ${formatCount(total)}` : ''}`
            : ''}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!users.data?.hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
          <Button
            size="sm"
            disabled={pending.length === 0}
            onClick={() => {
              onAdd(pending);
              setPending([]);
            }}
          >
            {pending.length}명 추가
          </Button>
        </span>
      </div>
    </>
  );
}

// ID 붙여넣기 — 제외 탭도 같은 입력이다. "추가"는 목록을 통째로 바꾼다(수정에서 열어도 같은 동작)
function IdPasteTab({
  initial,
  exclude,
  onAdd,
}: {
  initial: number[];
  exclude?: boolean;
  onAdd: (ids: number[]) => void;
}) {
  const [text, setText] = useState(initial.join(', '));
  const parsed = parseIdList(text);
  return (
    <>
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="1284, 1283 1279&#10;1201"
        aria-label={exclude ? '제외할 ID' : '붙여넣을 ID'}
        rows={3}
        className={cn(MONO_FIELD, 'min-h-0')}
      />
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-subtle">
          {parsed.recognized}개 인식
          {parsed.duplicates > 0 && ` · 중복 ${parsed.duplicates}개 제거`}
          {parsed.invalid > 0 && ` · 잘못된 값 ${parsed.invalid}개`}
        </span>
        <Button
          size="sm"
          className="ml-auto"
          disabled={parsed.ids.length === 0}
          onClick={() => onAdd(parsed.ids)}
        >
          {exclude ? '제외 추가' : '추가'}
        </Button>
      </div>
    </>
  );
}

// SQL — 조회로 인원을 확인한 뒤 추가한다. 문장은 발송 시 BE가 다시 실행하므로 결과 ID는 화면 합산에만 쓴다
function SqlTab({
  initial,
  onAdd,
}: {
  initial: string;
  onAdd: (sql: string, ids: number[]) => void;
}) {
  const [sql, setSql] = useState(initial);
  const [result, setResult] = useState<{ sql: string; ids: number[] }>();
  const query = usePushAudienceQueryMutation();
  const fresh = result && result.sql === sql.trim();
  return (
    <>
      <Textarea
        value={sql}
        onChange={(event) => setSql(event.target.value)}
        placeholder="SELECT u.id AS user_profile_id FROM public.user_profile u WHERE …"
        aria-label="대상 SQL"
        rows={5}
        className={cn(MONO_FIELD, 'min-h-0')}
      />
      <div className="flex items-center gap-2.5">
        <Button
          variant="secondary"
          size="sm"
          disabled={!sql.trim() || query.isPending}
          onClick={() =>
            query.mutate(sql.trim(), {
              onSuccess: (ids) => setResult({ sql: sql.trim(), ids }),
            })
          }
        >
          조회
        </Button>
        {fresh && (
          <span className="text-[12px] font-medium text-success">
            {formatCount(result.ids.length)}명
          </span>
        )}
        <Button
          size="sm"
          className="ml-auto"
          disabled={!fresh}
          onClick={() => fresh && onAdd(result.sql, result.ids)}
        >
          추가
        </Button>
      </div>
    </>
  );
}

function FilterChip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={!onClick}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
        on ? 'bg-primary/10 text-primary' : 'bg-muted text-body',
      )}
    >
      {children}
    </button>
  );
}
