'use client';

// 진행 확인 — 라인업을 확정하면 더 못 고치고 Day 생성 비용이 든다는 것을 말한다 (docs/screens/content-batches.md "정확한 카피")
import { estimateGeneration } from '@/features/content/model/batch-request';
import { ActionConfirmDialog } from '@/shared/ui/ActionConfirmDialog';

interface ProceedDialogProps {
  open: boolean;
  dayCount: number;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ProceedDialog({
  open,
  dayCount,
  pending,
  onCancel,
  onConfirm,
}: ProceedDialogProps) {
  const estimate = estimateGeneration(dayCount);
  return (
    <ActionConfirmDialog
      open={open}
      title={`라인업을 확정하고 Day ${dayCount}개를 만들까요?`}
      pending={pending}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <p>
        Day마다 질문 9개·표현 12개·별점 5개를 만들어요. 약 {estimate.minutes}분
        · {estimate.dollars}달러.
      </p>
      <p>라인업은 더 고칠 수 없어요.</p>
    </ActionConfirmDialog>
  );
}
