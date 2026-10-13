// 무료 체험 채널 설정과 비동기 테스트 이메일의 API 계약을 연결한다.
import { api } from '@/shared/api/client';
import type { Schema } from '@/shared/api/schema-patch';

export type ReminderSettings = Schema<'TrialReminderSettings'>;
export type NotificationJob = Schema<'NotificationJobView'> & {
  id: string;
  status: string;
};
const PATH = '/api/v1/admin/notifications';
function checkSettings(data: ReminderSettings): ReminderSettings {
  if (
    typeof data?.emailEnabled !== 'boolean' ||
    typeof data?.pushEnabled !== 'boolean'
  )
    throw new Error('알림 설정 응답이 올바르지 않습니다.');
  return data;
}
function checkJob(data: Schema<'NotificationJobView'>): NotificationJob {
  if (!data?.id || !data.status)
    throw new Error('발송 작업 응답이 올바르지 않습니다.');
  return { ...data, id: data.id, status: data.status };
}
export const fetchReminderSettings = async () =>
  checkSettings(
    await api.get<ReminderSettings>(`${PATH}/trial-reminder-settings`),
  );
export const saveReminderSettings = async (settings: ReminderSettings) =>
  checkSettings(
    await api.put<ReminderSettings>(
      `${PATH}/trial-reminder-settings`,
      settings,
    ),
  );
export const sendTestEmail = async (recipient: string, key: string) =>
  checkJob(
    await api.post<Schema<'NotificationJobView'>>(
      `${PATH}/email-tests`,
      { recipient },
      { headers: { 'Idempotency-Key': key } },
    ),
  );
export const fetchNotificationJob = async (id: string) =>
  checkJob(
    await api.get<Schema<'NotificationJobView'>>(
      `${PATH}/jobs/${encodeURIComponent(id)}`,
    ),
  );
