// Day 목록 위 배너 — 승인·재시작 규칙 안내(오렌지), 실패 사유(빨강), 승인 뒤 예약 id 범위(초록). 2차 화면은 없어 "에셋 생성 대기"까지
import type { ContentBatch } from '@/features/content/api/content-batch';

interface BatchBannersProps {
  batch: ContentBatch;
  reserved: { min: number; max: number } | null;
}

export function BatchBanners({ batch, reserved }: BatchBannersProps) {
  const approved =
    batch.status === 'APPROVED' ||
    batch.status === 'ASSETS_GENERATING' ||
    batch.status === 'ASSETS_REVIEW_READY' ||
    batch.status === 'ASSETS_READY' ||
    batch.status === 'PUBLISHED';
  return (
    <>
      {batch.status === 'FAILED' && batch.errorMessage && (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 text-[13px] text-destructive"
        >
          {batch.errorMessage}
        </p>
      )}
      {approved ? (
        <p className="rounded-xl bg-success/10 px-4 py-3 text-[13px] text-success">
          승인됨
          {reserved && ` · 표현 id ${reserved.min}~${reserved.max} 예약`} · 에셋
          생성 대기
        </p>
      ) : (
        <p className="rounded-xl bg-primary/10 px-4 py-3 text-[13px] leading-[1.5] text-primary">
          승인은 Day {batch.dayCount}개가 모두 OK일 때 켜져요. 승인하면 Day마다
          표현 id 12개를 예약하고 2차 에셋 생성 단계로 넘어가요. 재시작은 배치가
          FAILED이거나 heartbeat가 멈춘 GENERATING(마지막 갱신 16분 이상 전)일
          때만 켜져요.
        </p>
      )}
    </>
  );
}
