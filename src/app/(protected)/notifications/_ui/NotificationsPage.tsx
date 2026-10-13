'use client';

// 체험 알림 설정과 테스트 이메일 발송·작업 조회를 조립한다.
import { useState } from 'react';

import type { NotificationJob } from '../_api/notifications';
import { EmailTestCard } from './EmailTestCard';
import { NotificationJobCard } from './NotificationJobCard';
import { ReminderSettingsCard } from './ReminderSettingsCard';

export function NotificationsPage() {
  const [accepted, setAccepted] = useState<NotificationJob | null>(null);
  return (
    <div className="grid items-start gap-5 pt-1 pb-12 xl:grid-cols-2">
      <ReminderSettingsCard />
      <div className="space-y-5">
        <EmailTestCard onAccepted={setAccepted} />
        <NotificationJobCard
          key={accepted?.id ?? 'lookup'}
          accepted={accepted}
        />
      </div>
    </div>
  );
}
