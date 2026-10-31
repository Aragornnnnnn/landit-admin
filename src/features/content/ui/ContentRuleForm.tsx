'use client';

// 제작 규칙 등록 폼 — scope · 규칙 문장 · 출처 코멘트(읽기 전용). 규칙 화면의 등록 카드와 Day 상세의 "규칙으로 승격" Dialog가 같이 쓴다 (docs/screens/content-batches.md "제작 규칙")
import { useState } from 'react';

import { Button } from '@/shared/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';
import { Textarea } from '@/shared/ui/shadcn/textarea';

import {
  CONTENT_RULE_SCOPES,
  type ContentRuleRequest,
  type ContentRuleScope,
} from '../api/content-rule';

export const RULE_TEXT_MAX = 2000;

interface ContentRuleFormProps {
  /** 미리 채울 값 — 승격이면 결함 reason·코멘트 본문. 바뀌면 부모가 key로 다시 마운트한다 */
  initial: ContentRuleRequest;
  pending: boolean;
  submitLabel?: string;
  onSubmit: (body: ContentRuleRequest) => void;
  onCancel?: () => void;
}

export function ContentRuleForm({
  initial,
  pending,
  submitLabel = '등록',
  onSubmit,
  onCancel,
}: ContentRuleFormProps) {
  const [scope, setScope] = useState<ContentRuleScope>(initial.scope);
  const [ruleText, setRuleText] = useState(initial.ruleText);
  const text = ruleText.trim();
  const invalid = text.length === 0 || text.length > RULE_TEXT_MAX;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (invalid || pending) return;
        onSubmit({
          scope,
          ruleText: text,
          sourceCommentId: initial.sourceCommentId,
        });
      }}
    >
      <fieldset disabled={pending} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-strong">scope</span>
            <Select
              value={scope}
              onValueChange={(value) => setScope(value as ContentRuleScope)}
            >
              <SelectTrigger
                aria-label="scope"
                className="h-auto w-[170px] rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] font-medium shadow-none"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_RULE_SCOPES.map((value) => (
                  <SelectItem key={value} value={value} className="text-[13px]">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          {initial.sourceCommentId !== undefined && (
            <p className="flex flex-col gap-1.5 text-[13px]">
              <span className="font-medium text-strong">출처</span>
              <span className="rounded-xl bg-muted px-4 py-3 text-body">
                코멘트 #{initial.sourceCommentId}
              </span>
            </p>
          )}
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-strong">
            규칙 문장 (한국어, 한 문단, {RULE_TEXT_MAX.toLocaleString()}자)
          </span>
          <Textarea
            value={ruleText}
            maxLength={RULE_TEXT_MAX}
            rows={4}
            onChange={(event) => setRuleText(event.target.value)}
            className="min-h-0 rounded-xl border-transparent bg-muted px-4 py-3 text-[14px] shadow-none"
          />
        </label>
        <p className="text-[12px] leading-[1.5] text-subtle">
          코드는 scope 접두어 + 다음 번호(예: Q-32)로 자동 매겨져요. 다음 AI
          호출부터 프롬프트에 들어가요.
        </p>
      </fieldset>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onCancel}
          >
            취소
          </Button>
        )}
        <Button type="submit" disabled={invalid || pending}>
          {pending ? '등록 중…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
