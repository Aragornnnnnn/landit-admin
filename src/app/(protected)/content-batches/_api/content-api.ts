// 생성·검수 요청을 기존 관리자 프록시와 OpenAPI 요청 타입으로 연결한다.
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export const CONTENT_ROOT = '/api/v1/admin/content-batches';
export type ContentCommand =
  | { kind: 'create'; request: Schema<'AdminContentBatchCreateRequest'> }
  | { kind: 'proceed' | 'approve'; batchId: number }
  | { kind: 'lineup'; batchId: number; comment: string }
  | {
      kind: 'review';
      batchId: number;
      draftId: number;
      request: Schema<'AdminContentDraftReviewRequest'>;
    }
  | { kind: 'regenerate'; batchId: number; draftId: number; scope: string };
type CommandResult =
  Schema<'AdminContentBatchResponse'> | Schema<'AdminContentDraftDetail'>;

/** 확인한 사용자 작업만 서버에 보내며 실패를 호출자에게 그대로 전달한다. */
export function runContentCommand(
  command: ContentCommand,
): Promise<CommandResult> {
  if (command.kind === 'create')
    return api.post(CONTENT_ROOT, { ...command.request, autoProceed: false });
  const path = `${CONTENT_ROOT}/${command.batchId}`;
  switch (command.kind) {
    case 'lineup':
      return api.post(`${path}/lineup/regenerate`, {
        comment: command.comment,
      });
    case 'review':
      return api.put(
        `${path}/drafts/${command.draftId}/review`,
        command.request,
      );
    case 'regenerate':
      return api.post(`${path}/drafts/${command.draftId}/regenerate`, {
        scope: command.scope,
      });
    default:
      return api.post(`${path}/${command.kind}`);
  }
}
