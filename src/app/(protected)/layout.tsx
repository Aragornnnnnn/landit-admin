// 보호 구역 레이아웃 — 인증 판단은 proxy.ts가 이미 했다. 여기선 셸만 씌운다. 서버 카드의 호스트는 env에서 읽는다 (비밀 아님)
import { ProtectedShell } from './_ui/ProtectedShell';

function apiHostForDisplay(): string {
  const configured = process.env.NEXT_PUBLIC_API_HOST;
  if (configured) return configured;
  try {
    return new URL(process.env.API_BASE_URL ?? '').host;
  } catch {
    return '';
  }
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedShell apiHost={apiHostForDisplay()}>{children}</ProtectedShell>
  );
}
