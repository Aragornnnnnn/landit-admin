'use client';

// 새 규칙 등록 카드 — Day 상세의 "규칙으로 승격" Dialog와 같은 폼(ContentRuleForm). 성공하면 입력을 비운다 (Figma 4133:855)
import { useState } from 'react';

import type {
  ContentRuleRequest,
  ContentRuleScope,
} from '@/features/content/api/content-rule';
import { ContentRuleForm } from '@/features/content/ui/ContentRuleForm';

interface CreateRuleCardProps {
  /** 칩으로 고른 scope를 기본값으로 — 보고 있는 scope에 보태는 경우가 대부분 */
  defaultScope: ContentRuleScope;
  pending: boolean;
  onCreate: (body: ContentRuleRequest, done: () => void) => void;
}

export function CreateRuleCard({
  defaultScope,
  pending,
  onCreate,
}: CreateRuleCardProps) {
  // 등록에 성공할 때마다 폼을 새로 마운트해 비운다 — 폼은 자기 상태를 갖고 있다
  const [generation, setGeneration] = useState(0);

  return (
    <section className="flex flex-col gap-4 rounded-[20px] bg-card px-6 py-5">
      <h2 className="text-[15px] font-bold text-strong">새 규칙 등록</h2>
      <ContentRuleForm
        key={`${generation}:${defaultScope}`}
        initial={{ scope: defaultScope, ruleText: '' }}
        pending={pending}
        onSubmit={(body) =>
          onCreate(body, () => setGeneration((current) => current + 1))
        }
      />
      <p className="text-[12px] leading-[1.5] text-subtle">
        같은 번호가 동시에 등록되면 409가 나요. 은퇴한 규칙은 프롬프트에서
        빠지고 목록에 이력으로 남아요.
      </p>
    </section>
  );
}
